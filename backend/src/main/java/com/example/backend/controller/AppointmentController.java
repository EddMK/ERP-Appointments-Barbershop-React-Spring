package com.example.backend.controller;


import com.example.backend.entity.Appointment;
import com.example.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    a.setHairdresser(appointment.getHairdresser());
    //CUSTOMER !!
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

  @CrossOrigin
  @GetMapping(path="/weekWorks/{timestamp}/{id}")
  public @ResponseBody List<Appointment> getAppointmentsWeek(@PathVariable long timestamp, @PathVariable int id ) {
    //System.out.println(timestamp);
    //System.out.println(id);
    LocalDate localDate = Instant.ofEpochMilli(timestamp).atZone(ZoneId.systemDefault()).toLocalDate();
    LocalDate monday = localDate;
    while (monday.getDayOfWeek() != DayOfWeek.MONDAY)
    {
      monday = monday.minusDays(1);
    }
    LocalDate sunday = localDate;
    while (sunday.getDayOfWeek() != DayOfWeek.SUNDAY)
    {
      sunday = sunday.plusDays(1);
    }
    sunday = sunday.plusDays(1);
    return appointmentRepository.findWeeksSchedule(id, monday.toString(), sunday.toString());
  }

}
