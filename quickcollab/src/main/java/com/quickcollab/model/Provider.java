package com.quickcollab.model;

import com.quickcollab.enums.Platform;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String providerId;
    @ManyToOne
    private User user;
    private Platform name;
    private String accessToken;
    private String refreshToken;
    private Date expires;
}
