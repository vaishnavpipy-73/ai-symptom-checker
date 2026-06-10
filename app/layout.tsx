import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import { Heart } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediPredict AI - Professional Symptom Checker",
  description: "Evaluate your health symptoms instantly with our Naive Bayes ML classifier. Get predictions and preventative insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
                    {/* Global Footer */}
          <footer className="border-t border-border/40 py-8 px-4 sm:px-6 lg:px-8 bg-card/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  MediPredict AI
                </span>
                <span className="text-muted-foreground text-xs">| &copy; {new Date().getFullYear()} All Rights Reserved</span>
              </div>
              
              {/* Developer Watermark */}
              <div className="text-xs text-muted-foreground font-semibold">
                Project Developed by <span className="text-primary font-bold">Vaishnav S Nair</span>
              </div>

              {/* Prominent Medical Disclaimer */}
              <div className="max-w-lg text-center md:text-right">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 inline-block">
                  ⚠️ Disclaimer: This application is for educational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a healthcare professional.
                </p>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
