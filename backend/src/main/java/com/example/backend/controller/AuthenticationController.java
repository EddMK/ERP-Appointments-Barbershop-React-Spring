package com.example.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.backend.payload.request.LoginRequest;
import com.example.backend.payload.response.JwtResponse;
import com.example.backend.security.jwt.JwtUtils;
import com.example.backend.security.services.UserDetailsImpl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin
@Controller 
@RequestMapping(path="/authentication") 
public class AuthenticationController {

    @Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
  	JwtUtils jwtUtils;	

    @PostMapping(path="/login") 
	public ResponseEntity<?> authenticateUser( @RequestBody LoginRequest loginRequest) throws Exception {
        
		Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
    	String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    	List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, 
							userDetails.getId(), 
							userDetails.getUsername(), 
							userDetails.getEmail(), 
							roles));
		

	}

    
}
