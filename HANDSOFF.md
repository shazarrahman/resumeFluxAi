# AI Resume SaaS — Handoff Document

> **Update this file every time you complete a step.**
> This is your source of truth. If you take a break and come back, read this first.

---

## 🟢 Current Status

**Active Phase:** Phase 1-3 Complete (Testing Required)
**Last Updated:** 2026-03-30
**Current Step:** Testing locally

---

## ✅ What Has Been Built So Far

- [x] Folder structure: `src/` (server) + `www/` (client)
- [x] Backend: Express + MongoDB + JWT auth
- [x] Frontend: React + React Router
- [x] Pages: Login, Register, Dashboard, Upload

---

## 🔧 Environment & Accounts

### Installed on Laptop
- [x] Node.js (LTS) - v24.14.0
- [x] Git - 2.51.0.windows.1
- [x] VS Code (already have this ✓)

### VS Code Extensions Installed
- [ ] ESLint
- [ ] Prettier
- [ ] Thunder Client
- [ ] MongoDB for VS Code
- [ ] GitLens

### Accounts Created
- [ ] GitHub — username: _______________
- [ ] MongoDB Atlas — cluster name: _______________
- [ ] Render — account email: _______________
- [ ] Vercel — account email: _______________
- [ ] Groq — API key saved: _______________

---

## 🖥️ Terminal Commands Run

### Phase 0: Environment Check
```bash
node --version    # Check Node.js installed → v24.14.0
git --version    # Check Git installed → 2.51.0.windows.1
```
**Why:** Verify prerequisites before starting project

---

### Phase 1: Backend Setup (src/)
```bash
cd src
npm init -y                              # Initialize Node.js project
npm install express mongoose bcryptjs jsonwebtoken dotenv cors multer pdf-parse mammoth groq-sdk  # Install backend dependencies
npm install --save-dev nodemon           # Dev dependency for auto-restart
```
**Why:** Create server folder and install all required packages per PLAN.md

```bash
mkdir src\controllers src\routes src\models src\middleware src\services src\utils src\uploads
```
**Why:** Create MVC folder structure

---

### Phase 1: Frontend Setup (www/)
```bash
cd www
npx create-react-app .                   # Create React app in www folder
npm install axios react-router-dom react-dropzone  # Install client dependencies
mkdir www\src\pages www\src\components www\src\context www\src\services
```
**Why:** Set up React frontend with routing and API client

---

### Running the Project
```bash
# Terminal 1 - Start backend
cd src
npm run dev        # Starts server on port 5000 (uses nodemon)

# Terminal 2 - Start frontend  
cd www
npm start          # Starts React on port 3000
```
**Why:** Run both servers locally for development

---

### Git Setup
```bash
# Create .gitignore in root
node_modules/
.env
.env.local
.DS_Store
*.log
uploads/
```
**Why:** Prevent sensitive files from being committed to Git

---

## 📁 Project Structure (as it grows)

```
ai-resume-saas/           ← root folder
├── client/               ← React app (created with create-react-app)
│   ├── src/
│   │   ├── pages/        ← Login, Register, Dashboard, Upload, Analysis
│   │   ├── components/   ← Navbar, ScoreCard, SuggestionList, etc.
│   │   ├── context/      ← AuthContext, ThemeContext
│   │   └── services/     ← api.js (axios instance)
│   └── .env              ← REACT_APP_API_URL
│
└── server/               ← Express backend
    ├── controllers/      ← authController, resumeController, analysisController
    ├── routes/           ← authRoutes, resumeRoutes, analysisRoutes
    ├── models/           ← User, Resume, Analysis, InterviewPrep
    ├── middleware/       ← authMiddleware.js
    ├── services/         ← aiService.js, resumeParser.js
    ├── utils/            ← helper functions
    ├── uploads/          ← temporary file storage (gitignored)
    ├── index.js          ← server entry point
    └── .env              ← all secrets go here
```

---

## 🔑 Environment Variables

### server/.env (never commit this to GitHub)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resumeai
JWT_SECRET=pick_any_long_random_string_here
GROQ_API_KEY=your_groq_api_key_here
```

### client/.env
```
REACT_APP_API_URL=http://localhost:5000
```
*(Change to Render URL after deployment)*

---

## 📦 Packages Installed

### Server (npm packages)
- [ ] express
- [ ] mongoose
- [ ] bcryptjs
- [ ] jsonwebtoken
- [ ] dotenv
- [ ] cors
- [ ] multer
- [ ] pdf-parse
- [ ] mammoth
- [ ] groq-sdk
- [ ] nodemon (dev)

### Client (npm packages)
- [ ] axios
- [ ] react-router-dom
- [ ] react-dropzone
- [ ] jspdf *(added in Phase 6)*

---

## 🗂️ Phase Progress Tracker

### Phase 0 — Environment Setup
- [x] Node.js installed
- [x] Git installed
- [ ] All accounts created
- [x] VS Code extensions installed

### Phase 1 — Authentication
- [x] Folder structure created
- [x] Server initialized (`npm init`)
- [x] All backend packages installed
- [x] `User` model created
- [x] Auth controller (register + login) working
- [x] JWT middleware working
- [ ] Auth routes tested in Thunder Client
- [x] React app created
- [x] Login page built
- [x] Register page built
- [x] Dashboard page (protected) built
- [x] JWT stored in localStorage
- [ ] Tested: register → login → dashboard flow works

### Phase 2 — Resume Upload & Parsing
- [x] `multer` configured for file uploads
- [x] `pdf-parse` working for PDFs
- [x] `mammoth` working for DOCX files
- [x] `resumeParser.js` service created
- [x] `Resume` model created
- [x] Upload API endpoint working
- [x] Text extracted and saved to MongoDB
- [x] Upload UI (drag and drop) working
- [ ] Tested: PDF upload → text visible in Atlas

### Phase 3 — AI Scoring
- [x] Groq API key added to `.env`
- [x] `aiService.js` created
- [x] Prompt returns score + suggestions as JSON
- [x] `Analysis` model created
- [x] Analysis API endpoint working
- [ ] Score card UI built
- [ ] Suggestions list UI built
- [ ] Tested: upload → analyze → see score on screen

### Phase 4 — Job Description Matching
- [ ] Job description textarea added to upload UI
- [ ] AI prompt updated for matching
- [ ] `Analysis` model updated with new fields
- [ ] Match score UI built
- [ ] Skills comparison badges working
- [ ] Tested: resume + JD → get match score

### Phase 5 — Interview Prep
- [ ] `InterviewPrep` model created
- [ ] Interview questions API endpoint working
- [ ] Questions accordion UI built
- [ ] Topics checklist UI built
- [ ] Bullet rewriter working
- [ ] Tested: click "Generate Interview Prep" → questions appear

### Phase 6 — Dashboard & UI Polish
- [ ] History page shows past analyses
- [ ] Neon gradient theme applied globally
- [ ] Dark/light mode toggle working
- [ ] Theme saved to localStorage
- [ ] PDF export working
- [ ] Loading spinners added
- [ ] Mobile responsive checked

### Phase 7 — Deployment
- [ ] Backend pushed to GitHub
- [ ] Frontend pushed to GitHub
- [ ] `.gitignore` set up correctly
- [ ] Backend deployed on Render
- [ ] Render environment variables set
- [ ] Frontend deployed on Vercel
- [ ] Vercel env variable `REACT_APP_API_URL` set to Render URL
- [ ] Full flow tested on live URL
- [ ] Works on mobile browser

---

## 🐛 Known Issues / Bugs

*(Write any bugs you encounter here so you don't forget)*

| Issue | Status | Notes |
|---|---|---|
| — | — | — |

---

## 🔗 Important URLs

| Resource | URL |
|---|---|
| Local Frontend | http://localhost:3000 |
| Local Backend | http://localhost:5000 |
| GitHub Repo | (fill after creating) |
| Render Backend URL | (fill after deployment) |
| Vercel Frontend URL | (fill after deployment) |
| MongoDB Atlas | https://cloud.mongodb.com |

---

## 📝 Notes & Decisions

*(Write any important decisions or things you figured out here)*

- Using Groq (not OpenAI) because it is completely free with no credit card
- Not storing uploaded files permanently — only extracted text is saved to MongoDB (saves storage space)
- Free Render service will sleep after 15 minutes of no requests — this is expected behavior, not a bug

---

## ▶️ How to Run the Project Locally

### Start the backend
```bash
cd server
npm run dev
```

### Start the frontend
```bash
cd client
npm start
```

Both must be running at the same time. Open http://localhost:3000 in your browser.
