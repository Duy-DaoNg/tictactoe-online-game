package com.example.web.utils;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.Map;

public class JwtUtil {
    private static String SECRET_KEY;


    private static String secretKey = "thisismysecretkeyahahahahahamainstringarenot12lwiniganinia";

    public static String generateToken(Map<String, String> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + 864000))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public static String extractToken(String token, String key) {
        return (String) Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .get(key);
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    public static String getUsernameFromJwtCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) { // Replace with your actual cookie name
                    String token = cookie.getValue();
                    try {
                        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
                        return (String) claims.get("username");
                    } catch (SignatureException e) {
                        // Handle exception (e.g., token is invalid)
                    }
                }
            }
        }

        return null;
    }
}