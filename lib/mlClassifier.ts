import dataset from '../data/dataset.json';
import { Disease, PredictionResult } from '../types';

// Naive Bayes Classifier Constants
const P_SYMPTOM_PRESENT_GIVEN_DISEASE = 0.85; // P(s=1 | d is associated)
const P_SYMPTOM_ABSENT_GIVEN_DISEASE = 0.15;  // P(s=0 | d is associated) = 1 - 0.85

const P_SYMPTOM_PRESENT_GIVEN_NOT_DISEASE = 0.05; // P(s=1 | d is not associated)
const P_SYMPTOM_ABSENT_GIVEN_NOT_DISEASE = 0.95;  // P(s=0 | d is not associated) = 1 - 0.05

/**
 * Predicts the most likely diseases based on a list of selected symptom IDs.
 * Uses a Naive Bayes formulation with log-probabilities to avoid floating-point underflow,
 * and normalizes the output using Softmax to produce realistic confidence percentages.
 */
export function predictDiseases(selectedSymptomIds: string[], customDiseases?: Disease[]): PredictionResult[] {
  // Merge pre-seeded diseases with any custom diseases from the simulated database
  const allDiseases: Disease[] = [...(dataset.diseases as Disease[]), ...(customDiseases || [])];
  
  if (selectedSymptomIds.length === 0 || allDiseases.length === 0) {
    return [];
  }

  // List of all unique symptom IDs in our system
  const allSymptomIds = dataset.symptoms.map(s => s.id);
  
  // Prior probability P(D) - assume uniform prior for simplicity
  const priorLog = Math.log(1 / allDiseases.length);
  
  // Compute log-likelihood score for each disease
  const diseaseLogScores = allDiseases.map(disease => {
    let logLikelihood = 0;
    
    // For each symptom in our system, check if it was selected or not
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
    
    // Posterior Score Log(P(D|S)) = Log(P(D)) + Log(P(S|D))
    const totalLogScore = priorLog + logLikelihood;
    
    return {
      disease,
      logScore: totalLogScore
    };
  });
  
  // To avoid underflow during exponential calculation, subtract the max logScore (Log-Sum-Exp trick)
  const maxLogScore = Math.max(...diseaseLogScores.map(d => d.logScore));
  
  // Compute raw exponentiated scores
  const expScores = diseaseLogScores.map(d => ({
    ...d,
    expScore: Math.exp(d.logScore - maxLogScore)
  }));
  
  // Sum of exponentiated scores for normalization
  const sumExpScores = expScores.reduce((sum, d) => sum + d.expScore, 0);
  
  // Calculate final confidence percentages
  const results: PredictionResult[] = expScores.map(d => {
    const confidence = sumExpScores > 0 ? (d.expScore / sumExpScores) * 100 : 0;
    
    return {
      diseaseId: d.disease.id,
      diseaseName: d.disease.name,
      confidence: Math.round(confidence * 10) / 10, // Round to 1 decimal place
      description: d.disease.description,
      recommendations: d.disease.recommendations
    };
  });
  
  // Sort by confidence descending and take the top 3
  const topPredictions = results
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  // If the top prediction has extremely low confidence, adjust it to represent uncertainty
  // e.g. if the user enters disjointed symptoms
  return topPredictions;
}
