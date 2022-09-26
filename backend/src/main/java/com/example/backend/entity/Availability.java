package com.example.backend.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
//import java.sql.Timestamp;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

//import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonProperty;
//import javax.persistence.ManyToOne;

@Entity 
public class Availability {

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

    public Availability(String monday, String tuesday, String wednesday, String thursday, String friday, String saturday, String sunday ){
        this.monday =monday;
        this.tuesday =tuesday;
        this.wednesday =wednesday;
        this.thursday =thursday;
        this.friday =friday;
        this.saturday =saturday;
        this.sunday =sunday;

    }
    
    public Availability(){}

    public Integer getId(){
        return id;
    }

    public String getMonday(){
        return monday;
    }

    public void setMonday(String monday){
        this.monday = monday;
    }

    public String getTuesday(){
        return tuesday;
    }

    public void setTuesday(String tuesday){
        this.tuesday = tuesday;
    }

    public String getWednesday(){
        return wednesday;
    }

    public void setWednesday(String wednesday){
        this.wednesday = wednesday;
    }

    public String getThursday(){
        return thursday;
    }

    public void setThursday(String thursday){
        this.thursday = thursday;
    }

    public String getFriday(){
        return friday;
    }

    public void setFriday(String friday){
        this.friday = friday;
    }

    public String getSaturday(){
        return saturday;
    }

    public void setSaturday(String saturday){
        this.saturday = saturday;
    }

    public String getSunday(){
        return sunday;
    }

    public void setSunday(String sunday){
        this.sunday = sunday;
    }

    public List<String> dayoff(){
        List<String> array = new ArrayList<String>();
        if(this.getMonday() == "day off"){
            array.add("Monday");
        }if(this.getTuesday() == "day off"){
            array.add("Tuesday");
        }
        if(this.getWednesday() == "day off"){
            array.add("Wednesday");
        }
        if(this.getThursday() == "day off"){
            array.add("Thursday");
        }
        if(this.friday == "day off"){
            array.add("Friday");
        }
        if(this.getSaturday() == "day off"){
            array.add("Saturday");
        }if(this.getSunday() == "day off"){
            array.add("Sunday");
        }
        return array;
    }

    public List<String> close(){
        List<String> array = new ArrayList<String>();
        if(this.getMonday() == "close"){
            array.add("Monday");
        }if(this.getTuesday() == "close"){
            array.add("Tuesday");
        }
        if(this.getWednesday() == "close"){
            array.add("Wednesday");
        }
        if(this.getThursday() == "close"){
            array.add("Thursday");
        }
        if(this.friday == "close"){
            array.add("Friday");
        }
        if(this.getSaturday() == "close"){
            array.add("Saturday");
        }if(this.getSunday() == "close"){
            array.add("Sunday");
        }
        return array;
    }
    
}