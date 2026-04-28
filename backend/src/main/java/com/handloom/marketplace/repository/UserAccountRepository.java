package com.handloom.marketplace.repository;

import com.handloom.marketplace.model.UserAccount;
import com.handloom.marketplace.model.UserRole;
import com.handloom.marketplace.model.UserStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {

    Optional<UserAccount> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRoleAndStatus(UserRole role, UserStatus status);

    List<UserAccount> findByRole(UserRole role, Sort sort);
}
