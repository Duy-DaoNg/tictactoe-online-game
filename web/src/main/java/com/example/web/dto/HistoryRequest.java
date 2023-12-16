package com.example.web.dto;

public class HistoryRequest {
    private int BOARD_SIZE;
    private String firstPlayerID;
    private String secondPlayerID;
    private String roomId;
    private char[][] board;
    private String currentPlayer;
    private boolean firstPlayerRestart;
    private boolean secondPlayerRestart;
    private String firstPlayerScore;
    private String secondPlayerScore;

    HistoryRequest(int BOARD_SIZE, String firstPlayerID, String secondPlayerID, String roomId, char[][] board, String currentPlayer, boolean firstPlayerRestart, boolean secondPlayerRestart, String firstPlayerScore, String secondPlayerScore) {
        this.BOARD_SIZE = BOARD_SIZE;
        this.firstPlayerID = firstPlayerID;
        this.secondPlayerID = secondPlayerID;
        this.roomId = roomId;
        this.board = board;
        this.currentPlayer = currentPlayer;
        this.firstPlayerRestart = firstPlayerRestart;
        this.secondPlayerRestart = secondPlayerRestart;
        this.firstPlayerScore = firstPlayerScore;
        this.secondPlayerScore = secondPlayerScore;
    }

    public String getRoomId() {
        return roomId;
    }

    public String getFirstPlayerID() {
        return firstPlayerID;
    }

    public String getSecondPlayerID() {
        return secondPlayerID;
    }

    public String getSecondPlayerScore() {
        return secondPlayerScore;
    }

    public String getFirstPlayerScore() {
        return firstPlayerScore;
    }
}
