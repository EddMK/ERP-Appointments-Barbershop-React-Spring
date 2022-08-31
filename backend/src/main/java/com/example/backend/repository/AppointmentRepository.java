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

    @Query(value = "SELECT * FROM appointment WHERE hairdresser_id = :id AND :monday <= start_date  AND start_date <= :sunday " ,nativeQuery = true)
    List<Appointment> findWeeksSchedule(@Param("id") int id , @Param("monday") String monday, @Param("sunday") String sunday);

    @Query(value = "SELECT * FROM EdBarbershop.appointment WHERE (title='day off' AND hairdresser_id IN ( SELECT id FROM EdBarbershop.user WHERE barbershop_id = :barbershopId)) OR (hairdresser_id = :hairdresserId AND start_date>now()) GROUP BY CAST(start_date AS DATE), title;" ,nativeQuery = true)
    List<Appointment> findDaysoffByBarbershop(@Param("barbershopId") int barbershopId, @Param("hairdresserId") int hairdresserId );
    
    // ATTENTION CHANGEZ LE START DATE PAR LE END DATE
    @Query(value = " SELECT SUM(service.price) AS turnover FROM appointment, service WHERE appointment.title = service.name  AND DATE(appointment.start_date) = DATE( NOW() ) AND appointment.start_date < NOW();" ,nativeQuery = true)
    Integer findAppointmentToday();

    @Query(value = " SELECT COALESCE(SUM(service.price), 0) AS turnover FROM appointment, service WHERE appointment.title = service.name  AND month(appointment.start_date) = :month AND year(appointment.start_date) = :year  ;" ,nativeQuery = true)
    Integer findTurnoverMonth(@Param("month") int month, @Param("year") int year );

}
/*
SELECT sum(EdBarbershop.service.price)
FROM EdBarbershop.appointment, EdBarbershop.service
WHERE 
EdBarbershop.appointment.title = EdBarbershop.service.name 
AND month(EdBarbershop.appointment.start_date) = month( NOW() );
 */