package com.vettingvault.employer.service;

import com.vettingvault.telemetry.DisposableEmailBlockedException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DisposableEmailDomainValidatorTest {

    private final DisposableEmailDomainValidator validator = new DisposableEmailDomainValidator();

    @Test
    void blocksDisposableProvider() {
        assertThrows(DisposableEmailBlockedException.class,
                () -> validator.validateCorporateEmail("security@mailinator.com"));
    }

    @Test
    void allowsCorporateDomain() {
        assertDoesNotThrow(() -> validator.validateCorporateEmail("admin@vettingvault.co.za"));
    }
}
