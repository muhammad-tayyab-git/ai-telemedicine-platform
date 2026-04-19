package com.telemedicine.controller;

import com.telemedicine.dto.request.AuthRequest;
import com.telemedicine.dto.response.ApiResponse;
import com.telemedicine.dto.response.AuthResponse;
import com.telemedicine.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user (patient or doctor)")
    public ResponseEntity<ApiResponse<AuthResponse.TokenResponse>> register(
        @Valid @RequestBody AuthRequest.Register request
    ) {
        AuthResponse.TokenResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT token")
    public ResponseEntity<ApiResponse<AuthResponse.TokenResponse>> login(
        @Valid @RequestBody AuthRequest.Login request
    ) {
        AuthResponse.TokenResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/health")
    @Operation(summary = "Auth service health check")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("Auth service is running"));
    }
}
