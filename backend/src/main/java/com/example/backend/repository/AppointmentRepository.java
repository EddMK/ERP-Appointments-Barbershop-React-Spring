package com.example.backend.repository;

import com.example.backend.entity.Appointment;

import java.sql.Date;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

//import com.example.backend.Appointment;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {
    List<Appointment> findByStartDate(Date startDate);
}