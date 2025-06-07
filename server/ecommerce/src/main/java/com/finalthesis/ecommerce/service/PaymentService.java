package com.finalthesis.ecommerce.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finalthesis.ecommerce.dto.request.payment.*;
import com.finalthesis.ecommerce.entity.Order;
import com.finalthesis.ecommerce.entity.User;
import com.finalthesis.ecommerce.enums.OrderStatus;
import com.finalthesis.ecommerce.enums.PaymentMethod;
import com.finalthesis.ecommerce.enums.PaymentStatus;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.repository.*;
import com.finalthesis.ecommerce.utils.VNPayUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PaymentService {
    @NonFinal
    @Value("${vnpay.tmn_code}")
    protected String VNP_TMN_CODE;

    @NonFinal
    @Value("${vnpay.hash_secret}")
    protected String VNP_HASH_SECRET;

    @NonFinal
    @Value("${vnpay.payment_url}")
    protected String VNP_PAYMENT_URL;

    @NonFinal
    @Value("${vnpay.return_url}")
    protected String VNP_RETURN_URL;

    @NonFinal
    @Value("${vnpay.version}")
    protected String VNP_VERSION;

    @NonFinal
    @Value("${vnpay.command}")
    protected String VNP_COMMAND;

    @NonFinal
    @Value("${vnpay.order_type}")
    protected String VNP_ORDER_TYPE;

    OrderRepository orderRepository;
    ProductItemRepository productItemRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    ShopRepository shopRepository;

    @Transactional
    public String createOrder(CreateOrderRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var productItem = productItemRepository
                .findById(request.getProductItemId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ITEM_NOT_FOUND));

        var product = productRepository
                .findById(productItem.getProduct().getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        var shop = shopRepository
                .findById(product.getShop().getId())
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));

        if (productItem.getQuantityInStock() < request.getQuantity())
            throw new RuntimeException("Do not have enough stock");

        Order order = Order.builder()
                .orderCode("ORDER" + System.currentTimeMillis())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .shippingAddress(request.getShippingAddress())
                .quantity(request.getQuantity())
                .totalAmount(request.getTotalPrice())
                .status(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .paymentStatus(PaymentStatus.PENDING)
                .user(user)
                .shop(shop)
                .productItem(productItem)
                .build();

        return createVNPayPayment(orderRepository.save(order));
    }

    public String createVNPayPayment(Order order) {
        String vnp_Amount = String.valueOf(
                order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNP_VERSION);
        vnp_Params.put("vnp_Command", VNP_COMMAND);
        vnp_Params.put("vnp_TmnCode", VNP_TMN_CODE);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", order.getOrderCode());
        vnp_Params.put("vnp_OrderInfo", "Order Information");
        vnp_Params.put("vnp_OrderType", VNP_ORDER_TYPE);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNP_RETURN_URL);
        vnp_Params.put("vnp_IpAddr", "1.1.1.1");
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        String queryUrl = VNPayUtils.getPaymentURL(vnp_Params, false);
        String vnp_SecureHash = VNPayUtils.hmacSHA512(VNP_HASH_SECRET, queryUrl);
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return VNP_PAYMENT_URL + "?" + queryUrl;
    }

    @Transactional
    public PaymentReturnResponse processIpn(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        params.remove("vnp_SecureHash");

        String signValue = VNPayUtils.getPaymentURL(params, false);
        String vnp_SecureHashValid = VNPayUtils.hmacSHA512(VNP_HASH_SECRET, signValue);

        if (vnp_SecureHashValid.equals(vnp_SecureHash)) {
            String orderCode = params.get("vnp_TxnRef");
            String vnp_ResponseCode = params.get("vnp_ResponseCode");
            String vnp_Amount = params.get("vnp_Amount");

            Order order = orderRepository
                    .findByOrderCode(orderCode)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            var productItem = productItemRepository
                    .findById(order.getProductItem().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ITEM_NOT_FOUND));

            var product = productRepository
                    .findById(productItem.getProduct().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if ("00".equals(vnp_ResponseCode)) {
                // Succeed Payment
                productItem.setQuantityInStock(productItem.getQuantityInStock() - order.getQuantity());
                product.setQuantityInStock(product.getQuantityInStock() - order.getQuantity());

                int quantityInStock = 0;
                if (product.getBuyTurn() == null) quantityInStock = 0;
                else quantityInStock = product.getBuyTurn();

                product.setBuyTurn(quantityInStock + order.getQuantity());

                order.setPaymentStatus(PaymentStatus.PAID);
                order.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);

                return PaymentReturnResponse.builder()
                        .success(true)
                        .message("Thanh toán thành công")
                        .orderCode(orderCode)
                        .totalPrice(new BigDecimal(vnp_Amount).divide(BigDecimal.valueOf(100)))
                        .build();
            } else {
                // Failed Payment
                order.setPaymentStatus(PaymentStatus.FAILED);
                orderRepository.save(order);

                return PaymentReturnResponse.builder()
                        .success(false)
                        .message("Thanh toán thất bại")
                        .orderCode(orderCode)
                        .build();
            }
        } else
            return PaymentReturnResponse.builder()
                    .success(false)
                    .message("Chữ ký không hợp lệ")
                    .build();
    }
}
