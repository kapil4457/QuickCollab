package com.quickcollab.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.enums.UserRole;
import com.quickcollab.model.User;
import com.quickcollab.pojo.ContentCreatorUserDetails;
import com.quickcollab.dtos.response.LoginResponseDTO;
import com.quickcollab.pojo.JobSeekerUserDetails;
import com.quickcollab.pojo.TeamMemberUserDetails;
import com.quickcollab.service.UserService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Optional;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ModelMapper modelMapper;
    private final UserService userService;
    CustomAuthenticationSuccessHandler(ModelMapper modelMapper, UserService userService) {
        this.modelMapper = modelMapper;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Extract user details
        String emailId = authentication.getPrincipal().toString();
        String userRole = authentication.getAuthorities().stream().toList().getFirst().getAuthority();
        Optional<User> optionalUser = userService.findByEmail(emailId);
       if(optionalUser.isPresent()){
        User user = optionalUser.get();
        if(userRole.equals(UserRole.CONTENT_CREATOR.toString())){

            ContentCreatorUserDetails contentCreatorUserDetails = modelMapper.map(user, ContentCreatorUserDetails.class);
            LoginResponseDTO<ContentCreatorUserDetails> loginResponseDTO = new LoginResponseDTO<>();
            loginResponseDTO.setUser(contentCreatorUserDetails);
            loginResponseDTO.setSuccess(true);
            loginResponseDTO.setMessage("User details fetched successfully");
            response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));

        }else if(userRole.equals(UserRole.JOB_SEEKER.toString())){
            JobSeekerUserDetails jobSeekerUserDetails = modelMapper.map(optionalUser.get(), JobSeekerUserDetails.class);
            LoginResponseDTO<JobSeekerUserDetails> loginResponseDTO = new LoginResponseDTO<>();
            loginResponseDTO.setUser(jobSeekerUserDetails);
            loginResponseDTO.setSuccess(true);
            loginResponseDTO.setMessage("User details fetched successfully");
            response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));
        }else{
            TeamMemberUserDetails teamMemberUserDetails = modelMapper.map(optionalUser.get(), TeamMemberUserDetails.class);
            LoginResponseDTO<TeamMemberUserDetails> loginResponseDTO = new LoginResponseDTO<>();
            loginResponseDTO.setUser(teamMemberUserDetails);
            loginResponseDTO.setSuccess(true);
            loginResponseDTO.setMessage("User details fetched successfully");
            response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));

        }
       }else{
           LoginResponseDTO<User> loginResponseDTO = new LoginResponseDTO<>();
           loginResponseDTO.setUser(null);
           loginResponseDTO.setSuccess(false);
           loginResponseDTO.setMessage("Failed to fetch user details for emailId " + emailId);
           response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));
           response.getWriter().write(objectMapper.writeValueAsString(loginResponseDTO));
       }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
