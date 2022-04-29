package com.example.backend.controller;

import com.example.backend.entity.Service;
import com.example.backend.repository.ServiceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller 
@RequestMapping(path="/service") 
public class ServiceController {

  @Autowired 
  private ServiceRepository serviceRepository;

  @CrossOrigin
  @PostMapping(path="/add")
  public @ResponseBody String addNewService (@RequestBody Service service){
    Service s = new Service();
    s.setName(service.getName());
    s.setDuration(service.getDuration());
    serviceRepository.save(s);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<Service> getAllServices() {
    return serviceRepository.findAll();
  }

}

