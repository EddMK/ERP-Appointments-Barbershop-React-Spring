package com.example.backend.controller;

import com.example.backend.entity.Barbershop;
import com.example.backend.entity.User;
import com.example.backend.repository.BarbershopRepository;

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
@RequestMapping(path="/barbershop") 
public class BarbershopController {
  @Autowired 
  private BarbershopRepository barbershopRepository;

  @CrossOrigin
  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewBarbershop (@RequestBody Barbershop barbershop){
    Barbershop b = new Barbershop();
    b.setName(barbershop.getName());
    b.setAddress(barbershop.getAddress());
    barbershopRepository.save(b);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<Barbershop> getAllBarbershops() {
    return barbershopRepository.findAll();
  }

}

