export interface Symptom {
  id: string;
  name: string;
  category: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[]; // Array of symptom IDs
  causes: string[];
  prevention: string[];
  recommendations: string[];
}

export interface PredictionResult {
  diseaseId: string;
  diseaseName: string;
  confidence: number; // percentage (0 - 100)
  description: string;
  recommendations: string[];
}

export interface PredictionReport {
  id: string;
  date: string;
  symptoms: string[]; // Array of symptom IDs
  predictions: PredictionResult[];
  saved: boolean;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface UserSession {
  user: User | null;
  token: string | null;
}

export interface DashboardStats {
  predictionCount: number;
  activeUsers: number;
  popularSymptoms: { name: string; count: number }[];
  diseaseTrends: { name: string; count: number }[];
}
