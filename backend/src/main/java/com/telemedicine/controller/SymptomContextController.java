package com.telemedicine.controller;

import com.telemedicine.dto.response.ApiResponse;
import com.telemedicine.service.SymptomContextService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
@Tag(name = "Symptom Context", description = "Age-aware, location-aware symptom context and cascade")
public class SymptomContextController {

    private final SymptomContextService contextService;

    @GetMapping("/context")
    @Operation(summary = "Get age + weather + season specific symptom context")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getContext(
        @RequestParam(defaultValue = "adult") String ageGroup,
        @RequestParam(defaultValue = "Budapest") String city,
        @RequestParam(defaultValue = "18.0") double temp,
        @RequestParam(defaultValue = "clear") String weather,
        @RequestParam(defaultValue = "medium") String pollen
    ) {
        Map<String, Object> ctx = contextService.buildContext(ageGroup, city, temp, weather, pollen);
        return ResponseEntity.ok(ApiResponse.ok(ctx));
    }

    @GetMapping("/cascade")
    @Operation(summary = "Get related symptoms for a primary symptom")
    public ResponseEntity<ApiResponse<List<String>>> getCascade(
        @RequestParam String symptom
    ) {
        List<String> related = contextService.getCascade(symptom);
        return ResponseEntity.ok(ApiResponse.ok(related));
    }
}
