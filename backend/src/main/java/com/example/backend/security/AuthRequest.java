package com.example.backend.security;
 
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
 
import org.hibernate.validator.constraints.Length;
 
public class AuthRequest {
    @NotNull @Email @Length(min = 5, max = 50)
    private String email;
     
    @NotNull @Length(min = 5, max = 10)
    private String password;
 
    // getters and setters are not shown...

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }
}