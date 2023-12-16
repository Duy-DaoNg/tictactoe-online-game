package com.example.web.repositories;

import com.example.web.enities.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface HistoryRepository extends JpaRepository<History, Long> {
    @Transactional
    @Modifying
    @Query("INSERT INTO History (roomId, player1, player2, player1Score, player2Score, timestamp) VALUES " +
            "(:room_id, :player1, :player2, :player1Score, :player2Score, :timestamp)")
    void insertHistory(
            @Param("room_id") String roomId,
            @Param("player1") String player1,
            @Param("player2") String player2,
            @Param("player1Score") int player1Score,
            @Param("player2Score") int player2Score,
            @Param("timestamp") LocalDateTime timestamp);

    Page<History> findByPlayer1OrPlayer2(String player1, String player2, Pageable pageable);
}
