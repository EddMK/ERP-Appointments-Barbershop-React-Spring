package com.example.backend.repository;

import com.example.backend.entity.Barbershop;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

//import com.example.backend.Barbershop;

public interface BarbershopRepository extends CrudRepository<Barbershop, Integer> {

}
