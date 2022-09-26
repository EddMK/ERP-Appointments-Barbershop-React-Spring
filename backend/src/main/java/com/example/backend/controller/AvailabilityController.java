package com.example.backend.controller;
import com.example.backend.entity.Availability;
import com.example.backend.entity.Barbershop;
import com.example.backend.entity.User;
import com.example.backend.repository.AvailabilityRepository;
import com.example.backend.repository.BarbershopRepository;
import com.example.backend.repository.UserRepository;

import java.lang.reflect.Field;
import java.util.ArrayList;
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
@RequestMapping(path="/availability") 
public class AvailabilityController {

  @Autowired 
  private AvailabilityRepository availabilityRepository;

  @Autowired 
  private BarbershopRepository barbershopRepository;

  @Autowired 
  private UserRepository userRepository;

  @CrossOrigin
  @GetMapping(path="/daysoff/{barbershopId}/{hairdresserId}")
  public @ResponseBody List<Object> getDayoffBarbershop(@PathVariable int barbershopId, @PathVariable int hairdresserId) {
    List<Object> res = new ArrayList<Object>();
    List<Object> bar = new ArrayList<Object>();
    Barbershop b = barbershopRepository.findById(barbershopId).get();
    bar.add(b.getName());
    bar.add(b.getAvailability());
    res.add(bar);
    System.out.println(b.getAvailability().close());
    for (User hairdresser : userRepository.findHairdressersByBarbershop(245)) {
        List<Object> hair = new ArrayList<Object>();
        hair.add(hairdresser.getId());
        hair.add(hairdresser.getAvailability());
        res.add(hair);
    }
    return res;
  }

}

