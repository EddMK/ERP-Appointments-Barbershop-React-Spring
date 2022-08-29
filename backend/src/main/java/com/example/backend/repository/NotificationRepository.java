package com.example.backend.repository;

import com.example.backend.entity.Notification;
import org.springframework.data.repository.CrudRepository;

public interface NotificationRepository extends CrudRepository<Notification, Integer> {

}
