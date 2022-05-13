package com.example.backend.repository;

import com.example.backend.entity.Appointment;


import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//import com.example.backend.Appointment;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {


    @Query(value = "SELECT * FROM appointment WHERE hairdresser_id = :id AND DATE(start_date) = from_unixtime(:timestamp, '%Y-%m-%d')" ,nativeQuery = true)
    List<Appointment> findByStartDate(@Param("timestamp") long timestamp, @Param("id") int id );

}