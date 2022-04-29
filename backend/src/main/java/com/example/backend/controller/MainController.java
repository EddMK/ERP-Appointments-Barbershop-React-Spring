package com.example.backend.controller;


import com.example.backend.entity.Appointment;
import com.example.backend.repository.AppointmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller // This means that this class is a Controller
@RequestMapping(path="/appointment") // This means URL's start with /demo (after Application path)
public class MainController {
  
  @Autowired 
  private AppointmentRepository appointmentRepository;

  @CrossOrigin
  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewAppointment (@RequestBody Appointment appointment){
     //Ò , @RequestBody Timestamp startDate, @RequestBody Timestamp endDate) {
    // @ResponseBody means the returned String is the response, not a view name
    // @RequestParam means it is a parameter from the GET or POST request

    Appointment a = new Appointment();
    a.setTitle(appointment.getTitle());
    a.setStart(appointment.getStart());
    a.setEnd(appointment.getEnd());
    appointmentRepository.save(a);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<Appointment> getAllAppointments() {
    // This returns a JSON or XML with the users
    return appointmentRepository.findAll();
  }
}