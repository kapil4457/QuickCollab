package com.quickcollab.repository;

import com.quickcollab.enums.JobStatus;
import com.quickcollab.model.Job;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j WHERE j.postedBy.userId = :userId")
    List<Job> getJobByPostedByUserId(@Param("userId") String userId);

    List<Job> getJobByJobStatus(@NotNull JobStatus jobStatus);
}
