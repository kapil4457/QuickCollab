package com.quickcollab.repository;

import com.quickcollab.model.Provider;
import com.quickcollab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider ,String> {
    List<Provider> findByUser(User user);
}
