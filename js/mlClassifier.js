const P_SYMPTOM_PRESENT_GIVEN_DISEASE = 0.85;
const P_SYMPTOM_ABSENT_GIVEN_DISEASE = 0.15;

const P_SYMPTOM_PRESENT_GIVEN_NOT_DISEASE = 0.05;
const P_SYMPTOM_ABSENT_GIVEN_NOT_DISEASE = 0.95;

function predictDiseases(selectedSymptomIds, ageGroup = "adult", gender = "female", duration = "medium") {
  const allDiseases = db.getDiseases();
  const allSymptoms = db.getSymptoms();
  
  if (selectedSymptomIds.length === 0 || allDiseases.length === 0) {
    return [];
  }

  const allSymptomIds = allSymptoms.map(s => s.id);
  const uniformPriorLog = Math.log(1 / allDiseases.length);
  
  const diseaseLogScores = allDiseases.map(disease => {
    let logLikelihood = 0;
    
    // 1. Calculate symptom likelihoods
    allSymptomIds.forEach(symptomId => {
      const isSelected = selectedSymptomIds.includes(symptomId);
      const isAssociated = disease.symptoms.includes(symptomId);
      
      if (isSelected) {
        if (isAssociated) {
          logLikelihood += Math.log(P_SYMPTOM_PRESENT_GIVEN_DISEASE);
        } else {
          logLikelihood += Math.log(P_SYMPTOM_PRESENT_GIVEN_NOT_DISEASE);
        }
      } else {
        if (isAssociated) {
          logLikelihood += Math.log(P_SYMPTOM_ABSENT_GIVEN_DISEASE);
        } else {
          logLikelihood += Math.log(P_SYMPTOM_ABSENT_GIVEN_NOT_DISEASE);
        }
      }
    });

    // 2. Adjust prior probability based on clinical risk factors P(D)
    let priorAdjustment = 0;
    
    if (ageGroup === "child") {
      // Children get higher flu/cold priors
      if (disease.id === "influenza" || disease.id === "common_cold") {
        priorAdjustment += 0.8;
      }
    } else if (ageGroup === "senior") {
      // Seniors get higher chronic diabetes/hypertension priors
      if (disease.id === "diabetes" || disease.id === "hypertension" || disease.id === "sleep_apnea") {
        priorAdjustment += 0.9;
      }
      if (disease.id === "gerd") {
        priorAdjustment += 0.4;
      }
    }

    if (gender === "female") {
      // Migraines statistically show higher female frequency
      if (disease.id === "migraine") {
        priorAdjustment += 0.4;
      }
    }

    if (duration === "long") {
      // Long duration makes chronic diseases far more likely and acute infections less likely
      const isChronic = ["diabetes", "hypertension", "gerd", "asthma", "sleep_apnea", "anxiety_disorder"].includes(disease.id);
      if (isChronic) {
        priorAdjustment += 0.7;
      } else {
        priorAdjustment -= 0.8; // Suppress colds/flu
      }
    } else if (duration === "short") {
      // Short duration makes food poisoning/cold more likely than diabetes/hypertension
      if (disease.id === "food_poisoning" || disease.id === "gastroenteritis" || disease.id === "common_cold") {
        priorAdjustment += 0.6;
      }
      if (disease.id === "diabetes" || disease.id === "hypertension") {
        priorAdjustment -= 0.8;
      }
    }

    const priorLog = uniformPriorLog + priorAdjustment;
    const totalLogScore = priorLog + logLikelihood;

    // Track matching symptoms for mathematical audit
    const matchedSymptoms = selectedSymptomIds.filter(sId => disease.symptoms.includes(sId));
    const missedSymptoms = disease.symptoms.filter(sId => !selectedSymptomIds.includes(sId));

    return {
      disease,
      logScore: totalLogScore,
      priorLog,
      logLikelihood,
      matchedSymptoms,
      missedSymptoms
    };
  });
  
  // Log-sum-exp trick to avoid underflow
  const maxLogScore = Math.max(...diseaseLogScores.map(d => d.logScore));
  
  const expScores = diseaseLogScores.map(d => ({
    ...d,
    expScore: Math.exp(d.logScore - maxLogScore)
  }));
  
  const sumExpScores = expScores.reduce((sum, d) => sum + d.expScore, 0);
  
  const results = expScores.map(d => {
    const confidence = sumExpScores > 0 ? (d.expScore / sumExpScores) * 100 : 0;
    return {
      diseaseId: d.disease.id,
      diseaseName: d.disease.name,
      confidence: Math.round(confidence * 10) / 10,
      description: d.disease.description,
      recommendations: d.disease.recommendations,
      // Audit trail logs
      audit: {
        priorLog: Math.round(d.priorLog * 100) / 100,
        likelihoodLog: Math.round(d.logLikelihood * 100) / 100,
        scoreLog: Math.round(d.logScore * 100) / 100,
        matched: d.matchedSymptoms,
        missed: d.missedSymptoms
      }
    };
  });
  
  return results
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

function calculateTriageUrgency(selectedSymptomIds) {
  // Red (Emergency)
  const redSymptomIds = ["chest_pain", "shortness_of_breath", "stiff_neck"];
  // Orange (Urgent)
  const orangeSymptomIds = ["fever", "dizziness", "abdominal_pain"];
  // Yellow (Primary Care / Telehealth)
  const yellowSymptomIds = [
    "cough", "nausea", "diarrhea", "acid_reflux", "frequent_urination", 
    "excessive_thirst", "wheezing", "chills", "sweating", "anxiety", 
    "insomnia", "weight_loss", "bloating", "constipation"
  ];

  const hasRed = selectedSymptomIds.some(id => redSymptomIds.includes(id));
  const hasOrange = selectedSymptomIds.some(id => orangeSymptomIds.includes(id));
  const hasYellow = selectedSymptomIds.some(id => yellowSymptomIds.includes(id));

  if (hasRed) {
    return {
      level: "red",
      label: "Emergency",
      colorClass: "triage-glow-red",
      badgeColor: "#ef4444",
      description: "Severe or potentially life-threatening indicators detected. Please seek emergency medical care immediately."
    };
  } else if (hasOrange) {
    return {
      level: "orange",
      label: "Urgent Care",
      colorClass: "triage-glow-orange",
      badgeColor: "#f59e0b",
      description: "Moderate to high severity indicators detected. We recommend visiting an urgent care facility or primary physician today."
    };
  } else if (hasYellow) {
    return {
      level: "yellow",
      label: "Telehealth / Clinic",
      colorClass: "triage-glow-yellow",
      badgeColor: "#3b82f6",
      description: "Mild, persistent indicators detected. Schedule a routine doctor consult or consult a telehealth provider."
    };
  } else {
    return {
      level: "green",
      label: "Self-Care",
      colorClass: "triage-glow-green",
      badgeColor: "#10b981",
      description: "Common, mild indicators detected. Rest, hydrate, and monitor your symptoms. Use OTC remedies as directed."
    };
  }
}

