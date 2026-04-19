package com.telemedicine.integration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    // ─── Request / Response DTOs ──────────────────────────────────────────────

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SymptomRequest {
        private String symptoms;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SymptomPredictionResponse {
        private String predictedCondition;
        private String severityLevel;
        private Double confidenceScore;
        private String recommendation;

        public static SymptomPredictionResponse fallback() {
            SymptomPredictionResponse r = new SymptomPredictionResponse();
            r.setPredictedCondition("Service unavailable");
            r.setSeverityLevel("UNKNOWN");
            r.setConfidenceScore(0.0);
            r.setRecommendation("Please consult a doctor directly.");
            return r;
        }
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ImageAnalysisResponse {
        private String finding;
        private Double confidenceScore;
        private String recommendation;

        public static ImageAnalysisResponse fallback() {
            ImageAnalysisResponse r = new ImageAnalysisResponse();
            r.setFinding("Service unavailable");
            r.setConfidenceScore(0.0);
            r.setRecommendation("Please consult a radiologist directly.");
            return r;
        }
    }
}
