package com.quickcollab.exceptionhandling;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.response.user.LoginResponseDTO;
import com.quickcollab.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class CustomBasicAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        // Populate dynamic values
        LocalDateTime currentTimeStamp = LocalDateTime.now();
        String message = (authException != null && authException.getMessage() != null) ? authException.getMessage()
                : "Unauthorized";
        String path = request.getRequestURI();
        response.setHeader("quickcollab-error-reason", "Authentication failed");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");
        LoginResponseDTO<User> loginResponseDTO = new LoginResponseDTO<>();
        loginResponseDTO.setMessage(message);
        loginResponseDTO.setUser(null);
        loginResponseDTO.setSuccess(false);
        response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));
    }
}