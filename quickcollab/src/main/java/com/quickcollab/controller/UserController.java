package com.quickcollab.controller;

import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.UserResponseDTO;
import com.quickcollab.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@AllArgsConstructor
@Validated
public class UserController {
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid UserRegisterDTO userRegisterDTO) {
        try{
        String message = userService.registerUser(userRegisterDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @RequestMapping("/me")
    public UserResponseDTO loginUser(Authentication authentication){
            String emailId = (String) authentication.getPrincipal();
            Optional<UserResponseDTO> optionalUser = userService.findByEmail(emailId);
            return optionalUser.orElse(null);
    }
}
