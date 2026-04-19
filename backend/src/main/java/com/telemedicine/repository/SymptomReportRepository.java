package com.telemedicine.repository;

import com.telemedicine.model.entity.SymptomReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SymptomReportRepository extends JpaRepository<SymptomReport, String> {
    List<SymptomReport> findByPatientIdOrderByCreatedAtDesc(String patientId);
    List<SymptomReport> findByStatus(SymptomReport.ReportStatus status);
}
