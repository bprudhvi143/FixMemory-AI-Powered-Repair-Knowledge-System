# FixMemory 🔧
> **Find the Fix. Save the Time.**  
> An AI-powered repair knowledge system that helps computer and laptop repair technicians find past fixes for their device symptoms.

Built by **Team Eleven** — designed for computer and laptop repair shops in India and worldwide.

---

## 🚀 Overview

Computer and laptop repair technicians spend excessive time diagnosing faults they have encountered before because repair knowledge is scattered across personal notes, YouTube videos, forums, and informal chats. 

**FixMemory** solves this by:
1. **Intelligent Symptom-to-Fix Matching:** Enter device symptoms (e.g., *"HP Pavilion heats up and shuts down after 10 minutes"*); FixMemory retrieves matching historical repair cases, troubleshooting steps, and verified solutions.
2. **Technician Case Logging:** Technicians can document their successful repairs with structured categories, symptoms, troubleshooting steps taken, and final fixes.
3. **Open Repair Alliance (ORDS) Integration:** Includes an admin pipeline to stream, validate, and import real-world historical repair event data from the Open Repair Alliance (under CC BY-SA 4.0), strictly preserving data trust (unrecorded steps/solutions are set to `null` and never hallucinated).
4. **Dual AI Mode:** Supports live Google Gemini AI matching via a secure Node.js backend route, with an automated, zero-config local heuristic search fallback if an API key is not configured.
5. **Bilingual Accessibility:** Real-time English / తెలుగు (Telugu) toggle for vernacular workshop technicians.
6. **Hybrid Storage & Database Architecture:**
   - Preloaded sample repair records and technician-contributed cases in browser `localStorage`.
   - Supabase PostgreSQL schema with duplicate prevention for external datasets (`supabase/migrations/20261101_repair_cases.sql`).
   - Automated Local Test Mode fallback (`server/data/ora_cases.json`) when Supabase credentials are not provided.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router v7.
- **Backend:** Node.js Express server (`server/index.js`) providing:
  - `/api/match` (Google Gemini 1.5 Flash AI diagnostic matching + heuristic pre-filter)
  - `/api/admin/ora/preview` and `/api/admin/ora/import` (streaming CSV parser via `csv-parse` and `multer`)
  - `/api/cases/ora` (query imported historical records)
- **Database / Storage:** Dual Supabase PostgreSQL / Local Test Mode with deduplication.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Installation
```bash
git clone https://github.com/bprudhvi143/FixMemory-AI-Powered-Repair-Knowledge-System.git
cd FixMemory
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`, you can optionally add:
```env
# Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase PostgreSQL (defaults to Local Test Mode if not set)
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here

# Server Port
PORT=3001
```

### 4. Run Locally
To run both the Vite frontend and Express backend concurrently:
```bash
npm run dev
```
- **Web App (Frontend):** `http://localhost:5173/FixMemory-AI-Powered-Repair-Knowledge-System/`
- **Backend API:** `http://localhost:3001`
- **Admin Importer:** `http://localhost:5173/FixMemory-AI-Powered-Repair-Knowledge-System/admin/import`

Or run them individually:
```bash
npm run dev:frontend   # Vite frontend on port 5173
npm run dev:server     # Express server on port 3001
```

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 5-Step Testing Checklist

1. **Explore Recent Cases & Open Case Details Modal:**
   - On the Home page, scroll to **Recent Repair Cases**.
   - Click **"View Full Case"** on any card to open the interactive modal displaying full device details, symptoms, troubleshooting steps taken, and final solution.
2. **Search Historical Symptoms (Technician & ORA Records):**
   - Click the suggested pill: *"HP Pavilion heats up and shuts down after 10 minutes"* (or search *"Dell laptop power problems"* or *"battery"*).
   - On `/results`, verify **Possible Causes**, matched cases, and distinct badges (`Technician Submitted`, `Sample`, `Open Repair Alliance`).
3. **Log a New Repair Case:**
   - Click **Log Case** in the navigation bar.
   - Enter a new repair (e.g. *Asus ZenBook 14*, Display, screen flicker, replaced eDP ribbon cable) and save.
   - Return to Home: your new case appears immediately at the top with a green **Technician Submitted** badge!
4. **Test the Admin ORA Dataset Importer:**
   - Navigate to `/admin/import`.
   - Upload `server/data/test_ora_20.csv` or `test_ora_100.csv`.
   - Preview the first 10 rows and check filtering (Laptops/Desktops only, invalid rows flagged, duplicates detected).
   - Click **Confirm & Import**. Verify that imported records are instantly searchable without overwriting technician cases.
5. **Test Language Toggle & Attribution:**
   - Click **తెలుగు** in the navbar: UI instantly translates to Telugu. Click **English** to switch back.
   - Go to **About**: view the Open Repair Alliance provenance notice and CC BY-SA 4.0 license information.

---

## 📜 Licensing & Attribution

- FixMemory core application is developed by **Team Eleven**.
- Imported repair event records originate from the **Open Repair Alliance** ([ORDS standard](https://openrepair.org/open-data/downloads/)) and are shared under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** license.
