package com.quickcollab.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String meetId;

    private String title;
    private String description;

    @OneToMany
    private List<User> members = new ArrayList<User>();

    @ManyToOne
    private User admin;

    private Boolean isCancelled;
    private String cancellationReason;

    private Date scheduledFor;
    private Date endsOn;
    @OneToMany
    private List<User> activeMembers;

}
