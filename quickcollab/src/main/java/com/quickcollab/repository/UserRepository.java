package com.quickcollab.repository;

import com.quickcollab.model.Job;
import com.quickcollab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailId(String emailId);

    @Query("SELECT u.reportsTo FROM User u WHERE u.userId = :userId")
    String getReportingUserByUserId(@Param("userId") String userId);
}
