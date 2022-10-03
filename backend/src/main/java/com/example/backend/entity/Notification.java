package com.example.backend.entity;
import javax.persistence.Entity;
//import java.sql.Timestamp;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonProperty;
//import javax.persistence.ManyToOne;

@Entity 
public class Notification {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sender", nullable = true)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver", nullable = true)
    private User receiver;

    private String message;

    public Notification(User sender,User receiver,String message){
        this.sender = sender;
        this.receiver = receiver; 
        this.message = message;  
    }
    
    public Notification(){}

    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public User getSender() {
        return sender;
    }
    
    public void setSender(User id) {
        this.sender = id;
    }

    public User getReceiver() {
        return receiver;
    }
    
    public void setReceiver(User id) {
        this.receiver = id;
    }

    @JsonProperty("message")
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
}
