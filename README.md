# MediPredict AI - Clinical Symptom Checker & Operations Hub

MediPredict AI is a production-ready, high-aesthetic web application designed as a professional health-tech startup platform. It enables patients to evaluate health symptoms using an in-API mathematical Naive Bayes classifier, log details into a personal dashboard, download structured clinical summaries as PDFs, and manage medical catalogs via a secure operations control panel.

> [!WARNING]
> **Prominent Medical Disclaimer:** This application is for educational purposes only and does not provide medical advice, diagnosis, or treatment. It is a probabilistic simulation built for demonstration. Always consult a certified healthcare practitioner in case of real sickness.

---

## ⚡ Key Features

1. **AI Symptom Checker:**
   - Multi-select input supporting search and autocomplete.
   - Organs-system categorized click-to-toggle symptom list.
   - Diagnostic transition animation correlating selected signals.
   - Top 3 predicted condition matches with confidence percentages.
2. **Personal Dashboard:**
   - Welcome greetings and dynamic health logs summary.
   - Interactive SVG progress trends graphs (bypassing SSR hydration warnings).
   - Historical audit lists showing past assessments, dates, and symptoms.
   - View detail reports in overlays or save/delete assessment records.
3. **Clinical PDF Reports:**
   - Client-side document assembly using `jspdf`.
   - Structured layout displaying patient name, timestamp, symptoms, predicted matches, recommendations, and disclaimer boxes.
4. **Disease Catalog Center:**
   - Browse 15+ pre-seeded clinical condition profiles.
   - Filter lists by organ category (Respiratory, Gastrointestinal, etc.).
   - Expand cards to view detailed etiology/causes, preventions, and precautions.
5. **Simulated Auth Gateway:**
   - Register new credentials or sign in.
   - Demo sandbox options to sign in as user (`user@healthcare.com`) or admin (`admin@healthcare.com`) instantly.
6. **Operations Control (Admin Panel):**
   - Platform analytics tracking total predictions, user list, and system speeds.
   - Custom Symptom Editor: Create custom symptoms.
   - Custom Disease Profile Logger: Add new diseases with causes, symptoms, and preventions, which automatically retrain the active classifier!
   - Audit trail registry.

---

## 🛠️ Architecture & Core ML Model

The app is built on a 100% serverless, zero-external-dependency stack:
- **Core Framework:** Next.js 15 (App Router) + React 19 + TypeScript.
- **Styling:** Tailwind CSS v4 featuring premium dark mode theme variables and glassmorphism styling (`glass-card`).
- **ML Engine:** In-API Naive Bayes Classifier. Rather than calling high-latency Python Flask microservices, we execute joint log-probability calculations in Next.js Serverless Route Handlers (`/api/predict`):
  
  $$\ln P(D \mid S) = \ln P(D) + \sum_{s \in S_{\text{selected}}} \ln P(s = 1 \mid D) + \sum_{s \notin S_{\text{selected}}} \ln P(s = 0 \mid D)$$

  This takes **< 1ms** and resolves floating-point underflows via log-sums before applying softmax normalizations.

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── admin/            # Operations control panel
│   ├── api/              # Vercel Serverless Function Routes
│   │   ├── analytics/    # Platform stats API
│   │   └── predict/      # ML classifier logic API
│   ├── auth/             # Session authentication simulator
│   ├── checker/          # Interactive Symptom Checker
│   ├── dashboard/        # Personal health records dashboard
│   ├── diseases/         # Disease Info Center catalog
│   ├── globals.css       # Tailwind v4 variables & glassmorphism classes
│   └── layout.tsx        # App entry frame (sticky Navbar & Footer)
├── components/           # Reusable UI & Layout Components
│   └── Navbar.tsx        # Responsive header with theme/session toggles
├── context/              # Context State Providers
│   └── AppContext.tsx    # State machine syncing local storage data
├── data/                 # Medical data files
│   └── dataset.json      # pre-seeded training data (15 conditions, 30 symptoms)
├── lib/                  # Helper utilities
│   ├── mlClassifier.ts   # Naive Bayes model mathematical logic
│   ├── mockDb.ts         # Local storage operations wrapper
│   └── pdfGenerator.ts   # jsPDF report structure compiler
├── types/                # TypeScript interfaces
│   └── index.ts          # Shared types definitions
├── vercel.json           # HTTP security headers settings
├── package.json          # npm dependencies
└── tsconfig.json         # TypeScript configuration settings
```

---

## 🚀 Local Installation & Run

Verify you have [Node.js (v18+)](https://nodejs.org) installed, then run:

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run Developer Server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.

---

## ☁️ Vercel Deployment (One-Click)

The project is optimized for deployment on Vercel without requiring Docker, database hosting, or additional server configuration:

### Method 1: Deploy with Vercel CLI
1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` from the project root and follow the prompts.
3. Once completed, run `vercel --prod` to deploy to production.

### Method 2: Deploy via GitHub Integration
1. Push this codebase to a public/private GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import the repository.
4. Leave build settings as default (Vercel automatically detects Next.js configurations).
5. Click **Deploy**.
