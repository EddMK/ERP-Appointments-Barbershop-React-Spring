package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller 
@RequestMapping(path="/user") 
public class UserController {
  
  @Autowired 
  private UserRepository userRepository;

  @CrossOrigin
  @PostMapping(path="/add") 
  public @ResponseBody String addNewUser (@RequestBody User user){

    User u = new User();
    u.setLastName(user.getLastName());
    u.setFirstName(user.getFirstName());
    u.setEmail(user.getEmail());
    u.setPhoneNumber(user.getPhoneNumber());
    u.setPassword(user.getPassword());
    u.setRole(user.getRole());
    userRepository.save(u);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<User> getAllUsers() {
    return userRepository.findAll();
  }

  @CrossOrigin
  @GetMapping(path="/hairdressByBarbershop/{id}")
  public @ResponseBody List<User> getHairdressByBarbershop(@PathVariable Long id) {
    return userRepository.findByBarbershopId(id);
  }

}

