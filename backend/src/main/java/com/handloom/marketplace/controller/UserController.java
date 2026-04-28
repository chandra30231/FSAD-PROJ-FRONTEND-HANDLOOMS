package com.handloom.marketplace.controller;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<ApiDtos.UserResponse> getUsersForAdmin() {
        return userService.getUsersForAdmin();
    }

    @PatchMapping("/{userId}/status")
    public ApiDtos.MessageResponse updateStatus(@PathVariable String userId, @Valid @RequestBody ApiDtos.StatusUpdateRequest request) {
        return userService.updateStatus(userId, request);
    }

    @DeleteMapping("/{userId}")
    public ApiDtos.MessageResponse deleteUser(@PathVariable String userId) {
        return userService.deleteUser(userId);
    }
}
