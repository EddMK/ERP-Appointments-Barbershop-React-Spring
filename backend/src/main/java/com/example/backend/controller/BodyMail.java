package com.example.backend.controller;

import java.text.SimpleDateFormat;

import com.example.backend.entity.Appointment;
import com.example.backend.entity.Barbershop;

public class BodyMail {

    public static String bodyAddAppointment(Appointment a){
		String rep = "";
		rep += "Dear customer";
		rep += "\n";
		rep += "\n";
		rep += "Your appointment is confirmed successfully.";
		rep += "\n";
		rep += detailsAppointment(a);
		rep += "\n";
		rep += "\n";
        rep += "Please click attachment file in order to add the event to your calendar";
        rep += "\n";
		rep += "See you soon !";
		rep += "\n";
		rep += "EdBarbershop";
		return rep;
	}

    public static String bodyDeleteAppointment(Appointment a){
		String rep = "";
		rep += "Dear customer";
		rep += "\n";
		rep += "\n";
		rep += "Your appointment is cancelled.";
		rep += "\n";
		rep += detailsAppointment(a);
		rep += "\n";
		rep += "\n";
        rep += "Please click attachment file in order to take the event off your calendar";
        rep += "\n";
		rep += "See you soon !";
		rep += "\n";
		rep += "EdBarbershop";
		return rep;
	}

    public static String detailsAppointment(Appointment a){
        String rep="";
        rep += "Details :";
		rep += "\n";
		String day = (new SimpleDateFormat("EEEE")).format(a.getStart());
		String date = (new SimpleDateFormat("dd/MM/yyyy")).format(a.getStart());
		String from = (new SimpleDateFormat("HH:mm")).format(a.getStart());
		String to = (new SimpleDateFormat("HH:mm")).format(a.getEnd());
		rep += "-When ? "+day+" "+date+" from "+from+" to "+to;
		rep += "\n";
		rep += "-What ? "+a.getTitle();
		rep += "\n";
		Barbershop b = a.getHairdresser().getBarbershop();
		rep += "-Where ? "+b.getName()+", Adresse : "+b.getAddress();
		rep += "\n";
		rep += "-Who ? "+a.getHairdresser().getLastName()+" "+a.getHairdresser().getFirstName();
        return rep;
    }
    
}
