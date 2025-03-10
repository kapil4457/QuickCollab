package com.quickcollab.config;

import com.quickcollab.constants.ApplicationConstants;
import com.quickcollab.utils.JwtBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor , HandshakeInterceptor {

    private final JwtBlacklistService jwtBlacklistService;
    private final Environment env;

    @Override
    public boolean beforeHandshake(
            org.springframework.http.server.ServerHttpRequest request,
            org.springframework.http.server.ServerHttpResponse response,
            org.springframework.web.socket.WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            String query = servletRequest.getServletRequest().getQueryString();
            String[] parts = query.split("token=");

            // Ensure there's a token after "token="
            if (parts.length > 1 && !parts[1].isEmpty()) {
                String token = parts[1].split("&")[0].trim(); // Extract token safely
                if (!token.isEmpty()) {
                    attributes.put("Authorization", token);
                     return authenticate(token);
                }

            }
        }
        return false;
    }



    @Override
    public void afterHandshake(
            org.springframework.http.server.ServerHttpRequest request,
            org.springframework.http.server.ServerHttpResponse response,
            org.springframework.web.socket.WebSocketHandler wsHandler, Exception exception) {
    }


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String token = (String) accessor.getSessionAttributes().get("Authorization"); // Get token from session attributes

        if (token != null) {
          Boolean checkAuth = authenticate(token);
          if(!checkAuth)return null;
        return message;
        }
        return null;

    }

    public Boolean authenticate(String token) throws AuthenticationException {
        if (token != null && !jwtBlacklistService.isTokenBlacklisted(token)) {
            try {
                // Validate the token (e.g., using a JWT utility class)
                String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY, ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);
                SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

                // Parse the JWT and extract claims
                Claims claims = Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseClaimsJws(token)
                        .getPayload();

                // Extract username and userId from claims
                String username = claims.get("username", String.class);
                String userId = claims.get("userId", String.class);

                // Extract authorities from claims
                String authoritiesClaim = claims.get("authorities", String.class);
                List<SimpleGrantedAuthority> authorities = Arrays.stream(authoritiesClaim.split(","))
                        .map(authority -> new SimpleGrantedAuthority("ROLE_" + authority))
                        .collect(Collectors.toList());
                Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                ((UsernamePasswordAuthenticationToken) authentication).setDetails(userId);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }


}
