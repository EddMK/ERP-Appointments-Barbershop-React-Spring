package com.example.backend;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.example.backend.entity.Appointment;
import com.example.backend.entity.User;
import com.example.backend.entity.Barbershop;
import com.example.backend.entity.Role;
import com.example.backend.entity.Service;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.BarbershopRepository;
import com.example.backend.repository.ServiceRepository;
import com.example.backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;

public class Runner implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(Runner.class);

    private final AppointmentRepository appointmentRepository;
  	private final BarbershopRepository barbershopRepository; 
  	private final ServiceRepository serviceRepository; 
  	private final UserRepository userRepository;

    public Runner(AppointmentRepository appointmentRepository,BarbershopRepository barbershopRepository, ServiceRepository serviceRepository, UserRepository userRepository ) {
        this.appointmentRepository = appointmentRepository;
        this.barbershopRepository = barbershopRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    public Runner() {
        this.appointmentRepository = null;
        this.barbershopRepository = null;
        this.serviceRepository = null;
        this.userRepository = null;
    }

    @Override
    public void run(String... args) throws Exception {
        appointmentRepository.deleteAll();
        barbershopRepository.deleteAll();
        userRepository.deleteAll();
        serviceRepository.deleteAll();

        Service s1 = new Service("coupe", Long.valueOf(15));
        Service s2 = new Service("barbe", Long.valueOf(5));

        Barbershop b1 = new Barbershop("Coiffure Simonis", "Av. de Jette 22, 1081 Bruxelles");
        Barbershop b2 = new Barbershop("Coiffeur Créa-Tif", "Chau. d'Alsemberg 764B, 1180 Uccle");
        Barbershop b3 = new Barbershop("Coiffure Es&Ar", "Rue Voot 10, 1200 Woluwe-Saint-Lambert");
        
        User admin = new User("admin", "admin", "admin@admin.com", "0485052451", "admin", Role.ADMIN, null);
        User hairdresser1 = new User("Adam", "Rachid" , "rachid@hairdress.com", "0485052452", "rachid", Role.EMPLOYEE, b1);
        User hairdresser2 = new User("Sebahat", "Michel", "michel@hairdress.com", "0485052453", "michel", Role.EMPLOYEE, b1);
        User hairdresser3 = new User("Nayis", "Mathieu", "mathieu@hairdress.com", "0485052455", "mathieu", Role.EMPLOYEE, b2);
        User hairdresser4 = new User("Livrizzi", "Alfredo", "alfredo@hairdress.com", "0485052456", "alfredo", Role.EMPLOYEE, b2);
        User hairdresser5 = new User("Zemmour", "Eric", "eric@hairdress.com", "0485052457", "eric", Role.EMPLOYEE, b3);
        User hairdresser6 = new User("Melenchon", "Jean", "jean@hairdress.com", "0485052458", "jean", Role.EMPLOYEE, b3);
        
        serviceRepository.save(s1);
        serviceRepository.save(s2);
        
        barbershopRepository.save(b1);
        barbershopRepository.save(b2);
        barbershopRepository.save(b3);

        userRepository.save(admin);
        userRepository.save(hairdresser1);
        userRepository.save(hairdresser2);
        userRepository.save(hairdresser3);
        userRepository.save(hairdresser4);
        userRepository.save(hairdresser5);
        userRepository.save(hairdresser6);
        //User[] hairdressers = {hairdresser1,hairdresser2,hairdresser3,hairdresser4,hairdresser5,hairdresser6}; 
        //this.busyToday(hairdressers);
        /* 
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime tomorrowStart = today.plusDays(1).withMinute(0).withSecond(0).withNano(0);
        appointmentRepository.save(new Appointment(Timestamp.valueOf(tomorrowStart.withHour(11)),Timestamp.valueOf(tomorrowStart.withHour(16)), "test",null,hairdresser2));
        appointmentRepository.save(new Appointment(Timestamp.valueOf(tomorrowStart.withHour(10)),Timestamp.valueOf(tomorrowStart.withHour(20)), "test",null,hairdresser1));
        */
        logger.info("ApplicationStartupRunner run method Started !!");
    }

    public void busyToday(User[] list){
        LocalDateTime today = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
        for (User user : list) {
            appointmentRepository.save(new Appointment(Timestamp.valueOf(today.withHour(10)),Timestamp.valueOf(today.withHour(20)), "test",null,user));
        }
    }
}
