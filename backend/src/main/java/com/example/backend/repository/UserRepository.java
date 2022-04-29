package com.example.backend.repository;

import java.util.List;

import com.example.backend.entity.User;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    List<User> findByBarbershopId(Long id);
}
