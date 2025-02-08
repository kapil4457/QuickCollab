package com.quickcollab.dtos.request;

import com.quickcollab.enums.RegisterationMethod;
import com.quickcollab.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterDTO {

    @NotNull
    @Length(min = 3, max = 20)
    private String username;

    @NotNull
    @URL
    private String profilePicture;

    @NotNull
    @Length(min = 2)
    private String firstName;


    @NotNull
    @Length(min = 2)
    private String lastName;

    @NotNull
    @Email
    private String emailId;

    private String password;

    @NotNull
    private RegisterationMethod registerationMethod;

    @NotNull
    private UserRole userRole;
}