package com.telemedicine.service;

import com.telemedicine.dto.response.ImageAnalysisResponse;
import com.telemedicine.exception.ResourceNotFoundException;
import com.telemedicine.integration.AiServiceClient;
import com.telemedicine.model.entity.Patient;
import com.telemedicine.repository.PatientRepository;
import com.telemedicine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {

    private final AiServiceClient aiServiceClient;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10MB
    private static final java.util.Set<String> ALLOWED_TYPES = java.util.Set.of(
        "image/jpeg", "image/png", "image/bmp", "image/tiff", "image/webp"
    );

    public ImageAnalysisResponse analyzeImage(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("File exceeds maximum size of 10MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                "Unsupported file type. Allowed: JPG, PNG, BMP, TIFF, WEBP"
            );
        }

        // Get current patient (auto-create if needed)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        patientRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                Patient newPatient = Patient.builder().user(user).build();
                return patientRepository.save(newPatient);
            });

        String filename = file.getOriginalFilename() != null
            ? file.getOriginalFilename() : "upload.png";

        log.info("Calling AI image service for file: {}", filename);
        byte[] imageBytes = file.getBytes();
        AiServiceClient.ImageAnalysisResponse aiResult =
            aiServiceClient.analyzeImage(imageBytes, filename);

        return ImageAnalysisResponse.builder()
            .id(UUID.randomUUID().toString())
            .filename(filename)
            .imageType(aiResult.getFinding() != null ? detectImageType(filename) : "OTHER")
            .finding(aiResult.getFinding())
            .confidenceScore(aiResult.getConfidenceScore())
            .recommendation(aiResult.getRecommendation())
            .requiresUrgentReview(false)
            .createdAt(LocalDateTime.now())
            .build();
    }

    private String detectImageType(String filename) {
        String name = filename.toLowerCase();
        if (name.contains("xray") || name.contains("x-ray") || name.contains("chest"))
            return "XRAY";
        if (name.contains("mri") || name.contains("brain")) return "MRI";
        if (name.contains("ct") || name.contains("scan")) return "CT_SCAN";
        if (name.contains("skin") || name.contains("derm")) return "DERMATOLOGY";
        return "OTHER";
    }
}
