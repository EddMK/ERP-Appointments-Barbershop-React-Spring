package com.example.backend.security;

 
public class AuthResponse {
    private String email;
    private String accessToken;
 
    public AuthResponse() { }
     
    public AuthResponse(String email, String accessToken) {
        this.email = email;
        this.accessToken = accessToken;
    }
 
    // getters and setters are not shown...

    public String getEmail(){
        return email;
    }

    public String getAccessToken(){
        return accessToken;
    }
}