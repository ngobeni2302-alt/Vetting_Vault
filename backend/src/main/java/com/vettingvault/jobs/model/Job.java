package com.vettingvault.jobs.model;

public record Job(
        String id,
        String positionAdvertised,
        int yearsExperienceRequired,
        String jobCity,
        String employerEmail,
        String postedAt
) {
}
