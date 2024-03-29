package com.example.backend.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(mail)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + mail));
    return UserDetail.build(user);
  }

}