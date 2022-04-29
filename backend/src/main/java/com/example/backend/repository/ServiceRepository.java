package com.example.backend.repository;

import com.example.backend.entity.Service;

import org.springframework.data.repository.CrudRepository;

public interface ServiceRepository extends CrudRepository<Service, Integer> {
    
}
