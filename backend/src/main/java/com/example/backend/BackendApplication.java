package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.BarbershopRepository;
import com.example.backend.repository.ServiceRepository;
import com.example.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;


@SpringBootApplication
//@SpringBootApplication(exclude={SecurityAutoConfiguration.class})
public class BackendApplication  {

	@Autowired 
  	private AppointmentRepository appointmentRepository;

	@Autowired 
  	private BarbershopRepository barbershopRepository;

	@Autowired 
  	private ServiceRepository serviceRepository;

	@Autowired 
  	private UserRepository userRepository;
	
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}
	

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/greeting-javaconfig").allowedOrigins("http://localhost:8080");
			}
		};
	}

	@Bean
	public Runner schedulerRunner() {
		return new Runner(appointmentRepository, barbershopRepository, serviceRepository, userRepository);
	}

}
