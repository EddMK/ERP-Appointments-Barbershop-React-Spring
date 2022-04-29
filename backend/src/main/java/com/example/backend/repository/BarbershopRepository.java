package com.example.backend.repository;

import com.example.backend.entity.Barbershop;

import org.springframework.data.repository.CrudRepository;

//import com.example.backend.Barbershop;

public interface BarbershopRepository extends CrudRepository<Barbershop, Integer> {
    
}
