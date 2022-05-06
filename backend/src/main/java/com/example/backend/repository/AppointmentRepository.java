package com.example.backend.repository;

import com.example.backend.entity.Appointment;

import java.sql.Timestamp;
import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

//import com.example.backend.Appointment;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {
    //1652097515000
    //from_unixtime(column_name, '%Y-%m-%d')
    //SELECT * FROM EdBarbershop.appointment WHERE DATE(start_date) = '2022-05-12'
    //SELECT * FROM EdBarbershop.appointment WHERE DATE(start_date) = FROM_UNIXTIME(1652097515000)
    //FROM_UNIXTIME(1447430881)

    @Query(value = "SELECT * FROM appointment WHERE DATE(start_date) = from_unixtime(:timestamp, '%Y-%m-%d')" ,nativeQuery = true)
    List<Appointment> findByStartDate(@Param("timestamp") long timestamp );

}