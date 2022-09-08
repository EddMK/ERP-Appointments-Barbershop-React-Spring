package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.backend.entity.Barbershop;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.BarbershopRepository;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@Controller 
@RequestMapping(path="/admin") 
public class AdminController {

    @Autowired 
    private AppointmentRepository appointmentRepository;

    @Autowired 
    private BarbershopRepository barbershopRepository;


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

}
