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
public class Expense {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private String name;

    private Double  price;

    private Timestamp date;

    public Expense(String name, Double price, Timestamp date){
        this.name = name;
        this.price = price; 
        this.date = date;  
    }
    
    public Expense(){}

    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name =  name;
    }

    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }

    //@JsonProperty("message")
    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }
    
}
