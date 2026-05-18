package com.vettingvault.security;

import java.time.OffsetDateTime;
import org.springframework.stereotype.Component;

@Component
public class RawSecurityTelemetryLogger {

    public void logBlockedEmployerRegistration(String attemptedEmail) {
        System.err.printf(
                "[SECURITY_TELEMETRY] timestamp=%s attemptedEmail=%s action=BLOCKED%n",
                OffsetDateTime.now(),
                attemptedEmail
        );
    }
}
