package com.quickcollab.service;

import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.ResponseDTO;
import com.quickcollab.dtos.response.UserResponseDTO;
import com.quickcollab.exception.ResourceAlreadyExistsException;
import com.quickcollab.model.User;
import com.quickcollab.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public ResponseDTO registerUser(UserRegisterDTO userRegisterDTO){
        // check if the user already exists
        String emailId = userRegisterDTO.getEmailId();
        Optional<User> existingUser = userRepository.findByEmailId(emailId);
        if(existingUser.isPresent()){
            throw new ResourceAlreadyExistsException("User","email",emailId);
        }

        // convert UserRegisterDTO to User
        User user = modelMapper.map(userRegisterDTO, User.class);
        userRepository.save(user);
        return new ResponseDTO("User Saved successfully",true);
    }

    public Optional<UserResponseDTO> findByEmail(String emailId) {
        Optional<User> optionalUser = userRepository.findByEmailId(emailId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            UserResponseDTO userResponseDTO = modelMapper.map(user,UserResponseDTO.class);
            return Optional.ofNullable(userResponseDTO);
        }
        return Optional.empty();
    }
}
