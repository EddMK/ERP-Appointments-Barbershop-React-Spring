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

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.AuthRequest;
import com.example.backend.security.AuthResponse;
import com.example.backend.security.JwtTokenUtil;
import com.example.backend.security.SignupRequest;
import com.example.backend.security.UserDetail;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin
@Controller 
@RequestMapping(path="/authentication") 
public class AuthenticationController {
    @Autowired 
    AuthenticationManager authManager;
    @Autowired 
    JwtTokenUtil jwtUtil;
    
    @Autowired 
    private UserRepository userRepository;

    @PostMapping(path="/login") 
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request) {
        System.out.println(request.getEmail());
        System.out.println(request.getPassword());
        if (userRepository.existsByEmail(request.getEmail())) {
            User utilisateur = userRepository.findByEmail(request.getEmail()).get();
            if(utilisateur.getRole() == Role.CUSTOMER.toString()){
                if(utilisateur.getAbsence() >= 3){
                    return ResponseEntity.badRequest().body(new MessageError("Error: Your account has been blocked because you did not warn your absence 3 times."));//
                }
            }
        }
        try {
            Authentication authentication = authManager.authenticate( new UsernamePasswordAuthenticationToken( request.getEmail(), request.getPassword()) );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetail user = (UserDetail) authentication.getPrincipal();
            List<String> roles = user.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
            String accessToken = jwtUtil.generateAccessToken(user);
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, accessToken).body(new AuthResponse(user.renvoieid(), user.getUsername(), roles, accessToken));             
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.email)) {
            return ResponseEntity.badRequest().body(new MessageError("Error: Email is already in use!"));//
        }
        User customer = new User(signUpRequest.lastName, signUpRequest.firstName, signUpRequest.email, signUpRequest.phone, signUpRequest.password);  
        userRepository.save(customer);
        Authentication authentication = authManager.authenticate( new UsernamePasswordAuthenticationToken( signUpRequest.email, signUpRequest.password) );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetail user = (UserDetail) authentication.getPrincipal();
        List<String> roles = user.getAuthorities().stream().map(item -> item.getAuthority()).collect(Collectors.toList());
        System.out.println("Roles"+roles);
        String accessToken = jwtUtil.generateAccessToken(user);
        //AuthResponse response = new AuthResponse(user.getUsername(), accessToken);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, accessToken).body(new AuthResponse(user.renvoieid(), user.getUsername(), roles, accessToken));
    }

    static class MessageError{
        public String body;

        MessageError(String body){
            this.body= body;
        }

        public void setBody(String mess){
            this.body = mess;
        }
    }
    
}

