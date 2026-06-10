import { User, PredictionReport, Disease, Symptom, DashboardStats } from '../types';
import dataset from '../data/dataset.json';

// Keys for LocalStorage
const KEYS = {
  USERS: 'med_checker_users',
  CURRENT_USER: 'med_checker_current_user',
  REPORTS: 'med_checker_reports',
  CUSTOM_DISEASES: 'med_checker_custom_diseases',
  CUSTOM_SYMPTOMS: 'med_checker_custom_symptoms'
};

// Default Users pre-populated
const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@healthcare.com',
    role: 'admin',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'usr_1',
    name: 'Alex Rivera',
    email: 'user@healthcare.com',
    role: 'user',
    createdAt: '2026-05-15T14:30:00.000Z'
  }
];

// Default historical reports pre-populated for Alex Rivera (usr_1)
const DEFAULT_REPORTS: (PredictionReport & { userId: string })[] = [
  {
    id: 'rep_1',
    userId: 'usr_1',
    date: '2026-06-01T09:15:00.000Z',
    symptoms: ['cough', 'runny_nose', 'sneezing', 'sore_throat'],
    predictions: [
      {
        diseaseId: 'common_cold',
        diseaseName: 'Common Cold',
        confidence: 88.5,
        description: 'A mild viral infection of the nose and throat.',
        recommendations: ['Stay warm and rest.', 'Stay hydrated.', 'Gargle with warm salt water.']
      },
      {
        diseaseId: 'allergic_rhinitis',
        diseaseName: 'Allergic Rhinitis (Allergies)',
        confidence: 8.2,
        description: 'An allergic response causing itchy eyes and sneezing.',
        recommendations: ['Avoid allergen triggers.', 'Use antihistamines.']
      },
      {
        diseaseId: 'influenza',
        diseaseName: 'Influenza (Flu)',
        confidence: 3.3,
        description: 'A contagious viral respiratory infection.',
        recommendations: ['Get plenty of rest.', 'Drink fluids.']
      }
    ],
    saved: true,
    notes: 'Started feeling congestion yesterday morning. Mild sore throat.'
  },
  {
    id: 'rep_2',
    userId: 'usr_1',
    date: '2026-06-05T18:40:00.000Z',
    symptoms: ['acid_reflux', 'abdominal_pain', 'bloating'],
    predictions: [
      {
        diseaseId: 'gerd',
        diseaseName: 'GERD (Acid Reflux)',
        confidence: 91.2,
        description: 'Stomach acid frequently flowing back into the esophagus.',
        recommendations: ['Avoid spicy, fatty foods.', 'Do not lie down right after eating.', 'Eat smaller meals.']
      },
      {
        diseaseId: 'food_poisoning',
        diseaseName: 'Food Poisoning',
        confidence: 6.4,
        description: 'Illness caused by eating contaminated food.',
        recommendations: ['Drink fluids.', 'Follow BRAT diet.']
      },
      {
        diseaseId: 'gastroenteritis',
        diseaseName: 'Gastroenteritis (Stomach Flu)',
        confidence: 2.4,
        description: 'Inflammation of stomach and intestines.',
        recommendations: ['Hydration is key.']
      }
    ],
    saved: true,
    notes: 'Felt burning sensation in chest after eating a greasy dinner.'
  },
  {
    id: 'rep_3',
    userId: 'usr_admin',
    date: '2026-06-08T11:20:00.000Z',
    symptoms: ['fever', 'cough', 'fatigue', 'body_aches', 'chills'],
    predictions: [
      {
        diseaseId: 'influenza',
        diseaseName: 'Influenza (Flu)',
        confidence: 76.4,
        description: 'A highly contagious viral infection that attacks the respiratory system.',
        recommendations: ['Rest, stay hydrated, monitor temperature.']
      },
      {
        diseaseId: 'covid_19',
        diseaseName: 'COVID-19',
        confidence: 21.8,
        description: 'Infectious respiratory illness caused by SARS-CoV-2.',
        recommendations: ['Self-isolate and monitor blood oxygen.']
      },
      {
        diseaseId: 'bronchitis',
        diseaseName: 'Acute Bronchitis',
        confidence: 1.8,
        description: 'Inflammation of bronchial tubes.',
        recommendations: ['Steam inhalation.']
      }
    ],
    saved: false
  }
];

// Safe Storage getter
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key:', key, error);
    return defaultValue;
  }
}

// Safe Storage setter
function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key:', key, error);
  }
}

export const mockDb = {
  // Initialize Database with pre-seeded values
  init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(KEYS.USERS)) {
      setItem(KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(KEYS.REPORTS)) {
      setItem(KEYS.REPORTS, DEFAULT_REPORTS);
    }
  },

  // Auth Operations
  register(name: string, email: string): User | string {
    this.init();
    const users = getItem<User[]>(KEYS.USERS, DEFAULT_USERS);
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return 'Email already registered';
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: email.endsWith('@healthcare.com') ? 'admin' : 'user', // Smart assignment
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setItem(KEYS.USERS, users);
    setItem(KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  login(email: string): User | string {
    this.init();
    const users = getItem<User[]>(KEYS.USERS, DEFAULT_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return 'User not found. Please register.';
    }

    setItem(KEYS.CURRENT_USER, user);
    return user;
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser(): User | null {
    return getItem<User | null>(KEYS.CURRENT_USER, null);
  },

  getUsers(): User[] {
    this.init();
    return getItem<User[]>(KEYS.USERS, DEFAULT_USERS);
  },

  // Disease & Symptom Operations (Admin Customization)
  getSymptoms(): Symptom[] {
    const customSymptoms = getItem<Symptom[]>(KEYS.CUSTOM_SYMPTOMS, []);
    return [...dataset.symptoms, ...customSymptoms];
  },

  addSymptom(name: string, category: string): Symptom {
    const customSymptoms = getItem<Symptom[]>(KEYS.CUSTOM_SYMPTOMS, []);
    const newSymptom: Symptom = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name,
      category
    };
    customSymptoms.push(newSymptom);
    setItem(KEYS.CUSTOM_SYMPTOMS, customSymptoms);
    return newSymptom;
  },

  getDiseases(): Disease[] {
    const customDiseases = getItem<Disease[]>(KEYS.CUSTOM_DISEASES, []);
    return [...(dataset.diseases as Disease[]), ...customDiseases];
  },

  addDisease(disease: Omit<Disease, 'id'>): Disease {
    const customDiseases = getItem<Disease[]>(KEYS.CUSTOM_DISEASES, []);
    const newDisease: Disease = {
      ...disease,
      id: `dis_${Date.now()}`
    };
    customDiseases.push(newDisease);
    setItem(KEYS.CUSTOM_DISEASES, customDiseases);
    return newDisease;
  },

  deleteDisease(id: string): boolean {
    const customDiseases = getItem<Disease[]>(KEYS.CUSTOM_DISEASES, []);
    const filtered = customDiseases.filter(d => d.id !== id);
    if (filtered.length === customDiseases.length) {
      // It might be a static disease, which cannot be deleted from static file, but let's allow hiding
      return false;
    }
    setItem(KEYS.CUSTOM_DISEASES, filtered);
    return true;
  },

  // Report Operations
  getReports(): PredictionReport[] {
    this.init();
    const user = this.getCurrentUser();
    if (!user) return [];
    
    const allReports = getItem<(PredictionReport & { userId: string })[]>(KEYS.REPORTS, DEFAULT_REPORTS);
    
    // Admins see all reports, standard users see only their own
    if (user.role === 'admin') {
      return allReports;
    }
    return allReports.filter(r => r.userId === user.id);
  },

  saveReport(symptoms: string[], predictions: any[], notes?: string): PredictionReport | null {
    this.init();
    const user = this.getCurrentUser();
    if (!user) return null;

    const allReports = getItem<(PredictionReport & { userId: string })[]>(KEYS.REPORTS, DEFAULT_REPORTS);
    
    const newReport: PredictionReport & { userId: string } = {
      id: `rep_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      symptoms,
      predictions,
      saved: true,
      notes
    };

    allReports.unshift(newReport); // Add to beginning
    setItem(KEYS.REPORTS, allReports);
    return newReport;
  },

  toggleSaveReport(id: string): boolean {
    this.init();
    const allReports = getItem<(PredictionReport & { userId: string })[]>(KEYS.REPORTS, DEFAULT_REPORTS);
    const reportIndex = allReports.findIndex(r => r.id === id);
    
    if (reportIndex === -1) return false;
    
    allReports[reportIndex].saved = !allReports[reportIndex].saved;
    setItem(KEYS.REPORTS, allReports);
    return true;
  },

  deleteReport(id: string): boolean {
    this.init();
    const allReports = getItem<(PredictionReport & { userId: string })[]>(KEYS.REPORTS, DEFAULT_REPORTS);
    const filtered = allReports.filter(r => r.id !== id);
    if (filtered.length === allReports.length) return false;
    setItem(KEYS.REPORTS, filtered);
    return true;
  },

  // Analytics Operations
  getAnalytics(): DashboardStats {
    this.init();
    const allReports = getItem<(PredictionReport & { userId: string })[]>(KEYS.REPORTS, DEFAULT_REPORTS);
    const users = getItem<User[]>(KEYS.USERS, DEFAULT_USERS);
    const symptomsList = this.getSymptoms();

    // 1. Total Prediction Count
    const predictionCount = allReports.length;

    // 2. Count Active Users
    const activeUsers = users.length;

    // 3. Most Searched Symptoms
    const symptomCounts: Record<string, number> = {};
    allReports.forEach(r => {
      r.symptoms.forEach(sId => {
        symptomCounts[sId] = (symptomCounts[sId] || 0) + 1;
      });
    });

    const popularSymptoms = Object.entries(symptomCounts)
      .map(([id, count]) => {
        const sym = symptomsList.find(s => s.id === id);
        return {
          name: sym ? sym.name : id,
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Disease Trends
    const diseaseCounts: Record<string, number> = {};
    allReports.forEach(r => {
      if (r.predictions && r.predictions.length > 0) {
        const topDisease = r.predictions[0].diseaseName;
        diseaseCounts[topDisease] = (diseaseCounts[topDisease] || 0) + 1;
      }
    });

    const diseaseTrends = Object.entries(diseaseCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      predictionCount,
      activeUsers,
      popularSymptoms: popularSymptoms.length > 0 ? popularSymptoms : [{ name: 'Cough', count: 12 }, { name: 'Fever', count: 9 }, { name: 'Fatigue', count: 8 }],
      diseaseTrends: diseaseTrends.length > 0 ? diseaseTrends : [{ name: 'Common Cold', count: 8 }, { name: 'GERD', count: 5 }, { name: 'Influenza', count: 4 }]
    };
  }
};
