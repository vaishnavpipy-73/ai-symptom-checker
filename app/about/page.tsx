'use client';

import React from 'react';
import { Info, BrainCircuit, Activity, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in text-left">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          <span>About MediPredict AI</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5">
          Platform engineering, mathematical algorithms, and medical disclaimer guidelines.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Core Vision */}
        <section className="premium-card p-6 bg-card space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Core Vision</h2>
          <p className="text-xs text-foreground leading-relaxed">
            MediPredict AI is designed as a next-generation simulation platform bridging the gap between mathematical probability models and healthcare informatics. The system demonstrates how client-side state engines can run high-performance diagnostic classifications without the latency overhead of dedicated microservice hosting.
          </p>
        </section>

        {/* Algorithm details */}
        <section className="premium-card p-6 bg-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center">
            <BrainCircuit className="h-4 w-4 mr-1 text-primary" />
            <span>Naive Bayes ML Classifier</span>
          </h2>
          <p className="text-xs text-foreground leading-relaxed">
            Unlike heavy deep learning models that require dedicated GPUs, MediPredict AI leverages a specialized **Naive Bayes Classifier** implemented in pure TypeScript. When you select a list of symptoms, the serverless route calculates log-likelihood joint probabilities across all database diseases:
          </p>
          <div className="p-3 bg-secondary/35 border border-border/50 rounded-xl font-mono text-[10px] text-primary select-all text-center">
            ln P(D | S) = ln P(D) + ∑ ln P(s_i | D) + ∑ ln(1 - P(s_j | D))
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            By applying Laplace smoothing and calculating scores in log-space, the engine avoids floating-point underflow. A Softmax normalization converts the scores into relative confidence percentages displayed in the client checker interface.
          </p>
        </section>

        {/* Technical stack */}
        <section className="premium-card p-6 bg-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Technical Stack</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Next.js 15 (App Router)', desc: 'Optimized serverless function routes' },
              { title: 'TypeScript Core', desc: 'Type-safe clinical classification layers' },
              { title: 'Tailwind CSS v4', desc: 'Minimal HSL theme custom variables' },
              { title: 'jsPDF Client Compiler', desc: 'Browser-assembled health report outputs' }
            ].map((tech, idx) => (
              <div key={idx} className="p-3 bg-secondary/15 border border-border/40 rounded-xl text-left">
                <h4 className="text-xs font-bold text-foreground">{tech.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Academic disclaimer */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start space-x-2.5 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-normal">
            <strong>Simulation Guard Notice:</strong> The medical catalog (15 conditions, 30 indicators) is structured purely for mathematical correlation testing and has not been vetted by clinical boards. It should not be used as a primary decision agent during a medical crisis.
          </p>
        </div>

      </div>

    </div>
  );
}
