'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { generatePDFReport } from '@/lib/pdfGenerator';
import { 
  Search, 
  Stethoscope, 
  Trash2, 
  BrainCircuit, 
  Activity, 
  AlertTriangle, 
  FileDown, 
  Save, 
  Check, 
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function CheckerPage() {
  const { symptoms, saveNewReport, currentUser } = useApp();
  
  // States
  const [searchVal, setSearchVal] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedReportObj, setSavedReportObj] = useState<any | null>(null);

  const matchingSuggestions = symptoms.filter(s => 
    s.name.toLowerCase().includes(searchVal.toLowerCase()) && 
    !selectedIds.includes(s.id)
  );

  const symptomsByCategory = symptoms.reduce((acc, sym) => {
    if (!acc[sym.category]) {
      acc[sym.category] = [];
    }
    acc[sym.category].push(sym);
    return acc;
  }, {} as Record<string, typeof symptoms>);

  const toggleSymptom = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
    setPredictions(null);
    setIsSaved(false);
    setSavedReportObj(null);
  };

  const clearAll = () => {
    setSelectedIds([]);
    setPredictions(null);
    setIsSaved(false);
    setSavedReportObj(null);
    setSearchVal('');
    setNotes('');
  };

  const handlePredict = async () => {
    if (selectedIds.length === 0) return;
    
    setIsPredicting(true);
    setPredictions(null);
    setIsSaved(false);
    setSavedReportObj(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedIds })
      });
      const data = await response.json();
      
      setTimeout(() => {
        if (data.success) {
          setPredictions(data.predictions);
        }
        setIsPredicting(false);
      }, 800);
    } catch (err) {
      console.error('API call failed:', err);
      setIsPredicting(false);
    }
  };

  const handleSaveReport = async () => {
    if (!predictions || selectedIds.length === 0) return;
    const report = await saveNewReport(selectedIds, predictions, notes);
    if (report) {
      setIsSaved(true);
      setSavedReportObj(report);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Symptom Checker</h1>
        <p className="text-xs text-muted-foreground mt-1.5">
          Select multiple symptoms to run our mathematical classifier.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        
        {/* Input Selector Card (Left 3 Columns) */}
        <div className="md:col-span-3 space-y-6">
          <div className="premium-card p-6 bg-card">
            
            {/* Search Input & Suggestions */}
            <div className="relative mb-5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Type symptoms
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchVal}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="e.g. Cough, Fever, Nausea..."
                  className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs transition-all"
                />
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && searchVal && (
                <div className="absolute top-full left-0 w-full bg-card border border-border/80 mt-1.5 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-border/20">
                  {matchingSuggestions.length === 0 ? (
                    <div className="p-3 text-[11px] text-muted-foreground text-center">No symptoms matched</div>
                  ) : (
                    matchingSuggestions.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          toggleSymptom(s.id);
                          setSearchVal('');
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-secondary text-[11px] font-medium transition-colors"
                      >
                        {s.name} <span className="text-[9px] text-muted-foreground">({s.category})</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Chips Container */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Selected Symptoms ({selectedIds.length})
                </span>
                {selectedIds.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] text-red-500 hover:underline font-bold flex items-center space-x-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {selectedIds.length === 0 ? (
                <div className="text-center py-6 bg-secondary/25 rounded-xl text-[11px] text-muted-foreground border border-dashed border-border/40">
                  Search or click below to add symptoms.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 p-2 bg-secondary/15 rounded-xl border border-border/40 max-h-24 overflow-y-auto">
                  {selectedIds.map(id => {
                    const sym = symptoms.find(s => s.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-secondary text-foreground text-[11px] font-medium rounded-lg border border-border"
                      >
                        <span>{sym ? sym.name : id}</span>
                        <button
                          onClick={() => toggleSymptom(id)}
                          className="hover:bg-border/80 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Category selection */}
            <div className="pt-4 border-t border-border/30">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                Quick Catalog
              </span>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {Object.entries(symptomsByCategory).map(([category, list]) => (
                  <div key={category} className="space-y-1 text-left">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {list.map(s => {
                        const isSelected = selectedIds.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleSymptom(s.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                              isSelected
                                ? 'bg-primary/10 border-primary/40 text-primary'
                                : 'bg-card border-border/60 text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                            }`}
                          >
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            {selectedIds.length > 0 && !predictions && (
              <div className="mt-5 pt-4 border-t border-border/30 flex justify-end">
                <button
                  onClick={handlePredict}
                  disabled={isPredicting}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs shadow-sm hover:opacity-95 disabled:opacity-50"
                >
                  <BrainCircuit className="h-4 w-4" />
                  <span>{isPredicting ? 'Running...' : 'Run Diagnostics'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Skeleton Loaders (during prediction) */}
          {isPredicting && (
            <div className="premium-card p-6 bg-card space-y-4">
              <div className="h-4 w-1/3 skeleton rounded-md" />
              <div className="space-y-3">
                <div className="h-14 w-full skeleton rounded-xl" />
                <div className="h-14 w-full skeleton rounded-xl" />
                <div className="h-14 w-full skeleton rounded-xl" />
              </div>
            </div>
          )}
        </div>

        {/* Results Card (Right 2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          <div className="premium-card p-6 bg-card h-full flex flex-col justify-between min-h-[350px]">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Diagnostics Result</h2>
              
              {!predictions && !isPredicting && (
                <div className="text-center py-12 text-muted-foreground">
                  <Stethoscope className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[11px] font-medium">No diagnostic active.</p>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5 px-4">Select symptoms and execute run on the left.</p>
                </div>
              )}

              {predictions && (
                <div className="space-y-4">
                  {predictions.map((pred, index) => (
                    <div key={pred.diseaseId} className={`p-3.5 rounded-xl border ${
                      index === 0 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'border-border/60 bg-secondary/10'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-foreground">{pred.diseaseName}</span>
                        <span className="text-[10px] font-extrabold text-primary">{pred.confidence}% Match</span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-1.5">
                        <div
                          style={{ width: `${pred.confidence}%` }}
                          className="h-full bg-primary rounded-full transition-all duration-500"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-normal">{pred.description}</p>
                      
                      {index === 0 && (
                        <div className="mt-3 pt-2.5 border-t border-border/30">
                          <span className="text-[10px] font-bold text-foreground block mb-1">Advice Summary:</span>
                          <ul className="text-[9px] text-muted-foreground space-y-1 list-disc pl-3">
                            {pred.recommendations.slice(0, 2).map((rec: string, rIdx: number) => (
                              <li key={rIdx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Notes Area */}
                  <div className="space-y-1 mt-3">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Add Patient Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Type details (onset, triggers)..."
                      className="w-full p-2.5 bg-secondary/20 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-[11px] resize-none h-12"
                    />
                  </div>
                </div>
              )}
            </div>

            {predictions && (
              <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                {currentUser ? (
                  <button
                    onClick={handleSaveReport}
                    disabled={isSaved}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                      isSaved
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-primary text-white hover:opacity-90 shadow-sm'
                    }`}
                  >
                    {isSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                    <span>{isSaved ? 'Saved to Dashboard' : 'Save to Dashboard'}</span>
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="w-full py-2.5 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 rounded-xl font-bold text-xs flex items-center justify-center"
                  >
                    <span>Login to Save Report</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    const temp = savedReportObj || {
                      id: `rep_temp_${Date.now()}`,
                      date: new Date().toISOString(),
                      symptoms: selectedIds,
                      predictions: predictions,
                      saved: false,
                      notes: notes
                    };
                    generatePDFReport(temp, currentUser ? currentUser.name : 'Guest User', symptoms);
                  }}
                  className="w-full py-2.5 bg-secondary hover:bg-secondary/70 text-secondary-foreground border border-border rounded-xl font-bold text-xs flex items-center justify-center space-x-1"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  <span>Download Report PDF</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Advisory Notice */}
      <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start space-x-2.5 text-left max-w-2xl mx-auto shadow-sm">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-normal">
          <strong>Advisory:</strong> Predictions are generated based on mathematical frequency matches within a sample dataset and are not verified clinical diagnoses. Always consult a healthcare professional.
        </p>
      </div>

    </div>
  );
}
