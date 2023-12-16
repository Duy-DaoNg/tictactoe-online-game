package com.example.web.enities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String roomId;
    private String player1;
    private String player2;
    private int player1Score;
    private int player2Score;
    private LocalDateTime timestamp;
    public History() {

    }
    public History(String roomId, String player1, String player2, int player1Score, int player2Score, LocalDateTime timestamp) {
        this.roomId = roomId;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Score = player1Score;
        this.player2Score = player2Score;
        this.timestamp = timestamp;
    }
    public int getId() {
        return id;
    }

    public String getRoomId() {
        return roomId;
    }

    public String getPlayer1() {
        return player1;
    }
    public String getPlayer2() {
        return player2;
    }
    public int getPlayer2Score() {
        return player2Score;
    }
    public int getPlayer1Score() {
        return player1Score;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
