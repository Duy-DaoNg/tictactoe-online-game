package com.example.web.services;

import com.example.web.repositories.HistoryRepository;
import com.example.web.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class HistoryService {
    @Autowired
    private HistoryRepository historyRepository;
    public void insertHistory(String roomId, String player1, String player2, int player1Score, int player2Score) {
        LocalDateTime currentDateTime = LocalDateTime.now();

        // Define a custom date-time format if needed
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Format the current date and time using the formatter
        String timestamp = currentDateTime.format(formatter);
        historyRepository.insertHistory(roomId, player1, player2, player1Score, player2Score, LocalDateTime.now());
    }

}
