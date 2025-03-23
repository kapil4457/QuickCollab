package com.quickcollab.repository;

import com.quickcollab.model.UploadRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadRequestRepository extends JpaRepository<UploadRequest, Long> {
}
