package com.quickcollab.controller;

import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.LoginResponseDTO;
import com.quickcollab.dtos.response.ResponseDTO;
import com.quickcollab.enums.UserRole;
import com.quickcollab.model.User;
import com.quickcollab.pojo.ContentCreatorUserDetails;
import com.quickcollab.pojo.JobSeekerUserDetails;
import com.quickcollab.pojo.TeamMemberUserDetails;
import com.quickcollab.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> registerUser(@RequestBody @Valid UserRegisterDTO userRegisterDTO) {
        try{
            if(userRegisterDTO.getRegisterationMethod().toString().equals("CREDENTIALS_LOGIN")){
            String hashPwd = passwordEncoder.encode(userRegisterDTO.getPassword());
            userRegisterDTO.setPassword(hashPwd);
            }
            ResponseDTO responseDTO = userService.registerUser(userRegisterDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        }catch (Exception e){
            ResponseDTO responseDTO = new ResponseDTO(e.getMessage(),false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseDTO);
        }
    }

    @RequestMapping("/me")
    public LoginResponseDTO selfDetails(Authentication authentication){
            String emailId = (String) authentication.getPrincipal();
            String userRole = authentication.getAuthorities().stream().toList().getFirst().getAuthority();
            Optional<User> optionalUser = userService.findByEmail(emailId);
            if(optionalUser.isPresent()){
                if(userRole.equals(UserRole.CONTENT_CREATOR.toString())){
                    ContentCreatorUserDetails contentCreatorUserDetails = modelMapper.map(optionalUser.get(), ContentCreatorUserDetails.class);
                    LoginResponseDTO<ContentCreatorUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                    loginResponseDTO.setUser(contentCreatorUserDetails);
                    loginResponseDTO.setSuccess(true);
                    loginResponseDTO.setMessage("User details fetched successfully");
                    return loginResponseDTO;

                }else if(userRole.equals(UserRole.JOB_SEEKER.toString())){
                    JobSeekerUserDetails jobSeekerUserDetails = modelMapper.map(optionalUser.get(), JobSeekerUserDetails.class);
                    LoginResponseDTO<JobSeekerUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                    loginResponseDTO.setUser(jobSeekerUserDetails);
                    loginResponseDTO.setSuccess(true);
                    loginResponseDTO.setMessage("User details fetched successfully");
                    return loginResponseDTO;

                }else{
                    TeamMemberUserDetails teamMemberUserDetails = modelMapper.map(optionalUser.get(), TeamMemberUserDetails.class);
                    LoginResponseDTO<TeamMemberUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                    loginResponseDTO.setUser(teamMemberUserDetails);
                    loginResponseDTO.setSuccess(true);
                    loginResponseDTO.setMessage("User details fetched successfully");
                    return loginResponseDTO;

                }
            }
            LoginResponseDTO<User> loginResponseDTO = new LoginResponseDTO<>();
            loginResponseDTO.setUser(null);
            loginResponseDTO.setSuccess(false);
            loginResponseDTO.setMessage("Please login in to access this resource");
            return loginResponseDTO;
    }
}
