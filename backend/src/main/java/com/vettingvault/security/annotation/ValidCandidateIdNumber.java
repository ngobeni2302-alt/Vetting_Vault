package com.vettingvault.security.annotation;

import com.vettingvault.security.validator.CandidateIdNumberValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CandidateIdNumberValidator.class)
public @interface ValidCandidateIdNumber {
    String message() default "ID Number must contain exactly 13 digits";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
