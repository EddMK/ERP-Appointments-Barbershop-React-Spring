package com.example.backend.controller;


import com.example.backend.entity.Appointment;
import com.example.backend.entity.Barbershop;
import com.example.backend.entity.User;
import com.example.backend.entity.Notification;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.BarbershopRepository;
import com.example.backend.repository.UserRepository;//NotificationRepository
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.backend.repository.NotificationRepository;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.sql.Array;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
//import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Controller // This means that this class is a Controller
@RequestMapping(path="/appointment") // This means URL's start with /demo (after Application path)
public class AppointmentController {
  
  @Autowired 
  private AppointmentRepository appointmentRepository;

  @Autowired 
  private BarbershopRepository barbershopRepository;

  @Autowired 
  private NotificationRepository notificationRepository;

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
  @PostMapping(path="/addAbsence") // Map ONLY POST Requests
  public @ResponseBody String addAbsence (@RequestBody Appointment appointment){
    Appointment a = new Appointment();
    String reason = appointment.getTitle();
    a.setTitle("absence");
    a.setStart(appointment.getStart());
    a.setEnd(appointment.getEnd());
    a.setHairdresser(appointment.getHairdresser());
    //CUSTOMER !! ==> null Faut notifier aux 
    
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
      a.setHairdresser(hairdresser.get());
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
  @GetMapping(path="/turnoverToday/")
  public @ResponseBody String getTurnoverToday() { 
    return String.valueOf(appointmentRepository.findAppointmentToday());
  }

  @CrossOrigin
  @GetMapping(path="/evolutionTurnover/")
  public @ResponseBody List<Object>  getEvolutionTurnover() { 
    LocalDate date = LocalDate.now();
    List<Object> res = new ArrayList<Object>();
    for(int i = 0; i<7 ; i ++){
      List<String> mois = new ArrayList<String>();
      date = date.minusMonths(1);
      mois.add(Month.of(date.getMonthValue()).name());
      mois.add(String.valueOf(appointmentRepository.findTurnoverMonth(date.getMonthValue(), date.getYear())));
      res.add(mois);
    }
    return res;
  }

  @CrossOrigin
  @GetMapping(path="/evolutionTurnoverBarbershop/")
  public @ResponseBody List<Object>  getEvolutionTurnoverByBarbershop() { 
    LocalDate date = LocalDate.now();
    List<Object> res = new ArrayList<Object>();
    Iterable<Barbershop> listIdBarbershop = barbershopRepository.findAll();
    for(int i = 0; i<7 ; i ++){
      List<Object> mois = new ArrayList<Object>();
      List<String> name = new ArrayList<String>();
      date = date.minusMonths(1);
      name.add("name");
      name.add(Month.of(date.getMonthValue()).name());
      mois.add(name);      
      for (Barbershop b : listIdBarbershop) {
        List<String> barber = new ArrayList<String>();
        barber.add(b.getName());
        barber.add(String.valueOf(appointmentRepository.findTurnoverMonthByBarbershop(date.getMonthValue(), date.getYear(), b.getId().intValue())));
        mois.add(barber);
      }
      res.add(mois);
    }
    return res;
  }

  @CrossOrigin
  @DeleteMapping(path="/delete/{id}")
  public @ResponseBody String deleteAppointment(@PathVariable int id) {
    appointmentRepository.deleteById(id);
    return "deleted";
  }

  @CrossOrigin
  @DeleteMapping(path="/absence")
  public @ResponseBody String addAbsence(@RequestParam List<Integer> ids) {
    System.out.println("Here we are");
    System.out.println(ids);

    for(Integer id : ids){
      //appointmentRepository.deleteById(id);
      //PREVENIR LE CLIENTS
      Optional<Appointment> app  = appointmentRepository.findById(id);
      int idCustomer = app.get().getCustomer().getId();
      int idHairdresser = app.get().getHairdresser().getId();
      Notification n = new Notification(idHairdresser,idCustomer, "absence");
      notificationRepository.save(n);

      //SUPPRIMER LE RENDEZ VOUS
      appointmentRepository.deleteById(id);
    }
    //appointmentRepository.deleteById(id);
    //PREVENIR LES CLIENTS
    return "deleted";
  }

  @CrossOrigin
  @DeleteMapping(path="/delay/{minutes}/")
  public @ResponseBody String addDelay(@RequestParam List<Integer> ids, @PathVariable Integer minutes) {
    System.out.println("Here we are");
    System.out.println(ids);
    System.out.println(minutes);

    for(Integer id : ids){
      //appointmentRepository.deleteById(id);
      //PREVENIR LE CLIENTS
      Optional<Appointment> app  = appointmentRepository.findById(id);
      Appointment appointment = app.get();
      int idCustomer = appointment.getCustomer().getId();
      int idHairdresser = appointment.getHairdresser().getId();
      Notification n = new Notification(idHairdresser,idCustomer, "delay");
      notificationRepository.save(n);      
      appointment.setStart( new Timestamp(appointment.getStart().getTime() + TimeUnit.MINUTES.toMillis(minutes)) );
      appointment.setEnd(new Timestamp(appointment.getEnd().getTime() + TimeUnit.MINUTES.toMillis(minutes)));
      appointmentRepository.save(appointment);
    }

    //appointmentRepository.deleteById(id);
    //PREVENIR LES CLIENTS
    return "deleted";
  }

}
