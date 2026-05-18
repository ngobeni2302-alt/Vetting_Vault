package com.vettingvault.candidate.dto;

import com.vettingvault.security.annotation.ValidCandidateIdNumber;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CandidateRegistrationRequest(
        @NotBlank(message = "Name is required")
        @Pattern(regexp = "^[A-Za-z ,.'-]{2,50}$", message = "Name contains invalid characters")
        String name,
        @NotBlank(message = "Surname is required")
        @Pattern(regexp = "^[A-Za-z ,.'-]{2,50}$", message = "Surname contains invalid characters")
        String surname,
        @ValidCandidateIdNumber
        String idNumber,
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String emailAddress,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must contain 10 to 15 digits")
        String phoneNumber
) {
}
