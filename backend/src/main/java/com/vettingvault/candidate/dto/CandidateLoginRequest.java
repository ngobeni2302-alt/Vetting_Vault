package com.vettingvault.candidate.dto;

import com.vettingvault.security.annotation.ValidCandidateIdNumber;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CandidateLoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String emailAddress,
        @ValidCandidateIdNumber
        String idNumber
) {
}
