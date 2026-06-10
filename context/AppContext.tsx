'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PredictionReport, Disease, Symptom, DashboardStats } from '../types';
import { mockDb } from '../lib/mockDb';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User | null;
  loginUser: (email: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  reports: PredictionReport[];
  saveNewReport: (symptoms: string[], predictions: any[], notes?: string) => Promise<PredictionReport | null>;
  deleteReport: (id: string) => void;
  toggleSaveReport: (id: string) => void;
  symptoms: Symptom[];
  addCustomSymptom: (name: string, category: string) => void;
  diseases: Disease[];
  addCustomDisease: (disease: Omit<Disease, 'id'>) => void;
  deleteCustomDisease: (id: string) => void;
  analytics: DashboardStats;
  refreshAnalytics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<PredictionReport[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [analytics, setAnalytics] = useState<DashboardStats>({
    predictionCount: 0,
    activeUsers: 0,
    popularSymptoms: [],
    diseaseTrends: []
  });
  const [mounted, setMounted] = useState(false);

  // Initialize and load from local storage
  useEffect(() => {
    mockDb.init();
    
    // Load theme
    const savedTheme = localStorage.getItem('med_checker_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    // Load states
    setCurrentUser(mockDb.getCurrentUser());
    setReports(mockDb.getReports());
    setSymptoms(mockDb.getSymptoms());
    setDiseases(mockDb.getDiseases());
    setAnalytics(mockDb.getAnalytics());
    
    setMounted(true);
  }, []);

  // Sync state changes back to document classes
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('med_checker_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const loginUser = async (email: string) => {
    const result = mockDb.login(email);
    if (typeof result === 'string') {
      return { success: false, error: result };
    }
    setCurrentUser(result);
    // Reload reports for the newly logged-in user
    setReports(mockDb.getReports());
    refreshAnalytics();
    return { success: true };
  };

  const registerUser = async (name: string, email: string) => {
    const result = mockDb.register(name, email);
    if (typeof result === 'string') {
      return { success: false, error: result };
    }
    setCurrentUser(result);
    setReports(mockDb.getReports());
    refreshAnalytics();
    return { success: true };
  };

  const logoutUser = () => {
    mockDb.logout();
    setCurrentUser(null);
    setReports([]);
  };

  const saveNewReport = async (symptomsList: string[], predictions: any[], notes?: string) => {
    const report = mockDb.saveReport(symptomsList, predictions, notes);
    if (report) {
      setReports(mockDb.getReports());
      refreshAnalytics();
    }
    return report;
  };

  const deleteReport = (id: string) => {
    mockDb.deleteReport(id);
    setReports(mockDb.getReports());
    refreshAnalytics();
  };

  const toggleSaveReport = (id: string) => {
    mockDb.toggleSaveReport(id);
    setReports(mockDb.getReports());
  };

  const addCustomSymptom = (name: string, category: string) => {
    mockDb.addSymptom(name, category);
    setSymptoms(mockDb.getSymptoms());
    refreshAnalytics();
  };

  const addCustomDisease = (disease: Omit<Disease, 'id'>) => {
    mockDb.addDisease(disease);
    setDiseases(mockDb.getDiseases());
    refreshAnalytics();
  };

  const deleteCustomDisease = (id: string) => {
    mockDb.deleteDisease(id);
    setDiseases(mockDb.getDiseases());
    refreshAnalytics();
  };

  const refreshAnalytics = () => {
    setAnalytics(mockDb.getAnalytics());
  };

  // Prevent hydration flicker
  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        reports,
        saveNewReport,
        deleteReport,
        toggleSaveReport,
        symptoms,
        addCustomSymptom,
        diseases,
        addCustomDisease,
        deleteCustomDisease,
        analytics,
        refreshAnalytics
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
