package com.example.backend.repository;

import com.example.backend.entity.Notification;
import org.springframework.data.repository.CrudRepository;

public interface AvailabilityBarberRepository extends CrudRepository<Notification, Integer> {

}
