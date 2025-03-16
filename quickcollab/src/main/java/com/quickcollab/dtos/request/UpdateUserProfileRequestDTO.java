package com.quickcollab.dtos.request;

import com.quickcollab.pojo.SocialMediaHandle;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequestDTO {
    @NotNull(message = "Please enter your first name")
    private String firstName;
    @NotNull(message = "Please enter your last name")
    private String lastName;
    @NotNull
    private String selfDescription="";
//    @NotNull
    private String socialMediaHandles = "[]" ;
    private MultipartFile  profilePicture;
}
