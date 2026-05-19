package com.vettingvault.candidate.controller;

import com.vettingvault.candidate.model.CandidateAccount;
import com.vettingvault.candidate.service.CandidateAuthService;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidate")
public class CandidatePlaneController {

    private final CandidateAuthService candidateAuthService;

    public CandidatePlaneController(CandidateAuthService candidateAuthService) {
        this.candidateAuthService = candidateAuthService;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        CandidateAccount account = candidateAuthService.findByEmail(authentication.getName());
        Map<String, Object> profile = new LinkedHashMap<>();

        profile.put("plane", "CANDIDATE");
        profile.put("subject", authentication.getName());
        profile.put("message", "Candidate plane access granted");

        if (account != null) {
            profile.put("name", account.name());
            profile.put("surname", account.surname());
            profile.put("emailAddress", account.emailAddress());
            profile.put("phoneNumber", account.phoneNumber());
        }

        return profile;
    }
}
