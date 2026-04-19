package com.telemedicine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TeleMedicineApplication {
    public static void main(String[] args) {
        SpringApplication.run(TeleMedicineApplication.class, args);
    }
}
