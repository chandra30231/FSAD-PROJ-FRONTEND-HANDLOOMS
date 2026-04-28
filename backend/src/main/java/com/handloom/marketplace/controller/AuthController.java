package com.handloom.marketplace.controller;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiDtos.AuthResponse login(@Valid @RequestBody ApiDtos.LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public ApiDtos.RegisterResponse register(@Valid @RequestBody ApiDtos.RegisterRequest request) {
        return authService.register(request);
    }
}
