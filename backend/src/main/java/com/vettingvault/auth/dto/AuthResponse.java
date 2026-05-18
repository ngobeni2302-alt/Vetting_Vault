package com.vettingvault.auth.dto;

import java.time.OffsetDateTime;

public record AuthResponse(
        String token,
        String role,
        OffsetDateTime expiresAt,
        String message
) {
}
