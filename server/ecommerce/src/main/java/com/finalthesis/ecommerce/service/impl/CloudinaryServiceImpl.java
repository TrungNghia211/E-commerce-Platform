package com.finalthesis.ecommerce.service.impl;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.finalthesis.ecommerce.service.CloudinaryService;

import lombok.extern.slf4j.Slf4j;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// @FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
// public class CloudinaryServiceImpl implements CloudinaryService {
//    Cloudinary cloudinary;
//
//    @Override
//    public String uploadFile(MultipartFile file) throws IOException {
//        assert file.getOriginalFilename() != null;
//        String publicId = generatePublicId(file.getOriginalFilename());
//        String extension = getFileName(file.getOriginalFilename())[1];
//        File fileUpload = convert(file);
//        cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id", publicId));
//        cleanDisk(fileUpload);
//        return cloudinary.url().generate(StringUtils.join(publicId, ".", extension));
//    }
//
//    private File convert(MultipartFile file) throws IOException {
//        assert file.getOriginalFilename() != null;
//        File convertedFile = new File(StringUtils.join(
//                generatePublicId(file.getOriginalFilename()), getFileName(file.getOriginalFilename())[1]));
//        try (InputStream is = file.getInputStream()) {
//            Files.copy(is, convertedFile.toPath());
//        }
//        return convertedFile;
//    }
//
//    private void cleanDisk(File file) {
//        try {
//            Path filePath = file.toPath();
//            Files.delete(filePath);
//        } catch (IOException e) {
//            log.error("Error");
//        }
//    }
//
//    public String generatePublicId(String originalName) {
//        String fileName = getFileName(originalName)[0];
//        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
//    }
//
//    public String[] getFileName(String originalName) {
//        return originalName.split("\\.");
//    }
// }

@Service
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;
    private final Executor executor;

    public CloudinaryServiceImpl(Cloudinary cloudinary, @Qualifier("cloudinaryExecutor") Executor executor) {
        this.cloudinary = cloudinary;
        this.executor = executor;
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        // Chuẩn hóa tên file
        String original = FilenameUtils.getName(file.getOriginalFilename());
        String publicId = UUID.randomUUID() + "_" + FilenameUtils.getBaseName(original);

        // Thiết lập options
        Map<String, Object> options = ObjectUtils.asMap("public_id", publicId, "resource_type", "image");

        // Gửi byte[] thẳng lên Cloudinary
        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), options);

        // Trả về secure_url
        return result.get("secure_url").toString();
    }

    @Override
    public CompletableFuture<String> uploadFileAsync(MultipartFile file) {
        return CompletableFuture.supplyAsync(
                () -> {
                    try {
                        return uploadFile(file);
                    } catch (IOException e) {
                        log.error("Async upload failed for file: {}", file.getOriginalFilename(), e);
                        throw new CompletionException(e);
                    }
                },
                executor);
    }
}
