package com.vettingvault.employer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EmployerRegistrationRequest(
        @NotBlank(message = "Company name is required")
        @Pattern(regexp = "^[A-Za-z0-9 .,&'-]{2,100}$", message = "Company name contains invalid characters")
        String companyName,
        @NotBlank(message = "Corporate email is required")
        @Email(message = "Corporate email must be valid")
        String corporateEmail,
        @NotBlank(message = "Work phone number is required")
        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Work phone number must contain 10 to 15 digits")
        String workPhoneNumber,
        @NotBlank(message = "Password is required")
        @Size(min = 12, message = "Password must be at least 12 characters long")
        String password
) {
}
