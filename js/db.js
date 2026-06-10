// Key Constants
const STORAGE_KEYS = {
  USERS: 'static_med_users',
  CURRENT_USER: 'static_med_current_user',
  REPORTS: 'static_med_reports',
  CUSTOM_DISEASES: 'static_med_custom_diseases',
  CUSTOM_SYMPTOMS: 'static_med_custom_symptoms',
  THEME: 'static_med_theme'
};

// Seed Data
const INITIAL_USERS = [
  { id: "usr_admin", name: "Dr. Sarah Jenkins", email: "admin@healthcare.com", role: "admin", createdAt: "2026-01-10T10:00:00Z" },
  { id: "usr_patient", name: "Alex Rivera", email: "user@healthcare.com", role: "user", createdAt: "2026-05-15T14:30:00Z" }
];

const INITIAL_REPORTS = [
  {
    id: "rep_1",
    userId: "usr_patient",
    date: "2026-06-01T09:15:00Z",
    symptoms: ["cough", "runny_nose", "sneezing", "sore_throat"],
    predictions: [
      { diseaseId: "common_cold", diseaseName: "Common Cold", confidence: 88.5, description: "A mild viral infection of the nose and throat.", recommendations: ["Stay warm and rest.", "Stay hydrated.", "Gargle with salt water."] },
      { diseaseId: "allergic_rhinitis", diseaseName: "Allergic Rhinitis (Allergies)", confidence: 8.2, description: "An allergic response causing itchy eyes and sneezing.", recommendations: ["Avoid allergen triggers.", "Use antihistamines."] }
    ],
    saved: true,
    notes: "Felt mild throat scratchiness starting yesterday morning."
  },
  {
    id: "rep_2",
    userId: "usr_patient",
    date: "2026-06-05T18:40:00Z",
    symptoms: ["acid_reflux", "abdominal_pain", "bloating"],
    predictions: [
      { diseaseId: "gerd", diseaseName: "GERD (Acid Reflux)", confidence: 91.2, description: "Stomach acid flowing back into the esophagus.", recommendations: ["Avoid spicy or greasy foods.", "Do not lie down right after eating."] },
      { diseaseId: "food_poisoning", diseaseName: "Food Poisoning", confidence: 6.4, description: "Gastrointestinal distress caused by contaminated food.", recommendations: ["Drink plenty of fluids.", "Eat bland foods."] }
    ],
    saved: true,
    notes: "Chest discomfort after eating a heavy meal."
  }
];

const db = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    }
  },

  // Auth
  login(email) {
    this.init();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return "User credentials not found.";
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  register(name, email) {
    this.init();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return "Email already registered.";
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: email.endsWith('@healthcare.com') ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  getUsers() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
  },

  // Metadata
  getSymptoms() {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SYMPTOMS) || '[]');
    return [...medicalDataset.symptoms, ...custom];
  },

  addSymptom(name, category) {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_SYMPTOMS) || '[]');
    const newSymptom = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: name.trim(),
      category
    };
    custom.push(newSymptom);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMPTOMS, JSON.stringify(custom));
    return newSymptom;
  },

  getDiseases() {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_DISEASES) || '[]');
    return [...medicalDataset.diseases, ...custom];
  },

  addDisease(disease) {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_DISEASES) || '[]');
    const newDisease = {
      ...disease,
      id: `dis_${Date.now()}`
    };
    custom.push(newDisease);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DISEASES, JSON.stringify(custom));
    return newDisease;
  },

  deleteDisease(id) {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_DISEASES) || '[]');
    const filtered = custom.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DISEASES, JSON.stringify(filtered));
    return filtered.length !== custom.length;
  },

  // Reports
  getReports() {
    this.init();
    const user = this.getCurrentUser();
    if (!user) return [];
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
    if (user.role === 'admin') return reports;
    return reports.filter(r => r.userId === user.id);
  },

  saveReport(symptoms, predictions, notes) {
    this.init();
    const user = this.getCurrentUser();
    if (!user) return null;
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
    const newReport = {
      id: `rep_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      symptoms,
      predictions,
      saved: true,
      notes: notes ? notes.trim() : ""
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  },

  toggleSaveReport(id) {
    this.init();
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
    const idx = reports.findIndex(r => r.id === id);
    if (idx === -1) return false;
    reports[idx].saved = !reports[idx].saved;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return true;
  },

  deleteReport(id) {
    this.init();
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
    return filtered.length !== reports.length;
  },

  // Stats
  getAnalytics() {
    this.init();
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
    const users = this.getUsers();
    const symptomsList = this.getSymptoms();

    const popular = {};
    reports.forEach(r => {
      r.symptoms.forEach(sId => {
        popular[sId] = (popular[sId] || 0) + 1;
      });
    });

    const popularSymptoms = Object.entries(popular).map(([id, count]) => {
      const sym = symptomsList.find(s => s.id === id);
      return { name: sym ? sym.name : id, count };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    const trends = {};
    reports.forEach(r => {
      if (r.predictions && r.predictions.length > 0) {
        const top = r.predictions[0].diseaseName;
        trends[top] = (trends[top] || 0) + 1;
      }
    });

    const diseaseTrends = Object.entries(trends).map(([name, count]) => ({
      name, count
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      predictionCount: reports.length + 1418, // Simulated baseline offset
      activeUsers: users.length + 343,
      popularSymptoms: popularSymptoms.length > 0 ? popularSymptoms : [{ name: "High Fever", count: 8 }, { name: "Persistent Cough", count: 7 }],
      diseaseTrends: diseaseTrends.length > 0 ? diseaseTrends : [{ name: "Influenza (Flu)", count: 5 }, { name: "Common Cold", count: 4 }]
    };
  }
};
