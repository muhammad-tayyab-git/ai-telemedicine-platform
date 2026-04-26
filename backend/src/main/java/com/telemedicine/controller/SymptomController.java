package com.telemedicine.controller;

import com.telemedicine.dto.request.SymptomRequest;
import com.telemedicine.dto.response.ApiResponse;
import com.telemedicine.dto.response.SymptomReportResponse;
import com.telemedicine.service.SymptomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
@Tag(name = "Symptom Triage", description = "AI-powered symptom analysis")
@SecurityRequirement(name = "bearerAuth")
public class SymptomController {

    private final SymptomService symptomService;

    @PostMapping("/analyze")
    @Operation(summary = "Submit symptoms for AI triage analysis")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<SymptomReportResponse>> analyze(
        @Valid @RequestBody SymptomRequest request
    ) {
        SymptomReportResponse result = symptomService.analyzeSymptoms(request);
        return ResponseEntity.ok(ApiResponse.ok("Analysis complete", result));
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Get all my symptom reports")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<SymptomReportResponse>>> getMyReports() {
        return ResponseEntity.ok(ApiResponse.ok(symptomService.getMyReports()));
    }
}
