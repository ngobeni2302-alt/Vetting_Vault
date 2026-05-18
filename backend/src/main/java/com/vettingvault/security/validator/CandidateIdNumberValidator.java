package com.vettingvault.security.validator;

import com.vettingvault.security.annotation.ValidCandidateIdNumber;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CandidateIdNumberValidator implements ConstraintValidator<ValidCandidateIdNumber, String> {

    private static final String SAFE_ID_PATTERN = "^[0-9]{13}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(SAFE_ID_PATTERN);
    }
}
