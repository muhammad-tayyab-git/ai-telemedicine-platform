package com.telemedicine.integration;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${ai.symptom-service.url}")
    private String symptomServiceUrl;

    @Value("${ai.image-service.url}")
    private String imageServiceUrl;

    // ─── Symptom Triage ───────────────────────────────────────────────────────

    public SymptomPredictionResponse analyzeSymptoms(String symptomsText) {
        try {
            SymptomRequest request = new SymptomRequest(symptomsText);
            ResponseEntity<SymptomPredictionResponse> response = restTemplate.postForEntity(
                symptomServiceUrl + "/predict",
                request,
                SymptomPredictionResponse.class
            );
            log.info("AI symptom response: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("Symptom AI service error: {}", e.getMessage());
            return SymptomPredictionResponse.fallback();
        }
    }

    // ─── Image Screening ──────────────────────────────────────────────────────

    public ImageAnalysisResponse analyzeImage(byte[] imageBytes, String filename) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("X-Filename", filename);
            HttpEntity<byte[]> entity = new HttpEntity<>(imageBytes, headers);
            ResponseEntity<ImageAnalysisResponse> response = restTemplate.exchange(
                imageServiceUrl + "/analyze",
                HttpMethod.POST,
                entity,
                ImageAnalysisResponse.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Image AI service error: {}", e.getMessage());
            return ImageAnalysisResponse.fallback();
        }
    }

    // ─── DTOs ─────────────────────────────────────────────────────────────────

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SymptomRequest {
        private String symptoms;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SymptomPredictionResponse {

        @JsonProperty("predicted_condition")
        private String predictedCondition;

        @JsonProperty("severity_level")
        private String severityLevel;

        @JsonProperty("confidence_score")
        private Double confidenceScore;

        @JsonProperty("recommendation")
        private String recommendation;

        @JsonProperty("alternative_conditions")
        private List<String> alternativeConditions;

        public static SymptomPredictionResponse fallback() {
            SymptomPredictionResponse r = new SymptomPredictionResponse();
            r.setPredictedCondition("Service unavailable — please try again");
            r.setSeverityLevel("MEDIUM");
            r.setConfidenceScore(0.0);
            r.setRecommendation("Could not reach AI service. Please consult a doctor directly.");
            r.setAlternativeConditions(List.of());
            return r;
        }
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ImageAnalysisResponse {

        @JsonProperty("finding")
        private String finding;

        @JsonProperty("confidence_score")
        private Double confidenceScore;

        @JsonProperty("recommendation")
        private String recommendation;

        @JsonProperty("image_type")
        private String imageType;

        @JsonProperty("requires_urgent_review")
        private Boolean requiresUrgentReview;

        @JsonProperty("alternative_findings")
        private List<String> alternativeFindings;

        public static ImageAnalysisResponse fallback() {
            ImageAnalysisResponse r = new ImageAnalysisResponse();
            r.setFinding("Service unavailable — please try again");
            r.setConfidenceScore(0.0);
            r.setRecommendation("Could not reach AI service. Please have this image reviewed by a doctor.");
            r.setImageType("OTHER");
            r.setRequiresUrgentReview(false);
            r.setAlternativeFindings(List.of());
            return r;
        }
    }
}
