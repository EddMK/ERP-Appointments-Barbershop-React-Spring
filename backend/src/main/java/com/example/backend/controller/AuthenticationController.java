package com.example.backend.controller;

//import com.example.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import com.example.backend.security.AuthRequest;
import com.example.backend.security.AuthResponse;
import com.example.backend.security.JwtTokenUtil;
import com.example.backend.security.UserDetail;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin
@Controller 
@RequestMapping(path="/authentication") 
public class AuthenticationController {
    @Autowired AuthenticationManager authManager;
    @Autowired JwtTokenUtil jwtUtil;

    @PostMapping(path="/login") 
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {
        System.out.println(request.getEmail());
        System.out.println(request.getPassword());
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetail user = (UserDetail) authentication.getPrincipal();
            List<String> roles = user.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
            System.out.println("Roles"+roles);
            String accessToken = jwtUtil.generateAccessToken(user);
            AuthResponse response = new AuthResponse(user.getUsername(), accessToken);
            
            return ResponseEntity.ok().body(response);
             
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
}
