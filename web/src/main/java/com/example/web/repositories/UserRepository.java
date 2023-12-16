package com.example.web.repositories;

import com.example.web.enities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPassword(String username, String password);

    @Query("SELECT CASE " +
            "WHEN COUNT(u) > 0 THEN true " +
            "ELSE false END " +
            "FROM User u " +
            "WHERE u.username = :username")
    boolean existUsername(@Param("username") String username);

    @Query("SELECT CASE " +
            "WHEN COUNT(u) > 0 THEN true " +
            "ELSE false END " +
            "FROM User u " +
            "WHERE u.email = :email")
    boolean existEmail(@Param("email") String email);

    @Transactional
    @Modifying
    @Query("INSERT INTO User (email, password, username) VALUES (:email, :password, :username)")
    void insertUser(@Param("email") String email, @Param("password") String password, @Param("username") String username);
}
