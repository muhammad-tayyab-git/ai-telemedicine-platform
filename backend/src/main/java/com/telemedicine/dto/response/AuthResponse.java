package com.telemedicine.dto.response;

import com.telemedicine.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthResponse {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TokenResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserInfo user;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private User.Role role;
    }
}
