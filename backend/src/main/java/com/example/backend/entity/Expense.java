package com.example.backend.entity;
import javax.persistence.Entity;
import java.sql.Timestamp;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity 
public class Expense {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    private String name;

    private String type;

    private Integer barbershop;

    private Double  price;

    private Timestamp date;

    public Expense(String name, Double price, Timestamp date, String type, Integer barbershopId){
        this.name = name;
        this.price = price; 
        this.date = date;
        this.type = type;
        this.barbershop = barbershopId;  
    }
    
    public Expense(){}

    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name =  name;
    }

    @JsonProperty("type")
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type =  type;
    }

    @JsonProperty("price")
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }

    @JsonProperty("barbershop")
    public Integer getBarbershop() {
        return barbershop;
    }
    
    public void setBarbershop(Integer id) {
        this.barbershop = id;
    }

    @JsonProperty("date")
    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }
    
}
