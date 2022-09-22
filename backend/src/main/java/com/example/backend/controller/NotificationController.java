package com.example.backend.controller;

import com.example.backend.entity.Notification;
import com.example.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;


@Controller 
@RequestMapping(path="/notification") 
public class NotificationController {

  @Autowired 
  private NotificationRepository notificationRepository;

  @CrossOrigin
  @GetMapping(path="/all")
  public @ResponseBody Iterable<Notification> getAllServices() {
    return notificationRepository.findAll();
  }

  @CrossOrigin
  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewNotification (@RequestBody Notification notification){
    Notification n = new Notification();
    n.setFromid(notification.getFromid());
    n.setToid(notification.getToid());
    n.setMessage(notification.getMessage());
    //CUSTOMER !!
    notificationRepository.save(n);
    return "Saved";
  }

}
