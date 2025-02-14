package com.quickcollab.filters;

import com.quickcollab.utils.JwtBlacklistService;
import com.quickcollab.utils.JwtTokenGenerator;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class JWTTokenValidatorFilter extends OncePerRequestFilter {
    private final JwtBlacklistService jwtBlacklistService;
    private final JwtTokenGenerator jwtTokenGenerator;


    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }


    private List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        // Implement logic to extract authorities from token
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        return authorities;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.equals("/apiLogin") || path.equals("/apiLogout") || path.equals("/register");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = extractTokenFromRequest(request);
        if (token != null && !jwtBlacklistService.isTokenBlacklisted(token)) {
            try {
                // Validate the token (e.g., using a JWT utility class)
                String username = jwtTokenGenerator.getUsername(token);
                List<SimpleGrantedAuthority> authorities = jwtTokenGenerator.getUserAuthorities(token);
                Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // Handle token validation errors
            }
        }
        filterChain.doFilter(request, response);
    }
}
