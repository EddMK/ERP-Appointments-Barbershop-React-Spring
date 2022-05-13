package com.example.backend.controller;


import com.example.backend.entity.Appointment;
import com.example.backend.repository.AppointmentRepository;
import java.sql.Timestamp;
import java.sql.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@Controller // This means that this class is a Controller
@RequestMapping(path="/appointment") // This means URL's start with /demo (after Application path)
public class AppointmentController {
  
  @Autowired 
  private AppointmentRepository appointmentRepository;

  @CrossOrigin
  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewAppointment (@RequestBody Appointment appointment){
    Appointment a = new Appointment();
    a.setTitle(appointment.getTitle());
    a.setStart(appointment.getStart());
    a.setEnd(appointment.getEnd());
    //a.setCustomer(appointment.getCustomer());
    a.setHairdresser(appointment.getHairdresser());
    System.out.println("coiffeur : "+appointment.getHairdresser());
    appointmentRepository.save(a);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<Appointment> getAllAppointments() {
    return appointmentRepository.findAll();
  }

  @CrossOrigin
  @GetMapping(path="/byStartDate/{timestamp}/{id}")
  public @ResponseBody List<Appointment> getAppointmentsByDate(@PathVariable long timestamp, @PathVariable int id ) {
    return appointmentRepository.findByStartDate(timestamp, id);
  }
}
