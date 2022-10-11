package com.example.backend.email;

import java.io.File;
import java.io.IOException;
import java.io.FileWriter;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
 
// Annotation
@Service
// Class
// Implementing EmailService interface
public class EmailServiceImpl {
 
    @Autowired private JavaMailSender javaMailSender;
 
    @Value("${spring.mail.username}") private String sender;
 
    // Method 1
    // To send a simple email
    public String sendSimpleMail(String recipient, String body, String subject)//EmailDetails details
    {
 
        // Try block to check for exceptions
        try {
 
            // Creating a simple mail message
            SimpleMailMessage mailMessage = new SimpleMailMessage();
 
            // Setting up necessary details
            mailMessage.setFrom(sender);
            mailMessage.setTo(recipient);
            mailMessage.setText(body);
            mailMessage.setSubject(subject);

            System.out.println(mailMessage);
 
            // Sending the mail
            javaMailSender.send(mailMessage);
            return "Mail Sent Successfully...";
        }
 
        // Catch block to handle the exceptions
        catch (Exception e) {
            return "Error while Sending Mail";
        }
    }
 
    // Method 2
    // To send an email with attachment
    public String sendMailWithAttachment(String recipient, String body, String subject, File event) throws IOException {
        // Creating a mime message
        MimeMessage mimeMessage
            = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;
 
        try {
            mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(recipient);
            mimeMessageHelper.setText(body);
            mimeMessageHelper.setSubject( subject);
            // Adding the attachment
            FileSystemResource file = new FileSystemResource(event);//CREER UN CHEMIN
            mimeMessageHelper.addAttachment(file.getFilename(), file);
            // Sending the mail
            javaMailSender.send(mimeMessage);
            //DELETE FILE
            event.delete();
            return "Mail sent Successfully";
        }
 
        // Catch block to handle MessagingException
        catch (MessagingException e) {
 
            // Display message when exception occurred
            return "Error while sending mail!!!";
        }
    }
}