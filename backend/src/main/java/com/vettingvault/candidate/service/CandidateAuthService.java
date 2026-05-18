package com.vettingvault.candidate.service;

import com.vettingvault.auth.dto.AuthResponse;
import com.vettingvault.candidate.dto.CandidateLoginRequest;
import com.vettingvault.candidate.dto.CandidateRegistrationRequest;
import com.vettingvault.candidate.model.CandidateAccount;
import com.vettingvault.security.JwtService;
import com.vettingvault.security.Role;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class CandidateAuthService {

    private final Map<String, CandidateAccount> candidatesByEmail = new ConcurrentHashMap<>();
    private final JwtService jwtService;

    public CandidateAuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public Map<String, Object> register(CandidateRegistrationRequest request) {
        String normalizedEmail = normalize(request.emailAddress());

        if (candidatesByEmail.containsKey(normalizedEmail)) {
            throw new IllegalArgumentException("Candidate email already registered");
        }

        candidatesByEmail.put(normalizedEmail, new CandidateAccount(
                request.name().trim(),
                request.surname().trim(),
                request.idNumber().trim(),
                normalizedEmail,
                request.phoneNumber().trim()
        ));

        return Map.of(
                "message", "Candidate registered successfully",
                "role", Role.CANDIDATE.name()
        );
    }

    public AuthResponse login(CandidateLoginRequest request) {
        String normalizedEmail = normalize(request.emailAddress());
        CandidateAccount account = candidatesByEmail.get(normalizedEmail);

        if (account == null || !account.idNumber().equals(request.idNumber().trim())) {
            throw new IllegalArgumentException("Invalid candidate credentials");
        }

        OffsetDateTime expiresAt = OffsetDateTime.ofInstant(jwtService.calculateExpiryFromNow(), OffsetDateTime.now().getOffset());
        String token = jwtService.issueToken(normalizedEmail, Role.CANDIDATE);

        return new AuthResponse(token, Role.CANDIDATE.name(), expiresAt, "Candidate login successful");
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }
}
