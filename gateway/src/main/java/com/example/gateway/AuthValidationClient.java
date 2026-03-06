package com.example.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class AuthValidationClient {
    private final WebClient webClient;

    public AuthValidationClient(
            WebClient.Builder webClientBuilder,
            @Value("${auth.service.url:${AUTH_SERVICE_URL:http://auth:8080}}") String authServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(authServiceUrl).build();
    }

    public Mono<AuthValidationResponse> validate(String authorizationHeader) {
        return webClient.get()
                .uri("/api/auth/validate")
                .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                .retrieve()
                .bodyToMono(AuthValidationResponse.class);
    }
}
