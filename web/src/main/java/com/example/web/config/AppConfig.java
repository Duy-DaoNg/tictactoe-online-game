package com.example.web.config;

import com.example.web.interceptors.JwtIncerceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtIncerceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/login", "/register/**", "/private/history", "/js/**", "/css/**");
    }
}
