package com.example.backend.dto;
import java.sql.Timestamp;


public class AppointmentDto {
    public Integer id;
    public Timestamp startDate;
    public Timestamp endDate;
    public String title;
    public Integer customerId;
    public Integer hairdresserId;
    public Integer duration;

}
