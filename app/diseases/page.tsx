'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, BookOpen, ShieldCheck, Heart, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DiseasesPage() {
  const { diseases, symptoms } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getCategory = (dId: string) => {
    const disease = diseases.find(d => d.id === dId);
    if (!disease || disease.symptoms.length === 0) return 'General';
    const firstSym = symptoms.find(s => s.id === disease.symptoms[0]);
    return firstSym ? firstSym.category : 'General';
  };

  const categories = ['All', 'Respiratory', 'Neurological', 'Gastrointestinal', 'General', 'Cardiovascular', 'Urinary'];

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = 
      disease.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      disease.description.toLowerCase().includes(searchVal.toLowerCase()) ||
      disease.symptoms.some(sId => {
        const sym = symptoms.find(s => s.id === sId);
        return sym?.name.toLowerCase().includes(searchVal.toLowerCase());
      });

    if (activeCategory === 'All') {
      return matchesSearch;
    }
    return matchesSearch && getCategory(disease.id) === activeCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Disease Library</h1>
        <p className="text-xs text-muted-foreground mt-1.5">
          Browse clinical summaries, etiology, preventions, and precautions.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by name, symptom..."
              className="w-full pl-9 pr-4 py-2.5 bg-secondary/35 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs transition-all"
            />
          </div>
        </div>

        {/* Categories list */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white'
                  : 'bg-secondary/30 border-border/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Database Listing */}
      {filteredDiseases.length === 0 ? (
        <div className="text-center py-12 premium-card bg-card">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-bold text-xs text-foreground">No matches found</h3>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5">Adjust inputs or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredDiseases.map((disease) => {
            const isExpanded = expandedId === disease.id;
            const category = getCategory(disease.id);

            return (
              <div 
                key={disease.id} 
                className={`premium-card bg-card overflow-hidden flex flex-col justify-between ${
                  isExpanded ? 'border-primary/40' : 'border-border/30'
                }`}
              >
                
                <div className="p-5 text-left">
                  <span className="inline-block px-2 py-0.2 bg-secondary text-primary rounded text-[8px] font-bold uppercase tracking-wider mb-2">
                    {category}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{disease.name}</h3>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-1.5">{disease.description}</p>
                </div>

                {/* Collapsed articles summary */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-border/30 bg-secondary/10 text-left space-y-3 animate-fade-in">
                    
                    {/* Symptoms */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Symptoms</span>
                      <div className="flex flex-wrap gap-1">
                        {disease.symptoms.map(sId => (
                          <span key={sId} className="px-1.5 py-0.2 bg-secondary text-foreground rounded text-[9px] font-semibold">
                            {symptoms.find(s => s.id === sId)?.name || sId}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Causes */}
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Causes</span>
                      <ul className="text-[10px] text-muted-foreground space-y-0.5 list-disc pl-3">
                        {disease.causes.map((cause, idx) => (
                          <li key={idx}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center text-emerald-600">
                        <ShieldCheck className="h-3 w-3 mr-0.5" />
                        <span>Prevention</span>
                      </span>
                      <ul className="text-[10px] text-muted-foreground space-y-0.5 list-disc pl-3">
                        {disease.prevention.map((prev, idx) => (
                          <li key={idx}>{prev}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center text-teal-600">
                        <Heart className="h-3 w-3 mr-0.5" />
                        <span>Self Care Care</span>
                      </span>
                      <ul className="text-[10px] text-muted-foreground space-y-0.5 list-disc pl-3">
                        {disease.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

                <div className="px-5 py-3 border-t border-border/30 bg-secondary/5 flex justify-between items-center text-left">
                  <span className="text-[10px] text-muted-foreground">
                    {isExpanded ? 'Collapse report info' : 'Read details'}
                  </span>
                  <button
                    onClick={() => toggleExpand(disease.id)}
                    className="p-1 hover:bg-secondary rounded-lg"
                  >
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* disclaimer footer */}
      <div className="mt-8 p-4 bg-secondary/20 border border-border/40 rounded-2xl text-left max-w-2xl mx-auto flex items-start space-x-2.5">
        <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-normal">
          <strong>Catalog Advisory:</strong> Content provided here represents generic guidelines. It serves cataloging purposes and is not formatted for self-diagnosis of acute illnesses. Seek a primary care consultation in case of medical distress.
        </p>
      </div>

    </div>
  );
}
