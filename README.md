# FixMemory 🔧
> **Find the Fix. Save the Time.**  
> An AI-powered repair knowledge system that helps computer and laptop repair technicians find past fixes for their device symptoms.

Built by **Team Eleven** — an MVP designed for small computer and laptop repair shops in India and worldwide.

---

## 🚀 Overview

Computer and laptop repair technicians spend excessive time diagnosing faults they have encountered before because repair knowledge is scattered across personal notes, YouTube videos, forums, and informal chats. 

**FixMemory** solves this by:
1. **Intelligent Symptom-to-Fix Matching:** Enter a device model and its symptoms (e.g., *"HP Pavilion heats up and shuts down after 10 minutes"*); FixMemory retrieves historical repair cases with matching symptoms, troubleshooting steps, and verified solutions.
2. **Technician Case Logging:** Technicians can quickly log their own successful repairs with structured categories, symptoms, troubleshooting steps, and final fixes.
3. **Dual AI Mode:** Supports live Google Gemini AI matching via a secure Node.js backend route, with an automated, zero-config local heuristic search fallback if an API key is not configured.
4. **Bilingual Accessibility:** Real-time English / తెలుగు (Telugu) toggle for vernacular workshop technicians.
5. **Local-First Persistence:** Seeded with 10 real-world sample repair cases on first launch and stores technician contributions in browser `localStorage`. Includes a safe "Clear My Data" reset with confirmation.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router v7.
- **Backend:** Node.js Express server (`server/index.js`) providing a secure `/api/match` proxy to Google Generative AI (`gemini-1.5-flash`).
- **Data Persistence:** Browser `localStorage` with sample data auto-seeding.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Installation
```bash
git clone <repo-url>
cd FixMemory
npm install
```

### 3. Environment Variables (Optional for Live Gemini)
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Inside `.env`, add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```
> *Note: If no API key is provided, FixMemory automatically operates in **Demo Mode**, utilizing high-speed local keyword matching and simulated diagnostic causes without breaking or blocking the user.*

### 4. Run Locally
To run both the Vite frontend and Express backend concurrently:
```bash
npm run dev
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`

Or run them individually:
```bash
# Frontend only
npm run dev:frontend

# Backend server only
npm run dev:server
```

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 5-Step Testing Checklist

1. **Explore Recent Cases & Open Case Details Modal:**
   - On the Home page (`http://localhost:5173`), scroll to **Recent Repair Cases**.
   - Notice the 4 initial cases tagged with the amber **Sample** badge.
   - Click **"View Full Case"** on any card to open the interactive modal displaying full device details, symptoms, troubleshooting steps taken, and final solution.
2. **Search Historical Symptoms:**
   - In the search bar on Home, click the sample search pill: *"HP Pavilion heats up and shuts down after 10 minutes"* (or type any symptom like *"flicker"* or *"power"*), then click **Find Solutions**.
   - On `/results`, verify the **Search Summary**, **Possible Causes**, and **Matching Repair Cases** with relevance reasons.
3. **Log a New Repair Case:**
   - Click **Log Case** in the navigation bar.
   - Enter a new repair:
     - **Brand:** `Asus`
     - **Model:** `ZenBook 14`
     - **Category:** `Display`
     - **Symptoms:** `Screen flickers and blacks out when hinge moves past 90 degrees.`
     - **Troubleshooting Steps Taken:** `Tested external HDMI monitor; inspected eDP cable.`
     - **Final Solution:** `Replaced worn eDP ribbon cable at display hinge.`
   - Click **Save Repair Case**. Verify the success screen.
4. **Verify Retrieval of Newly Logged Case:**
   - Click **Back to Home**. Observe that the new case appears at the top of **Recent Repair Cases** with a green **Technician Submitted** badge.
   - Search for *"Asus hinge"* or *"Asus display"* in the search bar. Verify that your newly logged case is retrieved as a match!
5. **Test Language Toggle & Clear My Data:**
   - Click the language toggle button in the navbar (**తెలుగు**). Confirm that navigation, buttons, and section titles instantly switch to Telugu. Click **English** to switch back.
   - Go to **About** page. Scroll to the bottom and click **Clear My Data**. Confirm in the dialog to restore the original 10 sample records.

---

## 🌐 Deployment Instructions

### Option A: Vercel (Recommended for Frontend + Serverless)
1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add an Environment Variable: `GEMINI_API_KEY`.
4. Deploy!

### Option B: Render / Railway / VPS (Full Stack)
1. Deploy the backend Express server (`node server/index.js`) to Render or Railway with `GEMINI_API_KEY`.
2. Build the Vite frontend with `npm run build` and point the `/api` proxy/base URL to the hosted backend.

---

## 🔮 5 Ideas for Version 2

1. **Component-Level Tagging & Parts Cross-Reference:**
   - Allow technicians to log specific component part numbers (e.g., motherboards, display panels, charging IC numbers like `BQ24780S`) to find exact hardware replacements.
2. **Image & Schematic Attachment:**
   - Enable technicians to take and attach photos of burnt motherboard traces, microscopic solder points, or boardview schematics to repair cards.
3. **WhatsApp / PWA Offline Support:**
   - Technicians in small stalls often have intermittent connectivity; enable IndexedDB offline caching and a WhatsApp bot for submitting and querying fixes via quick voice or text messages.
4. **Shop Team Knowledge Base & Permissions:**
   - Multi-tenant workspaces where shop owners can view aggregate repair metrics, track technician throughput, and share a private shop-only database of fixes.
5. **Peer Verification & Reputation Upvotes:**
   - Enable technicians to upvote solutions that worked for them ("Confirmed Fix"), raising community trust and ranking the most reliable solutions first.
