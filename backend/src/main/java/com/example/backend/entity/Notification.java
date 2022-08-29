package com.example.backend.entity;
import javax.persistence.Entity;
import java.sql.Timestamp;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.ManyToOne;

@Entity 
public class Notification {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private Integer fromId;

    private Integer toId;

    private String message;

    public Notification(Integer fromId,Integer toId,String message){
        this.fromId = fromId;
        this.toId = toId; 
        this.message = message;  
    }
    
    public Notification(){}

    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFromid() {
        return fromId;
    }
    
    public void setFromid(Integer id) {
        this.fromId = id;
    }

    public Integer getToid() {
        return toId;
    }
    
    public void setToid(Integer id) {
        this.toId = id;
    }

    @JsonProperty("message")
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
}
