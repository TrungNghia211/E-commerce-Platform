package com.finalthesis.ecommerce.service.impl;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

import com.finalthesis.ecommerce.constant.PredefinedRole;
import com.finalthesis.ecommerce.repository.RoleRepository;
import com.finalthesis.ecommerce.repository.address.DistrictRepository;
import com.finalthesis.ecommerce.repository.address.ProvinceRepository;
import com.finalthesis.ecommerce.repository.address.WardRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.finalthesis.ecommerce.dto.request.ShopCreationRequest;
import com.finalthesis.ecommerce.dto.response.ShopResponse;
import com.finalthesis.ecommerce.entity.*;
import com.finalthesis.ecommerce.exception.AppException;
import com.finalthesis.ecommerce.exception.ErrorCode;
import com.finalthesis.ecommerce.mapper.ShopMapper;
import com.finalthesis.ecommerce.repository.address.AddressRepository;
import com.finalthesis.ecommerce.repository.ShopRepository;
import com.finalthesis.ecommerce.repository.UserRepository;
import com.finalthesis.ecommerce.service.CloudinaryService;
import com.finalthesis.ecommerce.service.ShopService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShopServiceImpl implements ShopService {
    CloudinaryService cloudinaryService;

    AddressRepository addressRepository;
    ProvinceRepository provinceRepository;
    DistrictRepository districtRepository;
    WardRepository wardRepository;
    ShopRepository shopRepository;
    UserRepository userRepository;
    RoleRepository roleRepository;

    ShopMapper shopMapper;

    @Override
    @Transactional
    public ShopResponse createShop(ShopCreationRequest request) {
        Province province = provinceRepository
                .findById(request.getProvinceId())
                .orElseGet(() -> provinceRepository.save(Province.builder()
                        .id(request.getProvinceId())
                        .name(request.getProvinceName())
                        .build()));

        District district = districtRepository
                .findById(request.getDistrictId())
                .orElseGet(() -> districtRepository.save(District.builder()
                        .id(request.getDistrictId())
                        .name(request.getDistrictName())
                        .build()));

        Ward ward = wardRepository
                .findById(request.getWardId())
                .orElseGet(() -> wardRepository.save(Ward.builder()
                        .id(request.getWardId())
                        .name(request.getWardName())
                        .build()));

        Address address = Address.builder()
                .line(request.getAddressLine())
                .province(province)
                .district(district)
                .ward(ward)
                .build();

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Role sellerRole = roleRepository
                .findById(PredefinedRole.SELLER_ROLE)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Set<Role> roles = user.getRoles();
        roles.add(sellerRole);
        user.setRoles(roles);

        try {
            CompletableFuture<String> frontImageFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return cloudinaryService.uploadFile(request.getCitizenIdFrontImage());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
            CompletableFuture<String> backImageFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return cloudinaryService.uploadFile(request.getCitizenIdBackImage());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });

            CompletableFuture.allOf(frontImageFuture, backImageFuture).join();
            user.setCitizenIdFrontImage(frontImageFuture.join());
            user.setCitizenIdBackImage(backImageFuture.join());
        } catch (Exception e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        Shop result;
        try {
            Shop shop = shopMapper.toShop(request);
            shop.setId(request.getId());
            shop.setAddress(addressRepository.save(address));
            shop.setUser(userRepository.save(user));
            result = shopRepository.save(shop);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.SHOP_NAME_EXISTED);
        }

        return shopMapper.toShopResponse(result);
    }
}
