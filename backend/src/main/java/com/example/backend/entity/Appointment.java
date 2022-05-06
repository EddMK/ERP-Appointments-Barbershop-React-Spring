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
 
  @ManyToOne
  @JoinColumn(name = "customer_id", nullable = true)
  private User customer;

  @ManyToOne
  @JoinColumn(name = "hairdresser_id", nullable = true)
  private User hairdresser;

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