package com.telemedicine.repository;

import com.telemedicine.model.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByPatientIdOrderByScheduledAtDesc(String patientId);
    List<Appointment> findByDoctorIdOrderByScheduledAtDesc(String doctorId);
    List<Appointment> findByDoctorIdAndScheduledAtBetween(String doctorId, LocalDateTime from, LocalDateTime to);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
}
