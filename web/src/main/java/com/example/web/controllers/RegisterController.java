package com.example.web.controllers;

import com.example.web.dto.LoginRequest;
import com.example.web.dto.RegisterRequest;
import com.example.web.enities.User;
import com.example.web.services.UserService;
import com.example.web.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Optional;


@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/email")
    public ResponseEntity<String> checkEmail(@RequestBody RegisterRequest registerRequest) {
        boolean result = userService.validEmail(registerRequest.getEmail());
        if (result) {
            return ResponseEntity.ok()
                    .body("Valid Email");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Email");
        }
    }
    @PostMapping("/username")
    public ResponseEntity<String> checkUsername(@RequestBody RegisterRequest registerRequest) {
        boolean result = userService.validUsername(registerRequest.getUsername());
        if (result) {
            return ResponseEntity.ok()
                    .body("Valid Username");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Username");
        }
    }
    @PostMapping("/password")
    public ResponseEntity<String> checkPassword(@RequestBody RegisterRequest registerRequest) {
        boolean result = userService.validPassword(registerRequest.getPassword());
        if (result) {
            return ResponseEntity.ok()
                    .body("Valid Password");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Password");
        }
    }
    @PostMapping("")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        boolean result = userService.validRegisterForm(
                registerRequest.getEmail(),
                registerRequest.getUsername(),
                registerRequest.getPassword());

        if (result) {
            userService.registerUser(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getEmail());

            return ResponseEntity.ok()
                    .header(HttpHeaders.LOCATION, "/login")
                    .body("Register successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials for registering");
        }
    }
}