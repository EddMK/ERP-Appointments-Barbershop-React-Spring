package com.example.backend.controller;

import com.example.backend.dto.AppointmentDto;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;
import java.util.List;

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
import org.modelmapper.ModelMapper;



@Controller 
@RequestMapping(path="/customer") 
public class CustomerController {

    @Autowired
	private ModelMapper modelMapper;
  
  	@Autowired 
  	private AppointmentRepository appointmentRepository;

	@Autowired 
  	private UserRepository userRepository;

	@CrossOrigin
	@PostMapping(path="/add") // Map ONLY POST Requests
	public @ResponseBody String addNewAppointment (@RequestBody AppointmentDto appointment){
		System.out.println("ARRIVE !");
		Appointment a = new Appointment();
		a.setTitle(appointment.title);
		a.setStart(appointment.startDate);
		a.setEnd(appointment.endDate);
		a.setHairdresser(userRepository.findById(appointment.hairdresserId).get());
		a.setCustomer(userRepository.findById(appointment.customerId).get());
		appointmentRepository.save(a);
		return "Saved";
  }

}

