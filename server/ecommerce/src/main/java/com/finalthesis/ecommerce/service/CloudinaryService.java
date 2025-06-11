package com.finalthesis.ecommerce.service;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    String uploadFile(MultipartFile file) throws IOException;

    CompletableFuture<String> uploadFileAsync(MultipartFile file);
}
