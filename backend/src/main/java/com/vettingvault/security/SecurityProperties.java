package com.vettingvault.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vettingvault.security")
public record SecurityProperties(String jwtSecret, long jwtExpirationMinutes) {
}
