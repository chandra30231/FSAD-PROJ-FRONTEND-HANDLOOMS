package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.UserAccount;
import com.handloom.marketplace.model.UserStatus;
import com.handloom.marketplace.repository.UserAccountRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserAccountRepository userAccountRepository;

    public UserService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.UserResponse> getUsersForAdmin() {
        return userAccountRepository.findAll(Sort.by(Sort.Direction.ASC, "internalUser").descending().and(Sort.by(Sort.Direction.ASC, "createdAt")))
                .stream()
                .map(ApiMapper::toUserResponse)
                .toList();
    }

    @Transactional
    public ApiDtos.MessageResponse updateStatus(String userId, ApiDtos.StatusUpdateRequest request) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (user.isInternalUser()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Internal staff accounts cannot be modified from this endpoint.");
        }

        user.setStatus(UserStatus.fromValue(request.status()));
        userAccountRepository.save(user);
        return new ApiDtos.MessageResponse(true, "User status updated successfully.");
    }

    @Transactional
    public ApiDtos.MessageResponse deleteUser(String userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (user.isInternalUser()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Internal staff accounts cannot be deleted.");
        }

        userAccountRepository.delete(user);
        return new ApiDtos.MessageResponse(true, "User deleted successfully.");
    }
}
