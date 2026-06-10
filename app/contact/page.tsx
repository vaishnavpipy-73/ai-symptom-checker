'use client';

import React, { useState } from 'react';
import { Mail, Send, Check, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !subject || !message) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);

    // Simulate sending email message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative min-h-[calc(100vh-4rem)]">
      
      {/* Container */}
      <div className="w-full max-w-md premium-card rounded-2xl overflow-hidden shadow-xl z-10 animate-fade-in bg-card">
        
        {/* Banner */}
        <div className="bg-secondary/20 p-6 text-center border-b border-border/40">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-1.5">
            <Mail className="h-5 w-5 text-primary" />
            <span>Contact Us</span>
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Have questions about the algorithm or platform? Drop us a line.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {success && (
            <div className="p-3.5 mb-4 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Thank you! Your message has been sent successfully.</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 mb-4 text-xs text-red-600 dark:text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alexander Fleming"
                className="w-full px-3 py-2 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexander@healthcare.com"
                className="w-full px-3 py-2 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. In-API Naive Bayes configuration"
                className="w-full px-3 py-2 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-2.5 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs resize-none h-24"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 hover:opacity-95 disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
