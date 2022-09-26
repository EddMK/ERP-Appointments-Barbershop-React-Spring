package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import com.example.backend.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends CrudRepository<User, Integer> {
    List<User> findByBarbershopId(Integer id);

    Optional<User> findByFirstName(String firstname);

    Optional<User>  findByEmail(String email);

    User findById(Long Id);

    @Query(value = "SELECT * FROM user WHERE  barbershop_id IS NOT NULL " ,nativeQuery = true)
    List<User> findHairdressers();

    @Query(value = "SELECT * FROM user WHERE  barbershop_id = :id " ,nativeQuery = true)
    List<User> findHairdressersByBarbershop(@Param("id") int id );
}

