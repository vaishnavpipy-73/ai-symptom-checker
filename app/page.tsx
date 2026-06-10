'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Database,
  BrainCircuit,
  Heart
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fade-in">
      
      {/* Prominent Medical Notice (SaaS Style Warning Banner) */}
      <div className="mb-12 max-w-3xl mx-auto w-full">
        <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3 shadow-sm">
          <span className="text-sm">⚠️</span>
          <div className="text-left text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-[10px] text-amber-600 dark:text-amber-400">Educational Notice</span>
            This application is for educational purposes only and does not provide medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, please call your local emergency services immediately.
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        {/* Soft Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-primary rounded-full text-xs font-semibold mb-6">
          <BrainCircuit className="h-3.5 w-3.5" />
          <span>Bayesian Health Classifier Engine</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-foreground">
          Symptom analysis,{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            made simple.
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          Evaluate medical symptoms with our high-performance in-browser Naive Bayes classifier. Access pre-seeded conditions, track diagnostics statistics, and download structured clinical summaries.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5">
          <Link
            href="/checker"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-all text-xs"
          >
            <Stethoscope className="h-4 w-4" />
            <span>Start Symptom Checker</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/diseases"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl border border-border/50 hover:bg-secondary/80 transition-all text-xs"
          >
            <Database className="h-4 w-4" />
            <span>Browse Library</span>
          </Link>
        </div>
      </div>

      {/* Statistics Block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-16">
        {[
          { value: '1,420+', label: 'Diagnostic Runs', icon: Activity },
          { value: '15+', label: 'Condition Databases', icon: Database },
          { value: '100% Local', label: 'Vercel Serverless', icon: ShieldCheck },
          { value: '94.2%', label: 'Bayes Accuracy', icon: TrendingUp }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="premium-card p-5 text-center flex flex-col items-center justify-center bg-card">
              <div className="p-2.5 bg-secondary text-primary rounded-xl mb-3">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold mb-0.5 tracking-tight text-foreground">{stat.value}</div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Simplified Features Section */}
      <div className="border-t border-border/30 pt-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Platform Functions</h2>
          <p className="text-xs text-muted-foreground mt-1">Minimal tools designed for medical simulation and educational cataloging.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Multi-select Diagnostics',
              desc: 'Select multiple symptoms from a database of 30+ indicators using autocomplete searches or organ categories.',
              href: '/checker',
              actionText: 'Launch checker',
              icon: Stethoscope
            },
            {
              title: 'Bayesian ML Logic',
              desc: 'Calculated instantly in serverless functions without the overhead of external database connections or Flask wrappers.',
              href: '/diseases',
              actionText: 'Read documentation',
              icon: BrainCircuit
            },
            {
              title: 'Clinical PDF Summaries',
              desc: 'Compile diagnostics metrics, probability lists, and preventative precautions into a professional print-ready report.',
              href: '/dashboard',
              actionText: 'View reports',
              icon: FileText
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="premium-card p-6 flex flex-col justify-between h-full bg-card">
                <div>
                  <div className="p-2.5 bg-secondary text-primary rounded-xl w-fit mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                </div>
                <Link
                  href={item.href}
                  className="text-xs text-primary font-bold inline-flex items-center space-x-1 hover:underline mt-auto"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
