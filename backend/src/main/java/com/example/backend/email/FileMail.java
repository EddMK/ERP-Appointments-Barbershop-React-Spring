package com.example.backend.email;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.io.FileWriter;
import com.example.backend.entity.Appointment;
import com.example.backend.entity.Barbershop;

public class FileMail {
    public static File fileAddAppointment(Appointment a) throws IOException{
            File myObj = new File("event.ics");
            FileWriter writer = new FileWriter(myObj);
            writer.write("BEGIN:VCALENDAR");
            writer.write(System.getProperty("line.separator"));
            writer.write("PRODID:-//EdBarbershop//iCal4j 1.0//EN");
            writer.write(System.getProperty("line.separator"));
            writer.write("VERSION:2.0");
            writer.write(System.getProperty("line.separator"));
            writer.write("BEGIN:VEVENT");
            writer.write(System.getProperty("line.separator"));
            Timestamp now = new Timestamp(System.currentTimeMillis());
            writer.write("DTSTAMP:"+(new SimpleDateFormat("yyyyMMdd")).format(now)+"T"+(new SimpleDateFormat("HHmmss")).format(now));//CREATION
            writer.write(System.getProperty("line.separator"));
            writer.write("DTSTART:"+(new SimpleDateFormat("yyyyMMdd")).format(a.getStart())+"T"+(new SimpleDateFormat("HHmmss")).format(a.getStart()));//DEBUT
            writer.write(System.getProperty("line.separator"));
            writer.write("DTEND:"+(new SimpleDateFormat("yyyyMMdd")).format(a.getEnd())+"T"+(new SimpleDateFormat("HHmmss")).format(a.getEnd()));//FIN
            writer.write(System.getProperty("line.separator"));
            writer.write("SUMMARY:"+a.getTitle()+" -EdBarbershop");//DESCRIPTION
            writer.write(System.getProperty("line.separator"));
            writer.write("UID:edbarbershop"+a.getId());//TROUVER ID
            writer.write(System.getProperty("line.separator"));
            writer.write("METHOD:REQUEST");
            writer.write(System.getProperty("line.separator"));
            writer.write("SEQUENCE:0");
            writer.write(System.getProperty("line.separator"));
            //CUSTOMER
            writer.write("ATTENDEE;ROLE=REQ-PARTICIPANT;CN="+a.getCustomer().getLastName()+" "+a.getCustomer().getFirstName()+":mailto:"+a.getCustomer().getEmail());
            writer.write(System.getProperty("line.separator"));
            //HAIRDRESSER
            writer.write("ORGANIZER;ROLE=REQ-PARTICIPANT;CN="+a.getHairdresser().getLastName()+" "+a.getHairdresser().getFirstName()+":mailto:"+a.getHairdresser().getEmail());
            writer.write(System.getProperty("line.separator"));
            Barbershop b = a.getHairdresser().getBarbershop();
            writer.write("LOCATION:"+b.getAddress());
            writer.write(System.getProperty("line.separator"));
            writer.write("END:VEVENT");
            writer.write(System.getProperty("line.separator"));
            writer.write("END:VCALENDAR");
            writer.close();
            return myObj;
    }

    public static File fileDeleteAppointment(Appointment a) throws IOException{
        File myObj = new File("event.ics");
        FileWriter writer = new FileWriter(myObj);
        writer.write("BEGIN:VCALENDAR");
        writer.write(System.getProperty("line.separator"));
        writer.write("PRODID:-//EdBarbershop//iCal4j 1.0//EN");
        writer.write(System.getProperty("line.separator"));
        writer.write("VERSION:2.0");
        writer.write(System.getProperty("line.separator"));
        writer.write("BEGIN:VEVENT");
        writer.write(System.getProperty("line.separator"));
        Timestamp now = new Timestamp(System.currentTimeMillis());
        writer.write("DTSTAMP:"+(new SimpleDateFormat("yyyyMMdd")).format(now)+"T"+(new SimpleDateFormat("HHmmss")).format(now));//CREATION
        writer.write(System.getProperty("line.separator"));
        writer.write("DTSTART:"+(new SimpleDateFormat("yyyyMMdd")).format(a.getStart())+"T"+(new SimpleDateFormat("HHmmss")).format(a.getStart()));//DEBUT
        writer.write(System.getProperty("line.separator"));
        writer.write("DTEND:"+(new SimpleDateFormat("yyyyMMdd")).format(a.getEnd())+"T"+(new SimpleDateFormat("HHmmss")).format(a.getEnd()));//FIN
        writer.write(System.getProperty("line.separator"));
        writer.write("SUMMARY:Cancel "+a.getTitle()+" -EdBarbershop");//DESCRIPTION
        writer.write(System.getProperty("line.separator"));
        writer.write("UID:edbarbershop"+a.getId());//TROUVER ID
        writer.write(System.getProperty("line.separator"));
        writer.write("METHOD:CANCEL");
        writer.write(System.getProperty("line.separator"));
        writer.write("STATUS:CANCELLED");
        writer.write(System.getProperty("line.separator"));
        writer.write("SEQUENCE:"+a.getSequence()+1);
        writer.write(System.getProperty("line.separator"));
        //CUSTOMER
        writer.write("ATTENDEE;ROLE=REQ-PARTICIPANT;CN="+a.getCustomer().getLastName()+" "+a.getCustomer().getFirstName()+":mailto:"+a.getCustomer().getEmail());
        writer.write(System.getProperty("line.separator"));
        //HAIRDRESSER
        writer.write("ORGANIZER;ROLE=REQ-PARTICIPANT;CN="+a.getHairdresser().getLastName()+" "+a.getHairdresser().getFirstName()+":mailto:"+a.getHairdresser().getEmail());
        writer.write(System.getProperty("line.separator"));
        Barbershop b = a.getHairdresser().getBarbershop();
        writer.write("LOCATION:"+b.getAddress());
        writer.write(System.getProperty("line.separator"));
        writer.write("END:VEVENT");
        writer.write(System.getProperty("line.separator"));
        writer.write("END:VCALENDAR");
        writer.close();
        return myObj;
    }

    public static File fileRescheduleAppointment(Appointment a) throws IOException{
        File myObj = new File("event.ics");
        FileWriter writer = new FileWriter(myObj);
        writer.write("BEGIN:VCALENDAR");
        writer.write(System.getProperty("line.separator"));
        writer.write("PRODID:-//EdBarbershop//iCal4j 1.0//EN");
        writer.write(System.getProperty("line.separator"));
        writer.write("VERSION:2.0");
        writer.write(System.getProperty("line.separator"));
        writer.write("BEGIN:VEVENT");
        writer.write(System.getProperty("line.separator"));
        Timestamp now = new Timestamp(System.currentTimeMillis());
        writer.write("DTSTAMP:"+(new SimpleDateFormat("yyyyMMdd")).format(now)+"T"+(new SimpleDateFormat("HHmmss")).format(now));//CREATION
        writer.write(System.getProperty("line.separator"));
        writer.write("DTSTART:"+(new SimpleDateFormat("yyyyMMdd")).format(a.getStart())+"T"+(new SimpleDateFormat("HHmmss")).format(a.getStart()));//DEBUT
        writer.write(System.getProperty("line.separator"));
        writer.write("DTEND:"+(new SimpleDateFormat("yyyyMMdd")).format(a.getEnd())+"T"+(new SimpleDateFormat("HHmmss")).format(a.getEnd()));//FIN
        writer.write(System.getProperty("line.separator"));
        writer.write("SUMMARY:Reschedule "+a.getTitle()+" -EdBarbershop");//DESCRIPTION
        writer.write(System.getProperty("line.separator"));
        writer.write("UID:edbarbershop"+a.getId());//TROUVER ID
        writer.write(System.getProperty("line.separator"));
        writer.write("METHOD:REQUEST");
        writer.write(System.getProperty("line.separator"));
        writer.write("SEQUENCE:"+a.getSequence());
        writer.write(System.getProperty("line.separator"));
        //CUSTOMER
        writer.write("ATTENDEE;ROLE=REQ-PARTICIPANT;CN="+a.getCustomer().getLastName()+" "+a.getCustomer().getFirstName()+":mailto:"+a.getCustomer().getEmail());
        writer.write(System.getProperty("line.separator"));
        //HAIRDRESSER
        writer.write("ORGANIZER;ROLE=REQ-PARTICIPANT;CN="+a.getHairdresser().getLastName()+" "+a.getHairdresser().getFirstName()+":mailto:"+a.getHairdresser().getEmail());
        writer.write(System.getProperty("line.separator"));
        Barbershop b = a.getHairdresser().getBarbershop();
        writer.write("LOCATION:"+b.getAddress());
        writer.write(System.getProperty("line.separator"));
        writer.write("END:VEVENT");
        writer.write(System.getProperty("line.separator"));
        writer.write("END:VCALENDAR");
        writer.close();
        return myObj;
    }
}
