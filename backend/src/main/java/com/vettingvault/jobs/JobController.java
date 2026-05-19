package com.vettingvault.jobs;

import com.vettingvault.jobs.model.Job;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class JobController {

    private final JobStore jobStore;

    public JobController(JobStore jobStore) {
        this.jobStore = jobStore;
    }

    /** Employer posts a new job. Secured to EMPLOYER role via SecurityConfig. */
    @PostMapping("/api/employer/jobs")
    public Job postJob(@RequestBody PostJobRequest request, Authentication authentication) {
        if (request.positionAdvertised() == null || request.positionAdvertised().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Position advertised is required");
        }
        if (request.jobCity() == null || request.jobCity().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job city is required");
        }

        return jobStore.addJob(
                request.positionAdvertised().trim(),
                request.yearsExperienceRequired(),
                request.jobCity().trim(),
                authentication.getName()
        );
    }

    /** Employer sees their own job postings. */
    @GetMapping("/api/employer/jobs")
    public List<Job> getEmployerJobs(Authentication authentication) {
        return jobStore.getJobsByEmployer(authentication.getName());
    }

    /** Candidate fetches all posted jobs. Secured to CANDIDATE role via SecurityConfig. */
    @GetMapping("/api/jobs")
    public List<Job> getAllJobs() {
        return jobStore.getAllJobs();
    }

    /** Candidate applies for a job. */
    @PostMapping("/api/jobs/{jobId}/apply")
    public Map<String, String> applyForJob(@PathVariable String jobId, Authentication authentication) {
        boolean success = jobStore.apply(jobId, authentication.getName());

        if (!success) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already applied or job not found");
        }

        return Map.of("message", "Application submitted successfully");
    }

    record PostJobRequest(String positionAdvertised, int yearsExperienceRequired, String jobCity) {}
}
