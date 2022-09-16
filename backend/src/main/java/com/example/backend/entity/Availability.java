package com.example.backend.entity;

import javax.persistence.Entity;
//import java.sql.Timestamp;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;

//import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonProperty;
//import javax.persistence.ManyToOne;

@Entity 
public class Availability{

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private String monday;

    private String tuesday;

    private String wednesday;

    private String thursday;

    private String friday;

    private String saturday;

    private String sunday;

    @OneToOne(mappedBy = "availability")
    private Barbershop barbershop;

    @OneToOne(mappedBy = "availability")
    private User hairdresser;

    public Availability(String monday, String tuesday, String wednesday, String thursday, String friday, 
                String saturday, String sunday){
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
    }
    
    public Availability(){}

    public String getMonday() {
        return monday;
    }

    public void setMonday(String monday) {
        this.monday = monday;
    }

    public String getTuesday() {
        return tuesday;
    }

    public void setTuesday(String tuesday) {
        this.tuesday = tuesday;
    }

    public String getWednesday() {
        return wednesday;
    }

    public void setWednesday(String wednesday) {
        this.wednesday = wednesday;
    }

    public String getThursday() {
        return thursday;
    }

    public void setThursday(String thursday) {
        this.thursday = thursday;
    }

    public String getFriday() {
        return friday;
    }

    public void setFriday(String friday) {
        this.friday = friday;
    }

    public String getSaturday() {
        return saturday;
    }

    public void setSaturday(String saturday) {
        this.saturday = saturday;
    }

    public String getSunday() {
        return sunday;
    }

    public void setSunday(String sunday) {
        this.sunday = sunday;
    }

/*
    public Integer getBarbershop() {
        return barbershop;
    }

    public void setBarbershop(Integer barbershop) {
        this.barbershop = barbershop;
    }    */
}