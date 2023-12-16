package com.example.tictactoeserver.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class Match {
    private static final int BOARD_SIZE = 3;
    String firstPlayerID;
    String secondPlayerID;
    String roomId;
    char[][] board;
    String currentPlayer;
    boolean firstPlayerRestart;
    boolean secondPlayerRestart;
    int firstPlayerScore;
    int secondPlayerScore;
    public Match() {

    }
    public Match(String firstPlayerID, String secondPlayerID) {
        this.firstPlayerID = firstPlayerID;
        this.secondPlayerID = secondPlayerID;
        this.currentPlayer = firstPlayerID;
        this.roomId = String.valueOf(UUID.randomUUID());
        firstPlayerRestart = false;
        secondPlayerRestart = false;
        firstPlayerScore = 0;
        secondPlayerScore = 0;
        initializeBoard();
    }
    private void updateScore(int player) {
        if (player == 1) {
            firstPlayerScore += 1;
        } else if (player == 2) {
            secondPlayerScore += 1;
        }
    }
    private void initializeBoard() {
        board = new char[BOARD_SIZE][BOARD_SIZE];
        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = ' ';
            }
        }
    }

    public void makeMove(int value) {
        int row = 0;
        int col = 0;
        if( value > 8 || value <0) return ;
        if(value < 3) {
            row = 0;
        } else if (value > 5) {
            row = 2;
        } else {
            row = 1;
        }
        if (value % 3 == 0) {
            col = 0;
        } else if (value % 3 == 1) {
            col = 1;
        } else {
            col = 2;
        }
        board[row][col] = (currentPlayer.equals(firstPlayerID)) ? 'X' : 'O';
        currentPlayer = (currentPlayer.equals(firstPlayerID)) ? secondPlayerID : firstPlayerID;
    }

    public int result() {
        // Check rows, columns, and diagonals
        int result = -1;
        for (int i = 0; i < BOARD_SIZE; i++) {
            if (board[i][0] != ' ' && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
                result = (board[i][0] == 'X') ? 1 : 2;
                updateScore(result);
                return result;
            }
            if (board[0][i] != ' ' && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
                result = (board[0][i] == 'X') ? 1 : 2;
                updateScore(result);
                return result;
            }
        }

        if (board[0][0] != ' ' && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            result = (board[0][0] == 'X') ? 1 : 2;
            updateScore(result);
            return result;
        }

        if (board[0][2] != ' ' && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            result = (board[0][2] == 'X') ? 1 : 2;
            updateScore(result);
            return result;
        }

        // Check for a draw
        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] == ' ') {
                    return -1; // Game is still ongoing
                }
            }
        }

        return 0; // It's a draw
    }

    public boolean restart(String playerId) {
        if (playerId.equals(firstPlayerID))
            firstPlayerRestart = true;
        else if (playerId.equals((secondPlayerID)))
            secondPlayerRestart = true;
        if (secondPlayerRestart & firstPlayerRestart) {
            resetMatch();
            return true;
        }
        return false;
    }

    private void resetMatch() {
        firstPlayerRestart = false;
        secondPlayerRestart = false;
        initializeBoard();
    }
    public void updateScore(String player) {
        if (player.equals(firstPlayerID)) firstPlayerScore += 1;
        else secondPlayerScore += 1;
    }
    public void sendRequest() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMatch = objectMapper.writeValueAsString(this);
            objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
            System.out.println("JSON String: " + jsonMatch);
            String apiUrl = "http://localhost:8080/private/history";

            URL url = new URL(apiUrl);

            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("POST");

            connection.setRequestProperty("Content-Type", "application/json");

            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()){
                byte[] input = jsonMatch.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);

            connection.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}