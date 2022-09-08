package com.example.backend.controller;

import com.example.backend.entity.Expense;
import com.example.backend.repository.ExpenseRepository;
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
@RequestMapping(path="/expense") 
public class ExpenseController {

  @Autowired 
  private ExpenseRepository expenseRepository;

  @CrossOrigin
  @PostMapping(path="/add")
  public @ResponseBody String addExpense (@RequestBody Expense expense){
    Expense e = new Expense();
    e.setName(expense.getName());
    e.setDate(expense.getDate());
    e.setPrice(expense.getPrice());
    expenseRepository.save(e);
    return "Saved";
  }

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<Expense> getAllExpense() {
    return expenseRepository.findAll();
  }

}
