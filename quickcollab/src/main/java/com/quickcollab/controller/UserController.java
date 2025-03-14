package com.quickcollab.controller;

import com.quickcollab.constants.ApplicationConstants;
import com.quickcollab.dtos.request.LoginRequestDTO;
import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.user.LoginResponseDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.user.ContentCreatorUserDetails;
import com.quickcollab.dtos.response.user.JobSeekerUserDetails;
import com.quickcollab.dtos.response.user.TeamMemberUserDetails;
import com.quickcollab.service.UserService;
import com.quickcollab.utils.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.core.env.Environment;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final Environment env;
    private final JwtTokenUtil jwtTokenUtil;


    // [Done]
    @PostMapping("/api/register")
    public ResponseEntity<LoginResponseDTO<?>> registerUser(@RequestBody @Valid UserRegisterDTO userRegisterDTO) {
        try{
            String jwt = "";
            if(userRegisterDTO.getRegisterationMethod().toString().equals("CREDENTIALS_LOGIN")){
            String hashPwd = passwordEncoder.encode(userRegisterDTO.getPassword());
            userRegisterDTO.setPassword(hashPwd);
            }
            List<GrantedAuthority> authorities  = new ArrayList<>();
            GrantedAuthority authority = new SimpleGrantedAuthority(userRegisterDTO.getUserRole().toString());
            authorities.add(authority);
            LoginResponseDTO<?> loginResponseDTO  = userService.registerUser(userRegisterDTO);
            Object user = loginResponseDTO.getUser();
            String userId = "";
            if(user instanceof ContentCreatorUserDetails){
                userId = ((ContentCreatorUserDetails) user).getUserId();
            }else if(user instanceof JobSeekerUserDetails){
                userId = ((JobSeekerUserDetails)user).getUserId();
            }else if(user instanceof TeamMemberUserDetails){
                userId = ((TeamMemberUserDetails)user).getUserId();
            }
            jwt = jwtTokenUtil.generateToken(userRegisterDTO.getEmailId() ,authorities,userId );
            return ResponseEntity.status(HttpStatus.CREATED).header(ApplicationConstants.JWT_HEADER,jwt).body(loginResponseDTO);
        }catch (Exception e){
            LoginResponseDTO<?> loginResponseDTO = new LoginResponseDTO<>();
            loginResponseDTO.setUser(null);
            loginResponseDTO.setMessage("Error occured while registering user. Error : "+e.getMessage());
            loginResponseDTO.setSuccess(false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).header(ApplicationConstants.JWT_HEADER,"").body(loginResponseDTO);
        }
    }

    // [Done]
    @RequestMapping("/api/me")
    public  ResponseEntity<LoginResponseDTO<?>> selfDetails(Authentication authentication){
            String emailId = (String) authentication.getPrincipal();
            LoginResponseDTO<?> loginResponseDTO = userService.getUserByEmail(emailId);
            return ResponseEntity.status(loginResponseDTO.getSuccess() ? 200 : 401).body(loginResponseDTO);
    }

    // [Done]
    @PostMapping("/api/apiLogin")
    public ResponseEntity<LoginResponseDTO<?>> apiLogin (@RequestBody LoginRequestDTO loginRequest) {
        String jwt = "";
        Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.getEmailId(),
                loginRequest.getPassword());
        Authentication authenticationResponse = authenticationManager.authenticate(authentication);
        LoginResponseDTO<?> loginResponseDTO = userService.getUserByEmail(loginRequest.getEmailId());
        if(null != authenticationResponse && authenticationResponse.isAuthenticated()) {
            if (null != env) {
                Object user = loginResponseDTO.getUser();
                String userId = "";
                if(user instanceof ContentCreatorUserDetails){
                    userId = ((ContentCreatorUserDetails) user).getUserId();
                }else if(user instanceof JobSeekerUserDetails){
                    userId = ((JobSeekerUserDetails)user).getUserId();
                }else if(user instanceof TeamMemberUserDetails){
                    userId = ((TeamMemberUserDetails)user).getUserId();
                }
            jwt = jwtTokenUtil.generateToken(authenticationResponse.getName() , (List<? extends GrantedAuthority>) authenticationResponse.getAuthorities(), userId);
            }
        }
        if(!loginResponseDTO.getSuccess()){
        loginResponseDTO.setMessage("Wrong email id or password");
        }else{
        loginResponseDTO.setMessage("Logged in successfully");
        }
        return ResponseEntity.status(loginResponseDTO.getSuccess() ? 200 : 401).header(ApplicationConstants.JWT_HEADER,jwt).body(loginResponseDTO);

    }

    // [Done]
    @PostMapping("/api/apiLogout")
    public ResponseEntity<ResponseDTO> logout(HttpServletRequest request) {
        ResponseDTO responseDTO = userService.logoutUser(request);
        return  ResponseEntity.status(responseDTO.getSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(responseDTO);
    }

}
