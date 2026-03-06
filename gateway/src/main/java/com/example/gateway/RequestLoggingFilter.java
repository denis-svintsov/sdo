package com.example.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class RequestLoggingFilter implements GlobalFilter, Ordered {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long start = System.currentTimeMillis();
        String method = exchange.getRequest().getMethod() == null
                ? "UNKNOWN"
                : exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getURI().getPath();
        String requestId = exchange.getRequest().getHeaders().getFirst("X-Request-Id");

        return chain.filter(exchange)
                .doFinally(signal -> {
                    var status = exchange.getResponse().getStatusCode();
                    long durationMs = System.currentTimeMillis() - start;
                    log.info("requestId={} method={} path={} status={} durationMs={}",
                            requestId,
                            method,
                            path,
                            status == null ? "NA" : status.value(),
                            durationMs);
                });
    }

    @Override
    public int getOrder() {
        return 100;
    }
}
