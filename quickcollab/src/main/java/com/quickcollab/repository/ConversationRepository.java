package com.quickcollab.repository;

import com.quickcollab.model.Conversation;
import com.quickcollab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByMembers(List<User> members);
}
