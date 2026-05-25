package com.telemedicine.service;

import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.*;

@Service
public class SymptomContextService {

    // ─── Seasonal disease mapping ─────────────────────────────────────────────
    private static final Map<String, List<String>> SEASONAL_DISEASES = Map.of(
        "spring", List.of("Allergic rhinitis", "Allergic conjunctivitis", "Asthma flare-up", "Influenza", "Common cold"),
        "summer", List.of("Heat exhaustion", "Gastroenteritis", "Sunstroke", "Insect bite reaction", "Dehydration"),
        "autumn", List.of("Influenza", "Asthma", "Common cold", "Allergic rhinitis", "RSV"),
        "winter", List.of("Influenza", "Common cold", "RSV", "Norovirus", "Hypothermia risk")
    );

    // ─── Age-group symptom lists ──────────────────────────────────────────────
    private static final Map<String, Map<String, List<String>>> AGE_SYMPTOMS = Map.of(
        "child", Map.of(
            "weather", List.of("Runny nose", "Sneezing", "Watery eyes", "Skin rash", "Itchy throat"),
            "common",  List.of("Fever", "Cough", "Earache", "Stomach pain", "Vomiting", "Diarrhea", "Sore throat", "Fatigue", "Loss of appetite")
        ),
        "teen", Map.of(
            "weather", List.of("Sneezing", "Watery eyes", "Runny nose", "Itchy skin", "Nasal congestion"),
            "common",  List.of("Headache", "Fever", "Sore throat", "Fatigue", "Body aches", "Cough", "Dizziness", "Acne flare")
        ),
        "adult", Map.of(
            "weather", List.of("Sneezing", "Watery eyes", "Runny nose", "Itchy throat", "Nasal congestion", "Skin irritation"),
            "common",  List.of("Headache", "Fatigue", "Fever", "Cough", "Chest pain", "Back pain", "Anxiety", "Sleep issues")
        ),
        "midadult", Map.of(
            "weather", List.of("Runny nose", "Sneezing", "Watery eyes", "Nasal congestion", "Itchy skin"),
            "common",  List.of("Fatigue", "Joint pain", "Headache", "Shortness of breath", "Chest tightness", "Indigestion", "Back pain", "High blood pressure symptoms")
        ),
        "senior", Map.of(
            "weather", List.of("Runny nose", "Sneezing", "Watery eyes", "Nasal congestion"),
            "common",  List.of("Shortness of breath", "Chest pain", "Joint pain", "Dizziness", "Fatigue", "Memory issues", "Muscle weakness", "Balance problems")
        )
    );

    // ─── Symptom cascade map ──────────────────────────────────────────────────
    private static final Map<String, List<String>> CASCADE = Map.ofEntries(
        Map.entry("Fever",               List.of("Chills", "Body aches", "Night sweats", "Loss of appetite", "Headache", "Fatigue")),
        Map.entry("Cough",               List.of("Sore throat", "Chest tightness", "Shortness of breath", "Mucus/phlegm", "Hoarse voice")),
        Map.entry("Watery eyes",         List.of("Eye itching", "Eye redness", "Light sensitivity", "Eye swelling", "Blurred vision")),
        Map.entry("Sneezing",            List.of("Runny nose", "Nasal congestion", "Itchy nose", "Postnasal drip", "Loss of smell")),
        Map.entry("Headache",            List.of("Nausea", "Light sensitivity", "Neck stiffness", "Dizziness", "Visual disturbance")),
        Map.entry("Chest pain",          List.of("Shortness of breath", "Heart palpitations", "Arm pain", "Sweating", "Nausea")),
        Map.entry("Shortness of breath", List.of("Chest tightness", "Wheezing", "Cough", "Fatigue", "Dizziness")),
        Map.entry("Fatigue",             List.of("Muscle weakness", "Poor concentration", "Sleep issues", "Low mood", "Loss of appetite")),
        Map.entry("Stomach pain",        List.of("Nausea", "Vomiting", "Diarrhea", "Bloating", "Loss of appetite")),
        Map.entry("Joint pain",          List.of("Swelling", "Stiffness", "Redness around joint", "Reduced range of motion")),
        Map.entry("Skin rash",           List.of("Itching", "Redness", "Swelling", "Blistering", "Dry skin")),
        Map.entry("Dizziness",           List.of("Nausea", "Balance problems", "Ringing in ears", "Blurred vision", "Headache")),
        Map.entry("Sore throat",         List.of("Difficulty swallowing", "Swollen glands", "Hoarse voice", "Ear pain", "Fever")),
        Map.entry("Runny nose",          List.of("Sneezing", "Nasal congestion", "Postnasal drip", "Sore throat", "Loss of smell"))
    );

    public String getCurrentSeason() {
        int month = Month.from(java.time.LocalDate.now()).getValue();
        if (month >= 3 && month <= 5)  return "spring";
        if (month >= 6 && month <= 8)  return "summer";
        if (month >= 9 && month <= 11) return "autumn";
        return "winter";
    }

    public Map<String, Object> buildContext(String ageGroup, String city, double temp, String weatherDesc, String pollenLevel) {
        String season = getCurrentSeason();
        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("city", city);
        ctx.put("temperature", temp);
        ctx.put("weatherDescription", weatherDesc);
        ctx.put("pollenLevel", pollenLevel);
        ctx.put("season", season);
        ctx.put("trendingDiseases", SEASONAL_DISEASES.getOrDefault(season, List.of()));

        String group = resolveGroup(ageGroup);
        Map<String, List<String>> symptoms = AGE_SYMPTOMS.getOrDefault(group, AGE_SYMPTOMS.get("adult"));
        ctx.put("weatherSymptoms", symptoms.get("weather"));
        ctx.put("commonSymptoms",  symptoms.get("common"));
        return ctx;
    }

    public List<String> getCascade(String primarySymptom) {
        return CASCADE.getOrDefault(primarySymptom, List.of());
    }

    private String resolveGroup(String ageGroup) {
        if (ageGroup == null) return "adult";
        return switch (ageGroup.toLowerCase()) {
            case "child", "0-12"   -> "child";
            case "teen",  "13-17"  -> "teen";
            case "midadult","41-60"-> "midadult";
            case "senior", "61+"   -> "senior";
            default                -> "adult";
        };
    }
}
