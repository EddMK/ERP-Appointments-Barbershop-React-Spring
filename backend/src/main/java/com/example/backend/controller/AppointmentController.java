package com.example.backend.controller;


import com.example.backend.entity.Appointment;
import com.example.backend.entity.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
//import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller // This means that this class is a Controller
@RequestMapping(path="/appointment") // This means URL's start with /demo (after Application path)
public class AppointmentController {
  
  @Autowired 
  private AppointmentRepository appointmentRepository;

  @Autowired 
  private UserRepository userRepository;

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
  @PostMapping(path="/addDayOff") // Map ONLY POST Requests
  public @ResponseBody String addDayOff (@RequestBody Appointment appointment){
    LocalDate st = appointment.getStart().toLocalDateTime().toLocalDate();
    LocalDate ed = appointment.getEnd().toLocalDateTime().toLocalDate();
    int idHairdresser = 250;
    Optional<User> hairdresser  = userRepository.findById(idHairdresser);
    if(!st.isEqual(ed)){
      List<LocalDate> listes = st.datesUntil(ed).collect(Collectors.toList());
      listes.add(ed);
      for (LocalDate temp : listes) {
        Appointment a = new Appointment();
        a.setTitle("day off");
        a.setStart(Timestamp.valueOf(temp.atStartOfDay()));
        a.setEnd(Timestamp.valueOf(temp.atTime(23, 59)));
        a.setHairdresser(hairdresser.get());
        appointmentRepository.save(a);
      }
    }else{
      Appointment a = new Appointment();
      a.setTitle("day off");
      a.setStart(appointment.getStart());
      a.setEnd(appointment.getEnd());
      appointmentRepository.save(a);
    }
    return "Saved";
  }

  @CrossOrigin
  @PostMapping(path="/addMultipleDayoff") // Map ONLY POST Requests
  public @ResponseBody String addMultipleDayoff (@RequestBody Appointment appointment){
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

  @CrossOrigin
  @GetMapping(path="/daysoff/{barbershopId}/{hairdresserId}")
  public @ResponseBody List<Appointment> getDaysoffByBarbershop(@PathVariable int barbershopId, @PathVariable int hairdresserId ) {
    return appointmentRepository.findDaysoffByBarbershop(barbershopId, hairdresserId);
  }

  @CrossOrigin
  @DeleteMapping(path="/delete/{id}")
  public @ResponseBody String deleteAppointment(@PathVariable int id) {
    appointmentRepository.deleteById(id);
    return "deleted";
  }

}
