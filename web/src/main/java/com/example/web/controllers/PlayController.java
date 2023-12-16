package com.example.web.controllers;

import com.example.web.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/play")
public class PlayController {
    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<byte[]> showPlayPage() throws IOException {
        Resource resource = new ClassPathResource("static/play.html");
        byte[] data = Files.readAllBytes(Path.of(resource.getURI()));

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(data);
    }
}