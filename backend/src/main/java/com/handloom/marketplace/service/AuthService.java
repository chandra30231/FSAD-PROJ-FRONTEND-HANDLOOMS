package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.UserAccount;
import com.handloom.marketplace.model.UserRole;
import com.handloom.marketplace.model.UserStatus;
import com.handloom.marketplace.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final IdGenerationService idGenerationService;

    public AuthService(UserAccountRepository userAccountRepository, IdGenerationService idGenerationService) {
        this.userAccountRepository = userAccountRepository;
        this.idGenerationService = idGenerationService;
    }

    @Transactional(readOnly = true)
    public ApiDtos.AuthResponse login(ApiDtos.LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!user.getPassword().equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account has been blocked by the admin team.");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This artisan account is awaiting admin approval.");
        }

        return new ApiDtos.AuthResponse(true, "Login successful.", ApiMapper.toUserResponse(user));
    }

    @Transactional
    public ApiDtos.RegisterResponse register(ApiDtos.RegisterRequest request) {
        if (userAccountRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        UserRole role = UserRole.fromValue(request.role());
        if (role != UserRole.BUYER && role != UserRole.ARTISAN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only buyer and artisan self-registration is allowed.");
        }

        UserStatus status = role == UserRole.ARTISAN ? UserStatus.PENDING : UserStatus.ACTIVE;

        UserAccount user = new UserAccount(
                idGenerationService.newUserId(),
                request.name().trim(),
                request.email().trim().toLowerCase(),
                request.password(),
                role,
                status,
                Instant.now(),
                false
        );

        userAccountRepository.save(user);

        String message = role == UserRole.ARTISAN
                ? "Artisan account created and sent to admin for approval."
                : "Account created successfully.";

        return new ApiDtos.RegisterResponse(true, message, ApiMapper.toUserResponse(user));
    }
}
