package com.example.backend.security;

import java.util.List;

public class AuthResponse {
    private Integer id;
    private String email;
    private String accessToken;
    private List<String> role;
 
    public AuthResponse() { }
     
    public AuthResponse(Integer Id, String email, List<String> role, String accessToken) {
        this.id = Id;
        this.role = role;
        this.email = email;
        this.accessToken = accessToken;
    }
 
    // getters and setters are not shown...

    public Integer getId(){
        return id;
    }

    
    public String getEmail(){
        return email;
    }

    public List<String> getRole(){
        return role;
    }

    public String getAccessToken(){
        return accessToken;
    }
}