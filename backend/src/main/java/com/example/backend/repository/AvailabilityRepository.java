package com.example.backend.repository;

import com.example.backend.entity.Availability;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface AvailabilityRepository extends CrudRepository<Availability, Integer> {

   
}
