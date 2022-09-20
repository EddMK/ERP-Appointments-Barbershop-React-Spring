package com.example.backend.controller;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.entity.Availability;
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
@RequestMapping(path="/hairdresser") 
public class HairdresserController {
  
  @Autowired 
  private UserRepository userRepository;

  @CrossOrigin
  @GetMapping(path="/availibility/{id}")
  public @ResponseBody Availability getAvailability(@PathVariable Integer id) {
    User hairdresser = userRepository.findById(id).get();
    return hairdresser.getAvailability();
  }

}
