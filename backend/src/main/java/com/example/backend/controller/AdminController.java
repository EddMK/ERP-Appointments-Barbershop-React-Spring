package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.backend.entity.Barbershop;
import com.example.backend.entity.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.BarbershopRepository;//userRepository
import com.example.backend.repository.UserRepository;

import org.springframework.web.bind.annotation.RequestBody;
import com.example.backend.entity.Expense;
import com.example.backend.repository.ExpenseRepository;

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

    @Autowired 
    private ExpenseRepository expenseRepository;

    @Autowired 
    private UserRepository userRepository;


  @CrossOrigin
  @GetMapping(path="/turnoverToday/")
  public @ResponseBody String getTurnoverToday() { 
    return String.valueOf(appointmentRepository.findAppointmentToday());
  }

  @CrossOrigin
  @GetMapping(path="/turnoverThisMonth/")
  public @ResponseBody String getTurnoverThisMonth() { 
    return String.valueOf(appointmentRepository.findAppointmentThisMonth());
  }

  @CrossOrigin
  @GetMapping(path="/expenseThisMonth/")
  public @ResponseBody String getExpenseThisMonth() { 
    return String.valueOf(expenseRepository.findExpenseThisMonth());
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
  }//evolutionTurnoverExpense

  @CrossOrigin
  @GetMapping(path="/evolutionTurnoverHairdresser/{id}")
  public @ResponseBody List<Object>  getEvolutionTurnoverByHairdresser( @PathVariable int id ) { 
    LocalDate date = LocalDate.now();
    List<Object> res = new ArrayList<Object>();
    for(int i = 0; i<7 ; i ++){
      List<String> mois = new ArrayList<String>();
      date = date.minusMonths(1);
      mois.add(Month.of(date.getMonthValue()).name());
      mois.add(String.valueOf(appointmentRepository.findTurnoverMonthByHairdresser(date.getMonthValue(), date.getYear(), id)));
      res.add(mois);
    }
    return res;
  }//evolutionTurnoverExpense

  @CrossOrigin
  @GetMapping(path="/evolutionTurnoverExpense/")
  public @ResponseBody List<Object>  getEvolutionTurnoverExpense() { 
    LocalDate date = LocalDate.now();
    List<Object> res = new ArrayList<Object>();
    for(int i = 0; i<7 ; i ++){
      List<Object> mois = new ArrayList<Object>();
      List<String> name = new ArrayList<String>();
      date = date.minusMonths(1);
      name.add("name");
      name.add(Month.of(date.getMonthValue()).name());
      mois.add(name);      

        List<String> turnover = new ArrayList<String>();
        double ca = appointmentRepository.findTurnoverMonth(date.getMonthValue(), date.getYear());
        double salary =  ca/3;
        turnover.add("turnover");
        turnover.add(String.valueOf(ca));
        mois.add(turnover);
        List<String> expense = new ArrayList<String>();
        expense.add("expense");
        expense.add(String.valueOf(expenseRepository.findExpenseMonth(date.getMonthValue(), date.getYear()) + salary));
        mois.add(expense);

      res.add(mois);
    }
    return res;
  }//evolutionTurnoverExpense

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
  @GetMapping(path="/barChart/")
  public @ResponseBody List<Object>   getBarChart() { 
    // POUR LE MOIS D AOUT
    Iterable<Barbershop> listIdBarbershop = barbershopRepository.findAll();
    LocalDate date = LocalDate.now();
    date = date.minusMonths(1);
    //int mois = date.getMonthValue();
    List<Object> res = new ArrayList<Object>();
    for (Barbershop b : listIdBarbershop) {
      List<Object> barber = new ArrayList<Object>();
      barber.add(b.getName());
      //date.getMonthValue(), date.getYear()
      List<List<String>>  s = expenseRepository.getExpenseByBarbershop(b.getId().intValue());
      double depense = 0;
      for (List<String> object : s) {
        depense = depense + Double.valueOf(object.get(1));
      }
      int ca = appointmentRepository.findTurnoverMonthByBarbershop(date.getMonthValue(), date.getYear(), b.getId().intValue());
      List<String> salary = new ArrayList<String>();
      salary.add("Salaire");
      salary.add(String.valueOf(Math.round(ca / 3 * 100)/100));
      double benef = ca - Math.round(ca / 3 * 100)/100 - depense;
      List<String> total = new ArrayList<String>();
      total.add("Bénéfice");
      total.add(String.valueOf(benef));
      s.add(total);
      s.add(salary);
      barber.add(s);
      res.add(barber);
    }
    return res;
  }

  @CrossOrigin
  @PostMapping(path="/addExpense")
  public @ResponseBody String addExpense (@RequestBody Expense expense){
    System.out.println("bien arrivé !");
    System.out.println(expense.getName()+" "+expense.getBarbershop()+" "+expense.getType());
    Expense e = new Expense();
    e.setName(expense.getName());
    e.setDate(expense.getDate());
    e.setPrice(expense.getPrice());
    e.setBarbershop(expense.getBarbershop());
    e.setType(expense.getType());
    expenseRepository.save(e);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/getHairdressers")
  public @ResponseBody Iterable<User> getAllUsers() {
    return userRepository.findHairdressers();
  }

}
