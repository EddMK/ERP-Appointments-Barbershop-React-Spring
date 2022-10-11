package com.example.backend.entity;

import java.sql.Timestamp;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.ManyToOne;


@Entity 
public class Appointment {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Integer id;

  private Timestamp startDate;

  private Timestamp endDate;

  private String title;

  private Integer duration;

  private Integer sequence;
 
  @ManyToOne
  @JoinColumn(name = "customer_id", nullable = true)
  private User customer;

  @ManyToOne
  @JoinColumn(name = "hairdresser_id", nullable = true)
  private User hairdresser;

  public Appointment(Timestamp startDate,Timestamp endDate,String title, User customer, User hairdresser, Integer duree){
    this.startDate = startDate;
    this.endDate = endDate; 
    this.title = title;
    this.customer = customer;   
    this.hairdresser = hairdresser;    
    this.duration = duree;
  }

  public Appointment(){  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  @JsonProperty("startDate")
  public Timestamp getStart() {
    return startDate;
  }

  public void setStart(Timestamp date) {
    this.startDate = date;
  }

  @JsonProperty("endDate")
  public Timestamp getEnd() {
    return endDate;
  }

  public void setEnd(Timestamp date) {
    this.endDate = date;
  }

  public Integer getDuration (){
    return this.duration;
  }

  public void setDuration (Integer dur){
    this.duration = dur;
  }

  public Integer getSequence() {
    return sequence;
  }

  public void setSequence(Integer seq) {
    this.sequence = seq;
  }

  @JsonProperty("title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  @JsonProperty("customer_id")
  public User getCustomer() {
    return customer;
  }

  public void setCustomer(User customer) {
    this.customer = customer;
  }

  @JsonProperty("hairdresser_id")
  public User getHairdresser() {
    return hairdresser;
  }

  public void setHairdresser(User hairdresser) {
    this.hairdresser = hairdresser;
  }

}