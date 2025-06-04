package com.finalthesis.ecommerce.utils;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;

import jakarta.servlet.http.HttpServletRequest;

public class VNPayUtils {
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) throw new NullPointerException();
            final HmacUtils hmacUtils = new HmacUtils(HmacAlgorithms.HMAC_SHA_512, key);
            return hmacUtils.hmacHex(data);
        } catch (Exception ex) {
            return "";
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) ipAddress = request.getRemoteAddr();
        } catch (Exception ex) {
            ipAddress = "Invalid IP:" + ex.getMessage();
        }
        return ipAddress;
    }

    public static String getPaymentURL(Map<String, String> paramsMap, boolean encodeKey) {
        return paramsMap.entrySet().stream()
                .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
                .sorted(Map.Entry.comparingByKey())
                .map(entry ->
                        (encodeKey ? URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII) : entry.getKey())
                                + "="
                                + URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                .reduce((param1, param2) -> param1 + "&" + param2)
                .orElse("");
    }
}
