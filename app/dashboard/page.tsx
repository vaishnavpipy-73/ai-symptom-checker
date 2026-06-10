'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { generatePDFReport } from '@/lib/pdfGenerator';
import { 
  FileText, 
  Trash2, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  Eye, 
  Search, 
  Activity, 
  User as UserIcon, 
  PlusCircle, 
  AlertCircle,
  FileDown
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    currentUser, 
    reports, 
    deleteReport, 
    toggleSaveReport, 
    symptoms 
  } = useApp();
  
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalReports = reports.length;
  const savedReports = reports.filter(r => r.saved).length;
  const uniqueSymptomsChecked = Array.from(
    new Set(reports.flatMap(r => r.symptoms))
  ).length;

  const topPrediction = reports.length > 0 && reports[0].predictions.length > 0 
    ? reports[0].predictions[0] 
    : null;

  // Filter reports
  const filteredReports = reports.filter(report => {
    const symptomNames = report.symptoms
      .map(id => symptoms.find(s => s.id === id)?.name || id)
      .join(' ')
      .toLowerCase();
    
    const diseaseNames = report.predictions
      .map(p => p.diseaseName)
      .join(' ')
      .toLowerCase();
      
    const matchesSearch = symptomNames.includes(searchQuery.toLowerCase()) || 
                          diseaseNames.includes(searchQuery.toLowerCase()) ||
                          (report.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterSavedOnly) {
      return matchesSearch && report.saved;
    }
    return matchesSearch;
  });

  // Dynamic SVG Charting
  const diseaseTrendData = () => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      if (r.predictions.length > 0) {
        const dName = r.predictions[0].diseaseName;
        counts[dName] = (counts[dName] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  };

  const trends = diseaseTrendData();
  const maxTrendVal = trends.length > 0 ? Math.max(...trends.map(t => t.value)) : 1;

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview for <span className="text-foreground font-semibold">{currentUser.name}</span>. Review diagnostic runs.
          </p>
        </div>
        <div>
          <button
            onClick={() => router.push('/checker')}
            className="flex items-center space-x-1 px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-sm hover:opacity-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Symptom Check</span>
          </button>
        </div>
      </div>

      {/* Analytics Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Assessments', value: totalReports, desc: 'Total checks' },
          { label: 'Saved Reports', value: savedReports, desc: 'Bookmarked logs' },
          { label: 'Symptoms Logged', value: uniqueSymptomsChecked, desc: 'Unique indicators' },
          { label: 'Primary Match', value: topPrediction ? topPrediction.diseaseName : 'N/A', desc: topPrediction ? `${topPrediction.confidence}% confidence` : 'No checks run' }
        ].map((stat, idx) => (
          <div key={idx} className="premium-card p-5 bg-card text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{stat.label}</span>
            <div className="text-xl font-extrabold tracking-tight text-foreground mt-1 truncate">{stat.value}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Assessment History list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="premium-card p-6 bg-card">
            
            {/* List Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-border/30">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Assessments History</h2>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search history..."
                    className="pl-8 pr-3 py-1.5 bg-secondary/30 border border-border/60 rounded-lg focus:outline-none text-[11px] w-40 transition-all"
                  />
                </div>
                <button
                  onClick={() => setFilterSavedOnly(!filterSavedOnly)}
                  className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border flex items-center space-x-1 transition-all ${
                    filterSavedOnly
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-border/60 hover:bg-secondary/40'
                  }`}
                >
                  <Bookmark className="h-3 w-3" />
                  <span>Saved</span>
                </button>
              </div>
            </div>

            {/* Reports list */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border/40 rounded-xl bg-secondary/5">
                <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <h3 className="font-bold text-xs text-foreground">No records matched</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 px-4">
                  {searchQuery || filterSavedOnly ? 'Refine filter inputs.' : 'Execute symptom check to log assessment.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-border/20">
                {filteredReports.map((report, idx) => {
                  const topResult = report.predictions[0];
                  return (
                    <div key={report.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${idx > 0 ? 'pt-4' : ''}`}>
                      
                      <div className="space-y-1 text-left">
                        <div className="flex items-center space-x-1.5 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          {report.saved && (
                            <span className="px-1.5 py-0.2 bg-primary/10 text-primary rounded-md text-[9px] font-bold">Saved</span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-foreground">
                          {topResult ? topResult.diseaseName : 'N/A'}{' '}
                          <span className="text-[10px] text-muted-foreground font-normal">({topResult ? topResult.confidence : 0}% match)</span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {report.symptoms.slice(0, 3).map(sId => (
                            <span key={sId} className="px-1.5 py-0.2 bg-secondary text-foreground rounded text-[9px] font-medium border border-border/30">
                              {symptoms.find(s => s.id === sId)?.name || sId}
                            </span>
                          ))}
                          {report.symptoms.length > 3 && (
                            <span className="px-1.5 py-0.2 bg-secondary text-muted-foreground rounded text-[9px] font-semibold border border-border/30">
                              +{report.symptoms.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 sm:self-center">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => generatePDFReport(report, currentUser.name, symptoms)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                          title="Download PDF"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleSaveReport(report.id)}
                          className="p-2 text-muted-foreground hover:text-primary rounded-lg"
                          title={report.saved ? 'Unsave' : 'Save'}
                        >
                          {report.saved ? (
                            <BookmarkCheck className="h-3.5 w-3.5 text-primary animate-pulse-subtle" />
                          ) : (
                            <Bookmark className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Trends Grid (Right column) */}
        <div className="space-y-4">
          <div className="premium-card p-6 bg-card text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Diagnostics Trends</h3>
            
            {trends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-[10px]">
                No trends logs available.
              </div>
            ) : (
              <div className="space-y-4">
                {trends.map((item, idx) => {
                  const pct = (item.value / maxTrendVal) * 100;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="truncate max-w-[75%]">{item.name}</span>
                        <span className="text-muted-foreground">{item.value} {item.value === 1 ? 'case' : 'cases'}</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-primary rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Details Overlays */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg premium-card bg-card overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-5 border-b border-border/40 flex items-center justify-between bg-secondary/10">
              <div>
                <h3 className="font-bold text-sm text-foreground">Clinical Report</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  ID: {selectedReport.id} • {new Date(selectedReport.date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 hover:bg-secondary rounded-lg text-xs"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-5 overflow-y-auto space-y-5 text-left">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Checked Symptoms</span>
                <div className="flex flex-wrap gap-1">
                  {selectedReport.symptoms.map((sId: string) => (
                    <span key={sId} className="px-2 py-0.5 bg-secondary text-foreground rounded-lg text-[10px] font-medium border border-border/40">
                      {symptoms.find(s => s.id === sId)?.name || sId}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Diagnostics Matches</span>
                <div className="space-y-2.5">
                  {selectedReport.predictions.map((pred: any, index: number) => (
                    <div key={index} className="p-3 bg-secondary/10 border border-border/60 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs">{pred.diseaseName}</span>
                        <span className="text-[10px] font-bold text-primary">{pred.confidence}% Match</span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-1.5">
                        <div
                          style={{ width: `${pred.confidence}%` }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-normal">{pred.description}</p>

                      {index === 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-border/20">
                          <span className="text-[10px] font-bold text-foreground block mb-1">Preventative Advice:</span>
                          <ul className="text-[9px] text-muted-foreground space-y-1 list-disc pl-3">
                            {pred.recommendations.map((rec: string, rIdx: number) => (
                              <li key={rIdx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedReport.notes && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Patient Entry Notes</span>
                  <div className="p-3 bg-secondary/20 rounded-xl text-[10px] italic text-muted-foreground">
                    "{selectedReport.notes}"
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-border/40 bg-secondary/15 flex items-center justify-between">
              <button
                onClick={() => generatePDFReport(selectedReport, currentUser.name, symptoms)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-xl border border-border/50 hover:bg-secondary/70"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
