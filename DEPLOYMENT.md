# Vercel Deployment Guide

This document outlines the step-by-step procedure for deploying the **MediPredict AI Medical Symptom Checker** application to Vercel.

---

## ⚡ Deployment Overview

The application is built using Next.js 15, TypeScript, and Tailwind CSS. It is designed to be completely self-contained, using Next.js API Routes (Route Handlers) to execute Machine Learning predictions. It requires:
- **No external database hosting** (uses a simulated local storage state layer).
- **No Flask or external Python server** (the Naive Bayes engine is written in pure TypeScript).
- **No Docker configurations**.
- **Default Vercel serverless configurations**.

This makes the deployment process simple and highly compatible with Vercel's zero-config Next.js framework.

---

## ⚙️ Deployment Methods

### Method 1: One-Click Git Integration (Recommended)
This is the easiest method and ensures that every change you push to your repository triggers an automatic preview or production build.

1. **Upload your code to GitHub, GitLab, or Bitbucket:**
   - Initialize a local git repository: `git init`
   - Stage all files: `git add .`
   - Commit changes: `git commit -m "initial commit"`
   - Create a repository on GitHub and link it to your local git:
     ```bash
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git branch -M main
     git push -u origin main
     ```

2. **Connect to Vercel:**
   - Log in to your [Vercel Account](https://vercel.com).
   - Click the **Add New...** button in the top right and select **Project**.
   - Under *Import Git Repository*, select your GitHub account and find the repository you created. Click **Import**.

3. **Configure Settings:**
   - **Framework Preset:** Vercel will automatically detect `Next.js`. Keep this selection.
   - **Root Directory:** `./`
   - **Build and Output Settings:** Keep these as default. The build command will automatically run `npm run build` and compile TypeScript.
   - **Environment Variables:** No custom environment variables are required since the ML data is stored directly in the repository under `data/dataset.json`.

4. **Deploy:**
   - Click **Deploy**. Vercel will bundle the dependencies, run lint checks, and launch your serverless functions.
   - Within 1-2 minutes, you will receive a production deployment URL (e.g., `https://your-project-name.vercel.app`).

---

### Method 2: Deployment via Vercel CLI
If you prefer deploying directly from your local terminal without pushing to a Git remote:

1. **Install the Vercel CLI globally:**
   - Run: `npm install -g vercel`

2. **Authenticate and Initialize:**
   - Run `vercel` from the root directory of the project.
   - Follow the terminal prompts:
     - Log in to your Vercel account (email, GitHub, etc.).
     - Set up and deploy `c:\Users\LENOVO\Desktop\cs intership project\New folder`? **Yes**
     - Link to an existing project? **No**
     - What's your project's name? **ai-symptom-checker**
     - In which directory is your code located? `./`

3. **Deploying to Production:**
   - Running `vercel` creates a temporary preview URL.
   - To make it live on production, run:
     ```bash
     vercel --prod
     ```

---

## 🔍 Post-Deployment Verification Checklist

Once your application is live on Vercel, run through this quick checklist to ensure everything is operating correctly:
1. **Symptom Classifier API:**
   - Open your deployed URL.
   - Navigate to `/checker` and select a combination of symptoms (e.g., *High Fever*, *Persistent Cough*, *Extreme Fatigue*).
   - Click **Analyze Symptoms**.
   - Verify that the model runs (showing the diagnostics loader) and returns the top 3 predicted conditions (e.g., *Influenza (Flu)*, *COVID-19*, etc.) with correct confidence percentages.
2. **Clinical PDF Download:**
   - Run a diagnostic report in the symptom checker, or open a saved record from the dashboard.
   - Click **Download Report PDF**.
   - Verify the PDF is generated and downloaded instantly by the browser.
3. **Session Authentication:**
   - Navigate to `/auth`.
   - Click on the quick demo account buttons (Standard Patient or Medical Admin).
   - Ensure the app redirects you to the `/dashboard` and displays your session profile details.
4. **Operations / Admin Portal:**
   - Log in as the Medical Admin (`admin@healthcare.com`).
   - Navigate to `/admin` and click through the tabs (Inference Analytics, Patient Registry, Manage Symptoms, Manage Diseases).
   - Add a custom symptom or custom disease, then head back to `/checker` to verify your addition appears in the list of selection tags immediately.
