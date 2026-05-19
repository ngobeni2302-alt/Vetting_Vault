package com.vettingvault.employer.service;

import com.vettingvault.auth.dto.AuthResponse;
import com.vettingvault.employer.dto.EmployerLoginRequest;
import com.vettingvault.employer.dto.EmployerRegistrationRequest;
import com.vettingvault.employer.model.EmployerAccount;
import com.vettingvault.security.JwtService;
import com.vettingvault.security.Role;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EmployerAuthService {

    private final Map<String, EmployerAccount> employersByEmail = new ConcurrentHashMap<>();
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final DisposableEmailDomainValidator disposableEmailDomainValidator;

    public EmployerAuthService(
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            DisposableEmailDomainValidator disposableEmailDomainValidator
    ) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.disposableEmailDomainValidator = disposableEmailDomainValidator;
    }

    public AuthResponse register(EmployerRegistrationRequest request) {
        String normalizedEmail = normalize(request.corporateEmail());

        disposableEmailDomainValidator.validateCorporateEmail(normalizedEmail);

        if (employersByEmail.containsKey(normalizedEmail)) {
            throw new IllegalArgumentException("Employer email already registered");
        }

        employersByEmail.put(normalizedEmail, new EmployerAccount(
                request.companyName().trim(),
                normalizedEmail,
                request.workPhoneNumber().trim(),
                passwordEncoder.encode(request.password())
        ));

        return issueSession(normalizedEmail, Role.EMPLOYER, "Employer registered successfully");
    }

    public AuthResponse login(EmployerLoginRequest request) {
        String normalizedEmail = normalize(request.corporateEmail());
        EmployerAccount account = employersByEmail.get(normalizedEmail);

        if (account == null || !passwordEncoder.matches(request.password(), account.passwordHash())) {
            throw new IllegalArgumentException("Invalid employer credentials");
        }

        return issueSession(normalizedEmail, Role.EMPLOYER, "Employer login successful");
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }

    private AuthResponse issueSession(String subject, Role role, String message) {
        OffsetDateTime expiresAt = OffsetDateTime.ofInstant(jwtService.calculateExpiryFromNow(), OffsetDateTime.now().getOffset());
        String token = jwtService.issueToken(subject, role);

        return new AuthResponse(token, role.name(), expiresAt, message);
    }
}
