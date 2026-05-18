package com.vettingvault.employer.controller;

import com.vettingvault.auth.dto.AuthResponse;
import com.vettingvault.employer.dto.EmployerLoginRequest;
import com.vettingvault.employer.dto.EmployerRegistrationRequest;
import com.vettingvault.employer.service.EmployerAuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employer")
public class EmployerAuthController {

    private final EmployerAuthService employerAuthService;

    public EmployerAuthController(EmployerAuthService employerAuthService) {
        this.employerAuthService = employerAuthService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@Valid @RequestBody EmployerRegistrationRequest request) {
        return employerAuthService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody EmployerLoginRequest request) {
        return employerAuthService.login(request);
    }
}
