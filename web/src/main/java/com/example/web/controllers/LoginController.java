package com.example.web.controllers;

import com.example.web.dto.LoginRequest;
import com.example.web.enities.User;
import com.example.web.services.UserService;
import com.example.web.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<byte[]> showLoginPage() throws IOException {
        Resource resource = new ClassPathResource("static/login.html");
        byte[] data = Files.readAllBytes(Path.of(resource.getURI()));

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(data);
    }
    @PostMapping("")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (user.isPresent()) {
            HashMap<String, String> claims = new HashMap<>();
            claims.put("username", loginRequest.getUsername());

            String jwtToken = JwtUtil.generateToken(claims);
            Cookie cookie = new Cookie("jwt", jwtToken);
            cookie.setMaxAge(864000);
            Cookie username = new Cookie("username", loginRequest.getUsername());
            username.setMaxAge(864000);
            response.addCookie(cookie);
            response.addCookie(username);
            return ResponseEntity.ok()
                    .header(HttpHeaders.LOCATION, "/play")
                    .body("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping("/logout")
    public String removeCookie(HttpServletResponse response, @CookieValue(name = "jwt", required = false) String cookieValue) throws IOException {
        if (cookieValue != null) {
            // Create a new cookie with the same name and set its expiration date in the past
            Cookie cookieToRemove = new Cookie("jwt", null);
            cookieToRemove.setMaxAge(0);

            // Add the cookie to the response
            response.addCookie(cookieToRemove);
            response.sendRedirect("/login");
            return "Cookie removed successfully";
        } else {
            return "Cookie not found";
        }
    }

}
