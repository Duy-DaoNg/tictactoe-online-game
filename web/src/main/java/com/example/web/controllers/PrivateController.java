package com.example.web.controllers;

import com.example.web.dto.HistoryRequest;
import com.example.web.services.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private/history")
public class PrivateController {
    @Autowired
    private HistoryService historyService;
    @PostMapping("")
    public ResponseEntity<String> registerUser(@RequestBody HistoryRequest historyRequest) {
        try {
            historyService.insertHistory(
                    historyRequest.getRoomId(),
                    historyRequest.getFirstPlayerID(),
                    historyRequest.getSecondPlayerID(),
                    Integer.parseInt(historyRequest.getFirstPlayerScore()),
                    Integer.parseInt(historyRequest.getSecondPlayerScore())
            );

            return ResponseEntity.ok().body("Insert successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid value for history");
        }

    }
}
