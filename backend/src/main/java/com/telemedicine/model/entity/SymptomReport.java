package com.telemedicine.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "symptom_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SymptomReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String symptomsText;

    private String predictedCondition;

    @Enumerated(EnumType.STRING)
    private SeverityLevel severityLevel;

    private Double confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String aiRecommendation;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum SeverityLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum ReportStatus {
        PENDING, PROCESSED, REVIEWED
    }
}
