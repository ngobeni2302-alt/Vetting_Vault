package com.vettingvault.employer.service;

import com.vettingvault.telemetry.DisposableEmailBlockedException;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class DisposableEmailDomainValidator {

    private static final Set<String> BLOCKLIST = Set.of(
            "mailinator.com",
            "guerrillamail.com",
            "10minutemail.com",
            "tempmail.com",
            "yopmail.com"
    );

    public void validateCorporateEmail(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        int atIndex = normalizedEmail.lastIndexOf('@');

        if (atIndex < 0 || atIndex == normalizedEmail.length() - 1) {
            throw new IllegalArgumentException("Corporate email domain is invalid");
        }

        String domain = normalizedEmail.substring(atIndex + 1);
        if (BLOCKLIST.contains(domain)) {
            throw new DisposableEmailBlockedException(normalizedEmail);
        }
    }
}
