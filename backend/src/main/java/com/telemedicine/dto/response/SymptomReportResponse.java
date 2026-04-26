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
public class SymptomReportResponse {
    private String id;
    private String symptomsText;
    private String predictedCondition;
    private String severityLevel;
    private Double confidenceScore;
    private String recommendation;
    private String status;
    private LocalDateTime createdAt;
}
