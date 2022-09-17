package com.example.backend.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonProperty;


@Entity
public class User implements UserDetails  {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private String lastName;

    private String firstName;

    private String email;

    private String phoneNumber;

    private String password;

    @Enumerated(EnumType.STRING) 
    private Role role;

    @ManyToOne
    @JoinColumn(name = "barbershop_id", nullable = true)
    private Barbershop barbershop;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "availability_id", referencedColumnName = "id")
    private Availability availability;


    @JoinColumn(nullable = true)
    private LocalDate start;

    public User(String lastName, String firstName, String email, String phoneNumber, String password, Role role, Barbershop barbershop, LocalDate start){
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.role = role;
        this.barbershop = barbershop;
        this.start = start;
    }
    
    public User(){

    }

    @OneToMany(mappedBy = "customer")
    private Set<Appointment> appointmentCustomers;

    @OneToMany(mappedBy = "hairdresser")
    private Set<Appointment> appointmentEmployees;


    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }

    @JsonProperty("lastName")
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @JsonProperty("firstName")
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonProperty("phoneNumber")
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @JsonProperty("password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @JsonProperty("role")
    public String getRole() {
        return role.toString();
    }

    public void setRole(String role) {
        this.role = Role.valueOf(role);
    }

    @JsonProperty("barbershop")
    public Barbershop getBarbershop() {
        if(this.barbershop == null){
            return null;
        }
        return barbershop;
    }

    public Availability getAvailability(){
        return availability;
    }

    public void setAvailability(Availability av){
        this.availability = av;
    }

    @JsonProperty("start")
    public LocalDate getStart() {
        return start;
    }

    public void setPassword(LocalDate date) {
        this.start = date;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isEnabled() {
        // TODO Auto-generated method stub
        return true;
    }


}

