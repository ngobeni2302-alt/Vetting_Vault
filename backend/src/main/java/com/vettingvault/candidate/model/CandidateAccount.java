package com.vettingvault.candidate.model;

public record CandidateAccount(
        String name,
        String surname,
        String idNumber,
        String emailAddress,
        String phoneNumber
) {
}
