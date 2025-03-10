package com.quickcollab.config;

import com.quickcollab.utils.JwtBlacklistService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@AllArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final JwtBlacklistService jwtBlacklistService;
    private final Environment env;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("Registering WebSocket endpoint: /api/chat");
        registry.addEndpoint("/api/chat").setAllowedOrigins("*").addInterceptors(new WebSocketAuthInterceptor(jwtBlacklistService,env));
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/room");
        registry.setApplicationDestinationPrefixes("/app");
    }
//    @Override
//    public void configureClientInboundChannel(ChannelRegistration registration) {
//        registration.interceptors(new WebSocketAuthInterceptor()); // Register WebSocket authentication
//    }
}
