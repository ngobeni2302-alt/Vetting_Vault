package com.vettingvault.employer.model;

public record EmployerAccount(
        String companyName,
        String corporateEmail,
        String workPhoneNumber,
        String passwordHash
) {
}
