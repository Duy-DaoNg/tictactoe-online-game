package com.example.web.services;

import com.example.web.enities.User;
import com.example.web.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.web.utils.RegexUtil;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> loginUser(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public boolean validEmail(String email) {
        if (RegexUtil.isValidEmail(email)) {
            return !userRepository.existEmail(email);
        }
        return false;
    }
    public boolean validUsername(String username) {
        if (username.length() < 51 && username.length() > 3) {
            return !userRepository.existUsername(username);
        }
        return false;
    }
    public boolean validPassword(String password) {
        return password.length() >= 4;
    }
    public boolean validRegisterForm(String email, String username, String password) {
        return validEmail(email) && validUsername(username) && validPassword(password);
    }
    public void registerUser(String username, String password, String email) {
        userRepository.insertUser(email, password, username);
    }
}
