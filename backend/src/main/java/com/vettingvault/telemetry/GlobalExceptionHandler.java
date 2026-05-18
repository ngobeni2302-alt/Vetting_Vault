package com.vettingvault.telemetry;

import com.vettingvault.security.RawSecurityTelemetryLogger;
import jakarta.validation.ConstraintViolationException;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final RawSecurityTelemetryLogger telemetryLogger;

    public GlobalExceptionHandler(RawSecurityTelemetryLogger telemetryLogger) {
        this.telemetryLogger = telemetryLogger;
    }

    @ExceptionHandler(DisposableEmailBlockedException.class)
    public ResponseEntity<Map<String, Object>> handleDisposableEmail(DisposableEmailBlockedException ex) {
        telemetryLogger.logBlockedEmployerRegistration(ex.getAttemptedEmail());

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(errorBody(
                        "EMPLOYER_REGISTRATION_BLOCKED",
                        "Employer registration blocked by security policy",
                        Map.of("attemptedEmail", ex.getAttemptedEmail(), "action", "BLOCKED")
                ));
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<Map<String, Object>> handleValidation(Exception ex) {
        return ResponseEntity.badRequest()
                .body(errorBody(
                        "VALIDATION_ERROR",
                        "Input validation failed",
                        Map.of("details", ex.getMessage())
                ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(errorBody(
                        "INVALID_REQUEST",
                        ex.getMessage(),
                        Map.of()
                ));
    }

    private Map<String, Object> errorBody(String code, String message, Map<String, Object> details) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("code", code);
        body.put("message", message);
        body.put("details", details);
        return body;
    }
}
