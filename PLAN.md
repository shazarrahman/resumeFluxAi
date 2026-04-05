# ResumeFluxAI — Master Development Plan

> **Stack:** MERN (MongoDB Atlas · Express · React · Node.js)
> **Deployment:** Vercel (Frontend) · Render (Backend) · MongoDB Atlas (Database)
> **Cost:** ₹0 — 100% free tier only
> **AI:** Google Gemini API (free tier) or Groq API (free, fast)

---

## Pre-Phase: Environment Setup (Day 0 — Before Writing Any Code)

### Install These Tools (all free)
- **Node.js** → https://nodejs.org (download LTS version)
- **Git** → https://git-scm.com
- **MongoDB Compass** (optional GUI) → https://www.mongodb.com/products/compass
- **Postman** (API testing) → https://www.postman.com

### Create Free Accounts
| Service | Purpose | Link |
|---|---|---|
| MongoDB Atlas | Cloud database | https://cloud.mongodb.com |
| Render | Host backend | https://render.com |
| Vercel | Host frontend | https://vercel.com |
| GitHub | Code storage + deployment trigger | https://github.com |
| Groq | Free AI API (fast LLaMA models) | https://console.groq.com |

### VS Code Extensions to Install
- ESLint
- Prettier
- Thunder Client (API testing inside VS Code)
- MongoDB for VS Code
- GitLens

---

## Phase 1 — Project Skeleton & Authentication (Week 1)

**Goal:** Get a working login/register system with JWT running locally.

### Step 1.1 — Create Folder Structure
```
resumefluxai/
├── src/          ← React frontend
└── www/          ← Node/Express backend
```

Run in terminal:
```bash
npx create-react-app client
```

### Step 1.2 — Backend Setup
```bash
cd src
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors multer
npm install --save-dev nodemon
```

Create `src/index.js` as the entry point.

### Step 1.3 — MongoDB Atlas Setup
1. Create free cluster on MongoDB Atlas
2. Create a database user (save username + password)
3. Whitelist IP: `0.0.0.0/0` (allows all IPs — needed for Render)
4. Copy connection string → paste in `.env` file

### Step 1.4 — Build These Backend Files
- `models/User.js` — name, email, passwordHash, plan (free/premium), createdAt
- `controllers/authController.js` — register, login logic
- `routes/authRoutes.js` — POST /api/auth/register, POST /api/auth/login
- `middleware/authMiddleware.js` — verify JWT token on protected routes

### Step 1.5 — Frontend Auth Pages
- Install: `npm install axios react-router-dom`
- Create pages: `Register.jsx`, `Login.jsx`, `Dashboard.jsx`
- Store JWT in `localStorage`
- Redirect to dashboard after login

### ✅ Phase 1 Done When:
- User can register and login
- JWT token stored in browser
- Protected dashboard route works
- MongoDB Atlas shows users in collection

---

## Phase 2 — Resume Upload & Text Extraction (Week 2)

**Goal:** User uploads a PDF/DOCX, backend extracts the raw text.

### Step 2.1 — Backend File Upload
```bash
cd src
npm install pdf-parse mammoth
```

- Configure `multer` for file uploads (store temporarily in `/uploads` folder)
- `multer` limits: 5MB max, accept only PDF and DOCX

### Step 2.2 — Parsing Logic
Create `services/resumeParser.js`:
- If file is `.pdf` → use `pdf-parse`
- If file is `.docx` → use `mammoth`
- Returns plain extracted text string

### Step 2.3 — Resume Model & API
- `models/Resume.js` — userId, originalFileName, extractedText, uploadDate
- `routes/resumeRoutes.js` — POST /api/resume/upload (protected)
- Save extracted text to MongoDB (do NOT store the actual file — saves storage)

### Step 2.4 — Frontend Upload UI
- Drag-and-drop upload card using `react-dropzone`
- Show file name after selection
- Upload button → POST to backend
- Show success/error toast notification

### ✅ Phase 2 Done When:
- PDF and DOCX uploads work
- Extracted text visible in MongoDB Atlas
- Upload UI works with drag and drop

---

## Phase 3 — AI Scoring & Suggestions (Week 3)

**Goal:** Send extracted resume text to Groq AI and get a score + improvement suggestions.

### Step 3.1 — Get Groq API Key
1. Sign up at https://console.groq.com
2. Create API key (free, no card needed)
3. Add to server `.env` as `GROQ_API_KEY`

### Step 3.2 — AI Service
Install: `npm install groq-sdk`

Create `services/aiService.js` with a function that:
1. Takes resume text as input
2. Sends this prompt to Groq (LLaMA 3 model):

```
Analyze this resume and return a JSON object with:
- score: number from 0-100
- strengths: array of 3 things done well
- improvements: array of 5 specific bullet point improvements
- missingKeywords: array of important keywords that are missing
- summary: one paragraph overall assessment
```

3. Parses the JSON response and returns it

### Step 3.3 — Analysis Model & API
- `models/Analysis.js` — resumeId, score, strengths, improvements, missingKeywords, summary, createdAt
- `routes/analysisRoutes.js` — POST /api/analysis/analyze (protected)
- Flow: receive resumeId → fetch extracted text → call AI → save analysis → return result

### Step 3.4 — Frontend Score Display
- Score card with circular progress indicator
- Color coded: 0-40 red, 41-70 yellow, 71-100 green
- Expandable suggestion cards
- Missing keywords shown as tags/badges

### ✅ Phase 3 Done When:
- AI returns score and suggestions for any uploaded resume
- Results display cleanly on frontend
- Analysis saved in MongoDB for history

---

## Phase 4 — Job Description Matching (Week 4)

**Goal:** User pastes a job description and gets a match score + missing skills.

### Step 4.1 — Update Upload Flow
- Add an optional textarea on upload page: "Paste Job Description (optional)"
- Send both resume text + job description to backend

### Step 4.2 — Update AI Prompt
When job description is provided, use this prompt:

```
Compare this resume against this job description.
Return JSON with:
- matchScore: 0-100 (how well resume fits the job)
- matchedSkills: array of skills that match
- missingSkills: array of required skills not in resume
- suggestions: array of specific things to add/change to match better
```

### Step 4.3 — Update Analysis Model
Add fields: `jobDescription`, `matchScore`, `matchedSkills`, `missingSkills`

### Step 4.4 — Frontend Match UI
- Side-by-side comparison panel
- Matched skills shown in green badges
- Missing skills shown in red badges
- Match percentage bar

### ✅ Phase 4 Done When:
- Job description matching works end to end
- Match score different from general score
- Skills comparison UI shows clearly

---

## Phase 5 — Interview Prep & AI Rewriting (Week 5)

**Goal:** Generate interview questions and optionally rewrite resume bullets.

### Step 5.1 — Interview Questions
- `models/InterviewPrep.js` — analysisId, questions (array), importantTopics (array)
- New AI prompt: generate 10 likely interview questions based on resume + job description
- Also generate: top 5 topics the candidate should study/prepare

### Step 5.2 — Resume Bullet Rewriter
- User selects a bullet point from their resume on the UI
- AI rewrites it using the STAR format (Situation, Task, Action, Result)
- Shows original vs rewritten side by side

### Step 5.3 — Frontend Interview UI
- Accordion list of interview questions
- "Show answer tips" toggle for each question
- Topics to prepare shown as a checklist

### ✅ Phase 5 Done When:
- Interview questions generated after analysis
- Bullet rewriter works for selected text
- Topics checklist renders properly

---

## Phase 6 — Dashboard, History & UI Polish (Week 6)

**Goal:** Full dashboard with history, theme toggle, and production-ready UI.

### Step 6.1 — Dashboard History
- Fetch all past analyses for logged-in user
- Show as cards: upload date, score, filename
- Click any card to view full analysis again

### Step 6.2 — Neon Gradient UI Theme
Apply the design system from the PDF:
- Background: `#0f172a` (dark navy)
- Primary gradient: `#00f5ff` → `#7b2cff`
- Accent: `#ff2fd1`
- All buttons and cards use gradient borders/backgrounds

### Step 6.3 — Dark/Light Mode Toggle
- Use React Context for theme state
- Save preference to `localStorage`
- Toggle button in navbar

### Step 6.4 — Export Feature
- "Download Analysis Report" button
- Generates a clean PDF summary using `jsPDF` library
- Contains: score, suggestions, matched skills, interview questions

### Step 6.5 — Final Cleanup
- Add loading spinners everywhere
- Error boundary components
- Empty state illustrations
- Mobile responsive layout check

### ✅ Phase 6 Done When:
- Dashboard shows full history
- Theme toggle works and persists
- PDF export downloads correctly
- Works on mobile screens

---

## Phase 7 — Deployment (End of Week 6)

**Goal:** Live website accessible via public URL, completely free.

### Step 7.1 — Prepare for Deployment
- Push entire project to GitHub (two repos or one monorepo)
- Add `.env.example` file (list all env variable names, no values)
- Add `.gitignore` (ignore `node_modules`, `.env`, `uploads/`)

### Step 7.2 — Deploy Backend on Render
1. Go to https://render.com → New Web Service
2. Connect GitHub repo → select `server/` as root
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all environment variables (MongoDB URI, JWT secret, Groq API key)
6. Deploy → copy the Render URL (e.g. `https://your-app.onrender.com`)

> ⚠️ Free Render services sleep after 15 min inactivity. First request after sleep takes ~30 seconds. This is normal on free tier.

### Step 7.3 — Deploy Frontend on Vercel
1. Go to https://vercel.com → New Project
2. Connect GitHub repo → select `client/` as root
3. Add environment variable: `REACT_APP_API_URL=https://your-app.onrender.com`
4. Deploy → get your live URL

### Step 7.4 — Post-Deployment Checks
- [ ] Register a new user on live site
- [ ] Upload a real resume PDF
- [ ] Check analysis returns from AI
- [ ] Verify MongoDB Atlas shows data
- [ ] Test on mobile browser

### ✅ Phase 7 Done When:
- Live URL works from any browser
- All features functional in production
- No errors in Vercel/Render logs

---

## Free Tier Limits Reference

| Service | Free Limit | What Happens When Exceeded |
|---|---|---|
| MongoDB Atlas | 512 MB storage | Writes fail — need to upgrade |
| Render | 750 hrs/month, sleeps after 15 min | Site slow on first load |
| Vercel | 100 GB bandwidth/month | Site blocked |
| Groq API | ~14,400 requests/day | Rate limit error returned |

---

## Future Scaling (When You Get Clients)

- Add Stripe/Razorpay for premium plan payments
- Move file storage to Cloudinary (free tier) instead of local
- Add Redis caching for repeated analyses
- Separate AI processing into a background job queue (Bull.js)
- Add admin dashboard to monitor users and usage
