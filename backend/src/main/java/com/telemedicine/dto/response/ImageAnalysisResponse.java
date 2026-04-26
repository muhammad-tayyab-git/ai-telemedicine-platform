package com.telemedicine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageAnalysisResponse {
    private String id;
    private String filename;
    private String imageType;
    private String finding;
    private Double confidenceScore;
    private String recommendation;
    private Boolean requiresUrgentReview;
    private LocalDateTime createdAt;
}
