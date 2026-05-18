package com.vettingvault.employer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmployerLoginRequest(
        @NotBlank(message = "Corporate email is required")
        @Email(message = "Corporate email must be valid")
        String corporateEmail,
        @NotBlank(message = "Password is required")
        String password
) {
}
