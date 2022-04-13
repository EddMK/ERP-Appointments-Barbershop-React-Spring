package com.example.backend;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Appointment {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Integer id;

  private Timestamp start;

  private Timestamp end;

  private String title;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Timestamp getStart() {
    return start;
  }

  public void setStart(Timestamp date) {
    this.start = date;
  }

  public Timestamp getEnd() {
    return end;
  }

  public void setEnd(Timestamp date) {
    this.end = date;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}