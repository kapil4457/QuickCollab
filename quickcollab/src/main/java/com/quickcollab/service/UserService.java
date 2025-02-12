package com.quickcollab.service;

import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.LoginResponseDTO;
import com.quickcollab.dtos.response.ResponseDTO;
import com.quickcollab.enums.UserRole;
import com.quickcollab.pojo.ContentCreatorUserDetails;
import com.quickcollab.pojo.JobSeekerUserDetails;
import com.quickcollab.exception.ResourceAlreadyExistsException;
import com.quickcollab.model.User;
import com.quickcollab.pojo.TeamMemberUserDetails;
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

    public Optional<User> findByEmail(String emailId) {
        Optional<User> optionalUser = userRepository.findByEmailId(emailId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            return Optional.of(user);
        }
        return Optional.empty();
    }
    public  LoginResponseDTO<?> getUserByEmail(String emailId){
        Optional<User> optionalUser = findByEmail(emailId);
        if(optionalUser.isPresent()){
        String userRole = optionalUser.get().getUserRole().toString();
            if(userRole.equals(UserRole.CONTENT_CREATOR.toString())){
                ContentCreatorUserDetails contentCreatorUserDetails = modelMapper.map(optionalUser.get(), ContentCreatorUserDetails.class);
                LoginResponseDTO<ContentCreatorUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(contentCreatorUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                return (LoginResponseDTO<ContentCreatorUserDetails>) loginResponseDTO;

            }else if(userRole.equals(UserRole.JOB_SEEKER.toString())){
                JobSeekerUserDetails jobSeekerUserDetails = modelMapper.map(optionalUser.get(), JobSeekerUserDetails.class);
                LoginResponseDTO<JobSeekerUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(jobSeekerUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                return (LoginResponseDTO<JobSeekerUserDetails>) loginResponseDTO;

            }else{
                TeamMemberUserDetails teamMemberUserDetails = modelMapper.map(optionalUser.get(), TeamMemberUserDetails.class);
                LoginResponseDTO<TeamMemberUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(teamMemberUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                return (LoginResponseDTO<TeamMemberUserDetails>) loginResponseDTO;

            }
        }
        LoginResponseDTO<User> loginResponseDTO = new LoginResponseDTO<>();
        loginResponseDTO.setUser(null);
        loginResponseDTO.setSuccess(false);
        loginResponseDTO.setMessage("Please login in to access this resource");
        return loginResponseDTO;
    }
}
