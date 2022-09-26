package com.example.backend.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.entity.User;

public class UserDetail implements UserDetails {
 
    //@Id 
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
     
    @Column(nullable = false, length = 50, unique = true)
    private String email;
     
    @Column(nullable = false, length = 64)
    private String password;

    private Collection<? extends GrantedAuthority> authorities;
 
    public UserDetail() { }
     
    public UserDetail(Integer id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetail build(User user) {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();      
        authorities.add(new SimpleGrantedAuthority(user.getRole()));
        System.out.println(user.getId());
        return new UserDetail(
            user.getId(), 
            user.getEmail(), 
            user.getPassword(),
            authorities);
      }

    public Integer renvoieid() {
        return this.id;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
 
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
 
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
 
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
 
    @Override
    public boolean isEnabled() {
        return true;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return this.authorities;
    }

    @Override
    public String getPassword() {
        // TODO Auto-generated method stub
        return this.password;
    }
}
