package com.quickcollab.filters;

import com.quickcollab.constants.ApplicationConstants;
import com.quickcollab.utils.JwtBlacklistService;
import com.quickcollab.utils.JwtTokenUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
public class JWTTokenValidatorFilter extends OncePerRequestFilter {
    private final JwtBlacklistService jwtBlacklistService;
    private final JwtTokenUtil jwtTokenUtil;
    private final Environment env;


    private String extractTokenFromRequest(HttpServletRequest request) {
        return request.getHeader("Authorization");
    }


    private List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        // Implement logic to extract authorities from token
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        return authorities;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.equals("/api/apiLogin") || path.equals("/api/apiLogout") || path.equals("/api/register");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = extractTokenFromRequest(request);
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
            } catch (Exception e) {
                // Handle token validation errors
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
