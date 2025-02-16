package com.quickcollab.exceptionhandling;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.response.user.LoginResponseDTO;
import com.quickcollab.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {
        // Populate dynamic values
        LocalDateTime currentTimeStamp = LocalDateTime.now();
        String message = (accessDeniedException != null && accessDeniedException.getMessage() != null) ?
                accessDeniedException.getMessage() : "Authorization failed";
        String path = request.getRequestURI();
        response.setHeader("quickcollab-denied-reason", "Authorization failed");
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json;charset=UTF-8");
        // Construct the JSON response
        LoginResponseDTO<User> loginResponseDTO = new LoginResponseDTO<>();
        loginResponseDTO.setMessage(message);
        loginResponseDTO.setUser(null);
        loginResponseDTO.setSuccess(false);
        response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));
    }
}