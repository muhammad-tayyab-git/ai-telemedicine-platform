package com.telemedicine.service;

import com.telemedicine.dto.request.SymptomRequest;
import com.telemedicine.dto.response.SymptomReportResponse;
import com.telemedicine.exception.ResourceNotFoundException;
import com.telemedicine.integration.AiServiceClient;
import com.telemedicine.model.entity.Patient;
import com.telemedicine.model.entity.SymptomReport;
import com.telemedicine.repository.PatientRepository;
import com.telemedicine.repository.SymptomReportRepository;
import com.telemedicine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SymptomService {

    private final SymptomReportRepository symptomReportRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;

    @Transactional
    public SymptomReportResponse analyzeSymptoms(SymptomRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var patient = patientRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                Patient p = Patient.builder().user(user).build();
                return patientRepository.save(p);
            });

        String naturalLanguage = request.toNaturalLanguage();
        log.info("Calling AI symptom service — symptoms: {}", request.getSelectedSymptoms());

        AiServiceClient.SymptomPredictionResponse aiResult =
            aiServiceClient.analyzeSymptoms(naturalLanguage);

        SymptomReport report = SymptomReport.builder()
            .patient(patient)
            .symptomsText(naturalLanguage)
            .predictedCondition(aiResult.getPredictedCondition())
            .severityLevel(mapSeverity(aiResult.getSeverityLevel()))
            .confidenceScore(aiResult.getConfidenceScore())
            .aiRecommendation(aiResult.getRecommendation())
            .status(SymptomReport.ReportStatus.PROCESSED)
            .build();

        SymptomReport saved = symptomReportRepository.save(report);
        log.info("Symptom report saved: {}", saved.getId());
        return mapToResponse(saved);
    }

    public List<SymptomReportResponse> getMyReports() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return patientRepository.findByUserId(user.getId())
            .map(patient -> symptomReportRepository
                .findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList()))
            .orElse(List.of());
    }

    private SymptomReport.SeverityLevel mapSeverity(String level) {
        if (level == null) return SymptomReport.SeverityLevel.MEDIUM;
        return switch (level.toUpperCase()) {
            case "LOW"      -> SymptomReport.SeverityLevel.LOW;
            case "HIGH"     -> SymptomReport.SeverityLevel.HIGH;
            case "CRITICAL" -> SymptomReport.SeverityLevel.CRITICAL;
            default         -> SymptomReport.SeverityLevel.MEDIUM;
        };
    }

    private SymptomReportResponse mapToResponse(SymptomReport r) {
        return SymptomReportResponse.builder()
            .id(r.getId())
            .symptomsText(r.getSymptomsText())
            .predictedCondition(r.getPredictedCondition())
            .severityLevel(r.getSeverityLevel() != null ? r.getSeverityLevel().name() : "MEDIUM")
            .confidenceScore(r.getConfidenceScore())
            .recommendation(r.getAiRecommendation())
            .status(r.getStatus() != null ? r.getStatus().name() : "PROCESSED")
            .createdAt(r.getCreatedAt())
            .build();
    }
}
