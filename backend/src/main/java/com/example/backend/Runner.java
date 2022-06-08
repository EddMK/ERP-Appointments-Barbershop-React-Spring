package com.example.backend;
import java.sql.Timestamp;
import java.util.Date;

import com.example.backend.entity.Appointment;
import com.example.backend.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

public class Runner implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(Runner.class);

    private final AppointmentRepository appointmentRepository;

    public Runner(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Runner() {
        this.appointmentRepository = null;
    }

    @Override
    public void run(String... args) throws Exception {
        appointmentRepository.deleteAll();
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        appointmentRepository.save(new Appointment(timestamp,timestamp, "coupe",null,null));
        logger.info("ApplicationStartupRunner run method Started !!");
    }
}
