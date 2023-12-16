package com.example.web.interceptors;

import com.example.web.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;


public class JwtIncerceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String jwtToken = getJwtFromCookie(request);
        System.out.println(jwtToken);
        if (jwtToken != null && JwtUtil.validateToken(jwtToken)) {

            System.out.println("Passed Cookie Test");
            return true;
        } else {
            System.out.println("Failed Cookie Test");
            response.sendRedirect("/login");
            return false;
        }
    }
    private String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
