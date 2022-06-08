package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.example.backend.repository.AppointmentRepository;

@SpringBootApplication
public class BackendApplication  {

	@Autowired 
  	private AppointmentRepository appointmentRepository;

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
		return new Runner(appointmentRepository);
	}
}
