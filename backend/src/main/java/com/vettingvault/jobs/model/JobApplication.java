package com.vettingvault.jobs.model;

public record JobApplication(
        String jobId,
        String candidateEmail,
        String appliedAt
) {
}
