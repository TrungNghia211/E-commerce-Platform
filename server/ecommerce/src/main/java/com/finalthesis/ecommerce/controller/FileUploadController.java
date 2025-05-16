package com.finalthesis.ecommerce.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.finalthesis.ecommerce.service.CloudinaryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileUploadController {
    CloudinaryService cloudinaryService;

    @PostMapping
    String uploadFile(@RequestParam MultipartFile file) throws IOException {
        return cloudinaryService.uploadFile(file);
    }
}
