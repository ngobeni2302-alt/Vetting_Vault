package com.vettingvault.security.validator;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CandidateIdNumberValidatorTest {

    private final CandidateIdNumberValidator validator = new CandidateIdNumberValidator();

    @Test
    void acceptsStrictNumericIdentifier() {
        assertTrue(validator.isValid("9901011234088", null));
    }

    @Test
    void rejectsInjectionStyledPayload() {
        assertFalse(validator.isValid("' OR 1=1 --", null));
        assertFalse(validator.isValid("<script>alert(1)</script>", null));
        assertFalse(validator.isValid("9901011234abc", null));
    }
}
