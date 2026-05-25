package com.telemedicine.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SymptomRequest {

    @NotEmpty(message = "At least one symptom is required")
    private List<String> selectedSymptoms;

    private String primarySymptom;
    private String ageGroup;
    private String duration;
    private Integer severity;
    private String knownAllergies;
    private String city;
    private Double temperature;
    private String weatherDescription;
    private String pollenLevel;
    private String season;

    public String toNaturalLanguage() {
        StringBuilder sb = new StringBuilder();
        sb.append("Patient profile: age group ").append(ageGroup != null ? ageGroup : "adult").append(". ");
        sb.append("Symptoms: ").append(String.join(", ", selectedSymptoms)).append(". ");
        if (duration != null)    sb.append("Duration: ").append(duration).append(". ");
        if (severity  != null)   sb.append("Severity: ").append(severity).append("/10. ");
        if (knownAllergies != null && !knownAllergies.isBlank())
            sb.append("Known allergies/medications: ").append(knownAllergies).append(". ");
        if (city != null)        sb.append("Location: ").append(city).append(". ");
        if (season != null)      sb.append("Season: ").append(season).append(". ");
        if (temperature != null) sb.append("Temperature: ").append(temperature).append("°C. ");
        if (pollenLevel != null) sb.append("Pollen level: ").append(pollenLevel).append(".");
        return sb.toString();
    }
}
