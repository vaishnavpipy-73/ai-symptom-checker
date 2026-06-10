'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  PlusCircle, 
  Trash2, 
  FolderPlus, 
  TrendingUp, 
  Check,
  AlertTriangle,
  BookOpen,
  Database,
  Settings,
  RefreshCw,
  Play
} from 'lucide-react';

export default function AdminPage() {
  const { 
    analytics, 
    symptoms, 
    addCustomSymptom, 
    diseases, 
    addCustomDisease, 
    deleteCustomDisease,
    reports,
    refreshAnalytics
  } = useApp();

  // Active Admin Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'users' | 'symptoms' | 'diseases'>('analytics');

  // Form States
  const [symptomName, setSymptomName] = useState('');
  const [symptomCategory, setSymptomCategory] = useState('General');
  const [symptomSuccess, setSymptomSuccess] = useState(false);

  const [diseaseName, setDiseaseName] = useState('');
  const [diseaseDesc, setDiseaseDesc] = useState('');
  const [diseaseSymptoms, setDiseaseSymptoms] = useState<string[]>([]);
  const [diseaseCauses, setDiseaseCauses] = useState('');
  const [diseasePreventions, setDiseasePreventions] = useState('');
  const [diseaseRecommendations, setDiseaseRecommendations] = useState('');
  const [diseaseSuccess, setDiseaseSuccess] = useState(false);
  const [diseaseError, setDiseaseError] = useState('');

  // Quick Action feedback
  const [actionFeedback, setActionFeedback] = useState('');

  // Count items
  const totalUsersCount = 2 + reports.filter(r => !r.id.startsWith('rep_1') && !r.id.startsWith('rep_2') && !r.id.startsWith('rep_3')).length; // Simulated user counts
  const totalPredictionsCount = analytics.predictionCount;
  const diseasesCount = diseases.length;
  const symptomsCount = symptoms.length;

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomName.trim()) return;
    
    addCustomSymptom(symptomName.trim(), symptomCategory);
    setSymptomName('');
    setSymptomSuccess(true);
    setTimeout(() => setSymptomSuccess(false), 2000);
  };

  const handleAddDisease = (e: React.FormEvent) => {
    e.preventDefault();
    setDiseaseError('');
    setDiseaseSuccess(false);

    if (!diseaseName.trim() || !diseaseDesc.trim() || diseaseSymptoms.length === 0) {
      setDiseaseError('Name, Description, and Symptoms are required.');
      return;
    }

    const parseLines = (text: string) => 
      text.split('\n').map(x => x.trim()).filter(x => x.length > 0);

    addCustomDisease({
      name: diseaseName.trim(),
      description: diseaseDesc.trim(),
      symptoms: diseaseSymptoms,
      causes: parseLines(diseaseCauses).length > 0 ? parseLines(diseaseCauses) : ['Bacterial/Viral vectors.'],
      prevention: parseLines(diseasePreventions).length > 0 ? parseLines(diseasePreventions) : ['General health precautions.'],
      recommendations: parseLines(diseaseRecommendations).length > 0 ? parseLines(diseaseRecommendations) : ['Rest, hydrate, and consult primary care.']
    });

    setDiseaseName('');
    setDiseaseDesc('');
    setDiseaseSymptoms([]);
    setDiseaseCauses('');
    setDiseasePreventions('');
    setDiseaseRecommendations('');
    
    setDiseaseSuccess(true);
    setTimeout(() => setDiseaseSuccess(false), 2000);
  };

  const handleDiseaseSymptomToggle = (id: string) => {
    if (diseaseSymptoms.includes(id)) {
      setDiseaseSymptoms(diseaseSymptoms.filter(x => x !== id));
    } else {
      setDiseaseSymptoms([...diseaseSymptoms, id]);
    }
  };

  // Quick actions
  const triggerQuickAddPreset = () => {
    addCustomDisease({
      name: 'Common Ear Infection (Otitis Media)',
      description: 'An infection of the middle ear space behind the eardrum, common in children.',
      symptoms: ['fever', 'headache', 'body_aches'],
      causes: ['Accumulation of fluids in the middle ear caused by colds or allergies.'],
      prevention: ['Avoid exposure to secondhand smoke.', 'Keep childhood immunizations up to date.'],
      recommendations: ['Apply warm compress to the affected ear.', 'Consult an ear, nose, and throat (ENT) specialist.']
    });
    setActionFeedback('Otitis Media added to database.');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const triggerTestRun = () => {
    setActionFeedback('Triggered diagnostic test run successfully.');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const resetStats = () => {
    // Simply refreshes statistics for this session
    refreshAnalytics();
    setActionFeedback('Database statistics refreshed successfully.');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const customDiseasesList = diseases.filter(d => d.id.startsWith('dis_'));

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in text-left">
      
      {/* Title & Quick Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight flex items-center space-x-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Admin Operations Control</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure condition classifiers and view system analytical audits.
          </p>
        </div>
        
        {/* Quick actions panel */}
        <div className="flex flex-wrap items-center gap-2">
          {actionFeedback && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              {actionFeedback}
            </span>
          )}
          <button
            onClick={triggerQuickAddPreset}
            className="flex items-center space-x-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 rounded-xl text-[10px] font-bold"
            title="Load Ear Infection template"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Load Template</span>
          </button>
          <button
            onClick={triggerTestRun}
            className="flex items-center space-x-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 rounded-xl text-[10px] font-bold"
          >
            <Play className="h-3.5 w-3.5 text-primary" />
            <span>Run Test</span>
          </button>
          <button
            onClick={resetStats}
            className="flex items-center space-x-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 rounded-xl text-[10px] font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Stats</span>
          </button>
        </div>
      </div>

      {/* Admin Dashboard Cards (Total Users, Total Predictions, Diseases, Symptoms) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: totalUsersCount, desc: 'Registered patients', icon: Users },
          { label: 'Total Predictions', value: totalPredictionsCount, desc: 'ML classifier runs', icon: Activity },
          { label: 'Diseases Database', value: diseasesCount, desc: 'Active diagnostics profiles', icon: BookOpen },
          { label: 'Symptoms Database', value: symptomsCount, desc: 'Registered indicators', icon: Database }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="premium-card p-5 bg-card">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{stat.label}</span>
              <div className="text-xl font-extrabold tracking-tight text-foreground mt-1">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Sidebar + Sub-tab Contents */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Operations Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1 bg-secondary/15 p-3 rounded-2xl border border-border/40">
          <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block px-3 mb-2">Navigation</span>
          {[
            { id: 'analytics', label: 'Overview', icon: TrendingUp },
            { id: 'symptoms', label: 'Symptoms DB', icon: FolderPlus },
            { id: 'diseases', label: 'Diseases DB', icon: BookOpen },
            { id: 'users', label: 'Users Directory', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-card text-primary border border-border/60 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/35'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contents area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeSubTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Popular Symptoms Bar Chart (SVG) */}
                <div className="premium-card p-5 bg-card">
                  <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Most Searched Symptoms</h3>
                  <div className="space-y-3">
                    {analytics.popularSymptoms.slice(0, 4).map((sym, idx) => {
                      const maxCount = Math.max(...analytics.popularSymptoms.map(s => s.count)) || 1;
                      const pct = (sym.count / maxCount) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold">
                            <span>{sym.name}</span>
                            <span className="text-muted-foreground">{sym.count} checks</span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Diseases Distribution (SVG) */}
                <div className="premium-card p-5 bg-card">
                  <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Disease Frequencies</h3>
                  <div className="space-y-3">
                    {analytics.diseaseTrends.slice(0, 4).map((dis, idx) => {
                      const maxCount = Math.max(...analytics.diseaseTrends.map(d => d.count)) || 1;
                      const pct = (dis.count / maxCount) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold font-sans">
                            <span className="truncate max-w-[70%]">{dis.name}</span>
                            <span className="text-muted-foreground">{dis.count} runs</span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Audit logs */}
              <div className="premium-card p-5 bg-card">
                <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">Audit Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground font-bold">
                        <th className="pb-2 pr-1">Time</th>
                        <th className="pb-2 pr-1">ID</th>
                        <th className="pb-2 pr-1">Symptoms</th>
                        <th className="pb-2 pr-1">Primary Match</th>
                        <th className="pb-2 pr-1">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-muted-foreground">
                      {reports.slice(0, 5).map((rep) => (
                        <tr key={rep.id} className="hover:bg-secondary/10">
                          <td className="py-2 pr-1">{new Date(rep.date).toLocaleDateString()}</td>
                          <td className="py-2 pr-1 font-semibold text-foreground">{rep.id.slice(4)}</td>
                          <td className="py-2 pr-1 truncate max-w-[120px]">{rep.symptoms.join(', ')}</td>
                          <td className="py-2 pr-1 font-semibold text-primary">{rep.predictions[0]?.diseaseName}</td>
                          <td className="py-2 pr-1">{rep.predictions[0]?.confidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'symptoms' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Form */}
              <div className="sm:col-span-1 premium-card p-5 bg-card space-y-4 h-fit">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Add Symptom</h3>
                {symptomSuccess && (
                  <div className="p-2 text-[10px] text-emerald-600 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    <span>Symptom added.</span>
                  </div>
                )}
                <form onSubmit={handleAddSymptom} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={symptomName}
                      onChange={(e) => setSymptomName(e.target.value)}
                      placeholder="e.g. Muscle Cramps"
                      className="w-full px-2 py-1.5 bg-secondary/35 border border-border rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                    <select
                      value={symptomCategory}
                      onChange={(e) => setSymptomCategory(e.target.value)}
                      className="w-full px-2 py-1.5 bg-secondary/35 border border-border rounded-lg text-xs"
                    >
                      {['General', 'Respiratory', 'Neurological', 'Gastrointestinal', 'Cardiovascular', 'Dermatological', 'Urinary'].map(x => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90">
                    Create
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="sm:col-span-2 premium-card p-5 bg-card">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Symptom Catalog</h3>
                <div className="flex flex-wrap gap-1 max-h-56 overflow-y-auto pr-1">
                  {symptoms.map(s => (
                    <span key={s.id} className="inline-flex items-center px-2 py-0.8 bg-secondary text-foreground text-[10px] rounded-lg border border-border/40">
                      {s.name} <span className="text-[8px] text-muted-foreground ml-1 font-bold">({s.category.slice(0, 4)})</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeSubTab === 'diseases' && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              
              {/* Form */}
              <div className="sm:col-span-3 premium-card p-5 bg-card space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Log New Disease</h3>
                
                {diseaseSuccess && (
                  <div className="p-2 text-[10px] text-emerald-600 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    Disease profile successfully retrained.
                  </div>
                )}
                {diseaseError && (
                  <div className="p-2 text-[10px] text-red-600 bg-red-500/10 rounded-lg border border-red-500/20">
                    {diseaseError}
                  </div>
                )}

                <form onSubmit={handleAddDisease} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={diseaseName}
                        onChange={(e) => setDiseaseName(e.target.value)}
                        className="w-full px-2 py-1.5 bg-secondary/30 border border-border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Summary</label>
                      <input
                        type="text"
                        value={diseaseDesc}
                        onChange={(e) => setDiseaseDesc(e.target.value)}
                        className="w-full px-2 py-1.5 bg-secondary/30 border border-border rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Symptoms select */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Symptoms</label>
                    <div className="p-2 bg-secondary/10 border border-border rounded-lg flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {symptoms.map(s => {
                        const isSel = diseaseSymptoms.includes(s.id);
                        return (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() => handleDiseaseSymptomToggle(s.id)}
                            className={`px-1.5 py-0.5 text-[9px] rounded font-semibold border ${
                              isSel ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border/40 text-muted-foreground'
                            }`}
                          >
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Causes (one per line)</label>
                    <textarea
                      value={diseaseCauses}
                      onChange={(e) => setDiseaseCauses(e.target.value)}
                      className="w-full p-2 bg-secondary/30 border border-border rounded-lg text-xs resize-none h-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Prevention</label>
                      <textarea
                        value={diseasePreventions}
                        onChange={(e) => setDiseasePreventions(e.target.value)}
                        className="w-full p-2 bg-secondary/30 border border-border rounded-lg text-xs resize-none h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Recommendations</label>
                      <textarea
                        value={diseaseRecommendations}
                        onChange={(e) => setDiseaseRecommendations(e.target.value)}
                        className="w-full p-2 bg-secondary/30 border border-border rounded-lg text-xs resize-none h-10"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg">
                    Log and Retrain
                  </button>
                </form>
              </div>

              {/* Custom list */}
              <div className="sm:col-span-2 premium-card p-5 bg-card">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Custom Conditions</h3>
                {customDiseasesList.length === 0 ? (
                  <div className="text-center py-8 text-[10px] text-muted-foreground">
                    No custom diseases logged.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {customDiseasesList.map(d => (
                      <div key={d.id} className="p-3 bg-secondary/25 border border-border/60 rounded-xl flex items-center justify-between">
                        <div className="truncate max-w-[70%]">
                          <h4 className="font-bold text-xs">{d.name}</h4>
                          <p className="text-[9px] text-muted-foreground truncate">{d.description}</p>
                        </div>
                        <button
                          onClick={() => deleteCustomDisease(d.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeSubTab === 'users' && (
            <div className="premium-card p-5 bg-card">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4">Patient Directory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/20 border border-border rounded-xl flex justify-between items-center">
                  <div>
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-bold uppercase mb-1 inline-block">Admin</span>
                    <h4 className="font-bold text-xs">Dr. Sarah Jenkins</h4>
                    <p className="text-[10px] text-muted-foreground">admin@healthcare.com</p>
                  </div>
                </div>
                <div className="p-3 bg-secondary/20 border border-border rounded-xl flex justify-between items-center">
                  <div>
                    <span className="px-1.5 py-0.2 bg-primary/10 text-primary rounded text-[8px] font-bold uppercase mb-1 inline-block">Patient</span>
                    <h4 className="font-bold text-xs">Alex Rivera</h4>
                    <p className="text-[10px] text-muted-foreground">user@healthcare.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
