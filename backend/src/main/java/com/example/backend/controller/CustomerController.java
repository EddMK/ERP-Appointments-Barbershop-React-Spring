package com.example.backend.controller;

import com.example.backend.dto.AppointmentDto;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.Barbershop;
import com.example.backend.entity.Role;
import com.example.backend.entity.Service;
import com.example.backend.entity.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ServiceRepository;
import com.example.backend.email.*;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
  	private AppointmentRepository appointmentRepository;

	@Autowired 
  	private UserRepository userRepository;
	
	@Autowired 
  	private ServiceRepository serviceRepository;

	@Autowired 
	private EmailServiceImpl emailService;
 

	@CrossOrigin
	@PostMapping(path="/add") // Map ONLY POST Requests
	public @ResponseBody ResponseEntity<Appointment> addNewAppointment (@RequestBody AppointmentDto appointment) throws IOException{
		System.out.println("ARRIVE !");
		Appointment a = new Appointment();
		User customer = userRepository.findById(appointment.customerId).get();
		a.setTitle(appointment.title);
		a.setStart(appointment.startDate);
		a.setEnd(appointment.endDate);
		a.setDuration(appointment.duration);
		a.setSequence(0);
		a.setHairdresser(userRepository.findById(appointment.hairdresserId).get());
		System.out.println("email : "+customer.getEmail());
		a.setCustomer(customer);
		Appointment newAppointment = appointmentRepository.save(a);
		String text = BodyMail.bodyAddAppointment(newAppointment);
		File obj = FileMail.fileAddAppointment(newAppointment);
		String status = emailService.sendMailWithAttachment(a.getCustomer().getEmail(), text, "EdBarbershop - Reservation confirmation", obj );
		System.out.println(status);
		return new ResponseEntity<>(newAppointment, HttpStatus.OK);
  	}

	@CrossOrigin
	@GetMapping(path="/hours/{id}") // Map ONLY POST Requests
	public @ResponseBody List<Object> getHoursDay(@PathVariable Integer id){
			return appointmentRepository.hoursDayAfterToday(id);
	}

	@CrossOrigin
	@GetMapping(path="/dayoff/{id}") // Map ONLY POST Requests
	public @ResponseBody List<Object> getDayoffHairdresser(@PathVariable Integer id){
			return appointmentRepository.findDaysoffByHairdresser(id);
	}

	@CrossOrigin
  	@GetMapping(path="/hairdressByBarbershop/{id}")
	public @ResponseBody List<User> getHairdressByBarbershop(@PathVariable Integer id) {
		return userRepository.findByBarbershopId(id);
	}

	@CrossOrigin
	@GetMapping(path="/byStartDate/{timestamp}/{id}")
	public @ResponseBody List<Appointment> getAppointmentsByDate(@PathVariable long timestamp, @PathVariable int id ) {
		return appointmentRepository.findByStartDate(timestamp, id);
	}

	@CrossOrigin
	@GetMapping(path="/getOwnAppointment/{id}")
	public @ResponseBody List<Appointment> getOwnAppointment(@PathVariable int id ) {
		return appointmentRepository.findOwnAppointment(id);
	}

	@CrossOrigin
	@GetMapping(path="/allServices")
	public @ResponseBody Iterable<Service> getAllServices() {
		return serviceRepository.findAll();
	}

	@CrossOrigin
	@DeleteMapping(path="/delete/{id}")
	public @ResponseBody String deleteAppointment(@PathVariable int id) throws IOException {
		//LE CLIENT SUPPRIMER ENVOYER UN MAIL ET UN EVENEMENT
		Appointment newAppointment = appointmentRepository.findById(id).get();
		String text = BodyMail.bodyDeleteAppointment(newAppointment);
		File obj = FileMail.fileDeleteAppointment(newAppointment);
		//CHANGER LE MAIL DU CLIENT
		String status = emailService.sendMailWithAttachment(newAppointment.getCustomer().getEmail(), text, "EdBarbershop - Reservation canceled", obj );
		appointmentRepository.deleteById(id);
		return "deleted - "+status;
	}

}

