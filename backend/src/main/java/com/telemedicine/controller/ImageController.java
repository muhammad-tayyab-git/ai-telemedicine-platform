package com.telemedicine.controller;

import com.telemedicine.dto.response.ApiResponse;
import com.telemedicine.dto.response.ImageAnalysisResponse;
import com.telemedicine.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Image Screening", description = "AI-powered medical image analysis")
@SecurityRequirement(name = "bearerAuth")
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a medical image for AI screening")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<ImageAnalysisResponse>> analyze(
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        ImageAnalysisResponse result = imageService.analyzeImage(file);
        return ResponseEntity.ok(ApiResponse.ok("Image analysis complete", result));
    }
}
