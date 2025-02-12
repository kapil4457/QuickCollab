package com.quickcollab.controller;

import com.quickcollab.constants.ApplicationConstants;
import com.quickcollab.dtos.request.LoginRequestDTO;
import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.LoginResponseDTO;
import com.quickcollab.dtos.response.ResponseDTO;
import com.quickcollab.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import org.springframework.core.env.Environment;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final Environment env;


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
    public  ResponseEntity<LoginResponseDTO<?>> selfDetails(Authentication authentication){
            String emailId = (String) authentication.getPrincipal();
            LoginResponseDTO<?> loginResponseDTO = userService.getUserByEmail(emailId);
            return ResponseEntity.status(loginResponseDTO.getSuccess() ? 200 : 401).body(loginResponseDTO);
    }

    @PostMapping("/apiLogin")
    public ResponseEntity<LoginResponseDTO<?>> apiLogin (@RequestBody LoginRequestDTO loginRequest) {
        String jwt = "";
        Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.getEmailId(),
                loginRequest.getPassword());
        Authentication authenticationResponse = authenticationManager.authenticate(authentication);
        if(null != authenticationResponse && authenticationResponse.isAuthenticated()) {
            if (null != env) {
                String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                        ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);
                SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
                jwt = Jwts.builder().issuer("Quick Collab").subject("JWT Token")
                        .claim("username", authenticationResponse.getName())
                        .claim("authorities", authenticationResponse.getAuthorities().stream().map(
                                GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                        .issuedAt(new java.util.Date())
                        .expiration(new java.util.Date((new java.util.Date()).getTime() + 30000000))
                        .signWith(secretKey).compact();
            }
        }
        LoginResponseDTO<?> loginResponseDTO = userService.getUserByEmail(loginRequest.getEmailId());
        if(!loginResponseDTO.getSuccess()){
        loginResponseDTO.setMessage("Wrong email id or password");
        }else{
        loginResponseDTO.setMessage("Logged in successfully");
        }
        return ResponseEntity.status(loginResponseDTO.getSuccess() ? 200 : 401).header(ApplicationConstants.JWT_HEADER,jwt).body(loginResponseDTO);

    }
}
