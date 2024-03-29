package com.example.backend.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonProperty;


@Entity
public class Barbershop {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private String name;

    private String address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "availability_id", referencedColumnName = "id")
    private Availability availability;

    @OneToMany(mappedBy = "barbershop")
    private Set<Expense> expenses;


    public Barbershop (String name, String address){
        this.name = name;
        this.address = address;
    }

    public Barbershop (){
        this.name = null;
        this.address = null;
    }

    public Integer getId() {
        return id;
    }

    @OneToMany
    @JoinColumn(name = "barbershop_id")
    private Set<User> hairdressers;
/* 
    public Set<User> getHairdressers() {
        return hairdressers;
    }
*/    
    public void setId(Integer id) {
        this.id = id;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Availability getAvailability(){
        return availability;
    }

    public void setAvailability(Availability av){
        this.availability = av;
    }

}
