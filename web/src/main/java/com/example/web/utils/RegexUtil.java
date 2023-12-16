package com.example.web.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexUtil {
    public static boolean isValidEmail(String email) {
        String gmailRegex = "^[a-zA-Z0-9_]+@gmail\\.com$";
        Pattern pattern = Pattern.compile(gmailRegex);
        Matcher matcher = pattern.matcher(email);

        return matcher.matches();
    }
}
