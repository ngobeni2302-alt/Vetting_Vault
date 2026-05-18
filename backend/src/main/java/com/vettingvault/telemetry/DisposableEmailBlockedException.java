package com.vettingvault.telemetry;

public class DisposableEmailBlockedException extends RuntimeException {

    private final String attemptedEmail;

    public DisposableEmailBlockedException(String attemptedEmail) {
        super("Disposable email domains are forbidden for employer registration");
        this.attemptedEmail = attemptedEmail;
    }

    public String getAttemptedEmail() {
        return attemptedEmail;
    }
}
