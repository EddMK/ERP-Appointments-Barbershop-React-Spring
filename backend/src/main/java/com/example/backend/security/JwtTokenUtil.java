package com.example.backend.security;

import java.util.Date;
 
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.example.backend.entity.User;
 
@Component
public class JwtTokenUtil {
    private static final long EXPIRE_DURATION = 24 * 60 * 60 * 1000; // 24 hour
     
    /* @Value("${app.jwt.secret}")
    private String SECRET_KEY;*/
     
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(String.format("%s", user.getEmail()))
                .setIssuer("CodeJava")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                .signWith(SignatureAlgorithm.HS512, "Mnmk")
                .compact();
                 
    }
}
