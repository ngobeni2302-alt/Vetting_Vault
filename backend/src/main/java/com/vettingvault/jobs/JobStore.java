package com.vettingvault.jobs;

import com.vettingvault.jobs.model.Job;
import com.vettingvault.jobs.model.JobApplication;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;

@Component
public class JobStore {

    private final List<Job> jobs = new CopyOnWriteArrayList<>();
    private final Map<String, List<JobApplication>> applicationsByJobId = new ConcurrentHashMap<>();

    public Job addJob(String positionAdvertised, int yearsExperienceRequired, String jobCity, String employerEmail) {
        Job job = new Job(
                UUID.randomUUID().toString(),
                positionAdvertised,
                yearsExperienceRequired,
                jobCity,
                employerEmail,
                OffsetDateTime.now().toString()
        );
        jobs.add(job);
        return job;
    }

    public List<Job> getAllJobs() {
        return List.copyOf(jobs);
    }

    public List<Job> getJobsByEmployer(String employerEmail) {
        return jobs.stream()
                .filter(job -> job.employerEmail().equalsIgnoreCase(employerEmail))
                .toList();
    }

    public boolean apply(String jobId, String candidateEmail) {
        boolean jobExists = jobs.stream().anyMatch(job -> job.id().equals(jobId));
        if (!jobExists) {
            return false;
        }

        List<JobApplication> applications = applicationsByJobId
                .computeIfAbsent(jobId, id -> new CopyOnWriteArrayList<>());

        boolean alreadyApplied = applications.stream()
                .anyMatch(app -> app.candidateEmail().equalsIgnoreCase(candidateEmail));

        if (alreadyApplied) {
            return false;
        }

        applications.add(new JobApplication(jobId, candidateEmail, OffsetDateTime.now().toString()));
        return true;
    }

    public boolean hasApplied(String jobId, String candidateEmail) {
        List<JobApplication> applications = applicationsByJobId.getOrDefault(jobId, new ArrayList<>());
        return applications.stream()
                .anyMatch(app -> app.candidateEmail().equalsIgnoreCase(candidateEmail));
    }
}
