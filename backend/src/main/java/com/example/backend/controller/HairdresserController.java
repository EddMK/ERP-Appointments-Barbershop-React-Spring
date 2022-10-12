package com.example.backend.controller;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.dto.AppointmentDto;
import com.example.backend.dto.NotificationDto;
import com.example.backend.email.BodyMail;
import com.example.backend.email.EmailServiceImpl;
import com.example.backend.email.FileMail;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.Availability;
import com.example.backend.repository.UserRepository;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.backend.entity.Appointment;
import com.example.backend.entity.User;
import com.example.backend.entity.Notification;
import com.example.backend.repository.AppointmentRepository;
//import com.example.backend.repository.BarbershopRepository;
import com.example.backend.repository.UserRepository;//NotificationRepository
import com.example.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
//import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.GregorianCalendar;
import java.util.Calendar;
import java.util.Locale;



@Controller 
@RequestMapping(path="/hairdresser") 
public class HairdresserController {
  
  @Autowired 
  private UserRepository userRepository;

  @Autowired 
  private AppointmentRepository appointmentRepository;

  @Autowired 
  private NotificationRepository notificationRepository;

  @Autowired 
	private EmailServiceImpl emailService;

  @CrossOrigin
  @GetMapping(path="/availibility/{id}")
  public @ResponseBody Availability getAvailability(@PathVariable Integer id) {
    User hairdresser = userRepository.findById(id).get();
    return hairdresser.getAvailability();
  }

  @CrossOrigin
  @GetMapping(path="/weekWorks/{timestamp}/{id}")
  public @ResponseBody List<Appointment> getAppointmentsWeek(@PathVariable long timestamp, @PathVariable int id ) {
    LocalDate localDate = Instant.ofEpochMilli(timestamp).atZone(ZoneId.systemDefault()).toLocalDate();
    LocalDate monday = localDate;
    while (monday.getDayOfWeek() != DayOfWeek.MONDAY)
    {
      monday = monday.minusDays(1);
    }
    LocalDate sunday = localDate;
    while (sunday.getDayOfWeek() != DayOfWeek.SUNDAY)
    {
      sunday = sunday.plusDays(1);
    }
    sunday = sunday.plusDays(1);
    return appointmentRepository.findWeeksSchedule(id, monday.toString(), sunday.toString());
  }

  @CrossOrigin
	@PostMapping(path="/addAbsence") // Map ONLY POST Requests
	public @ResponseBody ResponseEntity<Appointment> addAbsence (@RequestBody AppointmentDto appointment){
		System.out.println("ARRIVE !");
		Appointment a = new Appointment();
		a.setTitle(appointment.title);
		a.setStart(appointment.startDate);
		a.setEnd(appointment.endDate);
		a.setDuration(appointment.duration);
		a.setHairdresser(userRepository.findById(appointment.hairdresserId).get());
		a.setCustomer(null);
		Appointment newAppointment = appointmentRepository.save(a);
		return new ResponseEntity<>(newAppointment, HttpStatus.OK);
  	}

    @CrossOrigin
    @GetMapping(path="/daysoffBarbershop/{hairdresserId}")
    public @ResponseBody List<Appointment> getDaysoffByBarbershop(@PathVariable int hairdresserId ) {
      int barbershopId = userRepository.findById(hairdresserId).get().getBarbershop().getId();
      return appointmentRepository.findDaysoffByBarbershop(barbershopId, hairdresserId);
    }

    @CrossOrigin
    @DeleteMapping(path="/delete/{id}")
    public @ResponseBody String deleteAppointment(@PathVariable int id) throws IOException {
      //ENVOYER MAIL 
      //LE CLIENT SUPPRIMER ENVOYER UN MAIL ET UN EVENEMENT
      Appointment newAppointment = appointmentRepository.findById(id).get();
      String text = BodyMail.bodyAbsenceHairdresser(newAppointment);
      File obj = FileMail.fileDeleteAppointment(newAppointment);
      //CHANGER LE MAIL DU CLIENT
      String status = emailService.sendMailWithAttachment(newAppointment.getCustomer().getEmail(), text, "EdBarbershop - Reservation canceled", obj );
      appointmentRepository.deleteById(id);
      return "deleted - "+status;
    }

    @CrossOrigin
    @PostMapping(path="/notificateAbsence") // Map ONLY POST Requests
    public @ResponseBody String addNewNotification (@RequestBody NotificationDto notification){
      Notification n = new Notification();
      User customer = userRepository.findById(notification.receiver).get();
      n.setReceiver(userRepository.findById(notification.receiver).get());
      n.setSender(userRepository.findById(notification.sender).get());
      n.setMessage(notification.message);
      //CUSTOMER !!
      notificationRepository.save(n);
      //ENVOYER MAIL AU BNEDIM
      String text = BodyMail.notificateAbsenceHairdresser(notification.message);
      String status = emailService.sendSimpleMail(customer.getEmail(), text, "EdBarbershop - Notification");
      return "Saved "+status;
    }

    @CrossOrigin
    @PutMapping(path="/putDelay/{delay}") // Map ONLY POST Requests
    public @ResponseBody String putDelay (@RequestBody Appointment appointment, @PathVariable int delay) throws IOException{
      //IL RESTE A ENVOYER LE MAIL ET LE ICS + ESSAYER D AVOIR LES MINUTES POUR indiquer au type
      System.out.println(appointment.getId());
      Appointment oldAppointment = appointmentRepository.findById(appointment.getId()).get();
      oldAppointment.setEnd(appointment.getEnd());
      oldAppointment.setStart(appointment.getStart());
      oldAppointment.setSequence(appointment.getSequence()+1);
      appointmentRepository.save(oldAppointment);
      String text = BodyMail.bodyDelay(oldAppointment, delay);
      File obj = FileMail.fileRescheduleAppointment(oldAppointment);
      String status = emailService.sendMailWithAttachment(oldAppointment.getCustomer().getEmail(), text, "EdBarbershop - Reservation reschedule", obj );
      return "Updated "+status;
    }



    @CrossOrigin
    @PostMapping(path="/addDayOff") // Map ONLY POST Requests
    public @ResponseBody String addDayOff (@RequestBody Appointment appointment){
      LocalDate st = appointment.getStart().toLocalDateTime().toLocalDate();
      LocalDate ed = appointment.getEnd().toLocalDateTime().toLocalDate();
      int idHairdresser = 250;
      Optional<User> hairdresser  = userRepository.findById(idHairdresser);
      if(!st.isEqual(ed)){
        List<LocalDate> listes = st.datesUntil(ed).collect(Collectors.toList());
        listes.add(ed);
        for (LocalDate temp : listes) {
          Appointment a = new Appointment();
          a.setTitle("day off");
          a.setStart(Timestamp.valueOf(temp.atStartOfDay()));
          a.setEnd(Timestamp.valueOf(temp.atTime(23, 59)));
          a.setHairdresser(hairdresser.get());
          appointmentRepository.save(a);
        }
      }else{
        Appointment a = new Appointment();
        a.setTitle("day off");
        a.setStart(appointment.getStart());
        a.setEnd(appointment.getEnd());
        a.setHairdresser(hairdresser.get());
        appointmentRepository.save(a);
      }
      return "Saved";
    }

    @CrossOrigin
    @DeleteMapping(path="/absencecustomer/{appointmentId}") 
    public @ResponseBody String customerAbsence (@PathVariable Integer appointmentId){
      Appointment app = appointmentRepository.findById(appointmentId).get();
      //ajouter une absence au client
      User u = app.getCustomer();
      u.setAbsence(u.getAbsence()+1);
      userRepository.save(u);
      //envoyer une notification
      app.getStart();
      Timestamp ts = app.getStart();
      String day = (new SimpleDateFormat("EEEE", Locale.ENGLISH)).format(ts.getTime());
      String hour = (new SimpleDateFormat("HH:mm")).format(ts.getTime());
      String message = "You were not present for your appointment on "+day+" at "+hour+".";
      Notification n = new Notification(app.getHairdresser(),u, message);
      notificationRepository.save(n);
      //ENVOYER MAIL AU BNEDIM
      String text = BodyMail.notificateAbsenceCustomer(message);
      String status = emailService.sendSimpleMail( u.getEmail(), text, "EdBarbershop - Notification");
      //supprimer le rendez-vous
      appointmentRepository.deleteById(appointmentId);
      return "Deleted";
    }

}
