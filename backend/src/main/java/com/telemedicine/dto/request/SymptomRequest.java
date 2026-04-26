package com.telemedicine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SymptomRequest {

    @NotBlank(message = "Symptoms text is required")
    @Size(min = 10, max = 2000, message = "Symptoms must be between 10 and 2000 characters")
    private String symptoms;
}
