# EduVault AI 🎓

> **Created by Alchemists** • *Verified Academic Ecosystem for Higher Education*  
> Modern, interactive AI-powered educational resource platform for students, educators, and institutions.  
> **© 2026 Alchemists. All rights reserved.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-3_Suite-8E75B2?logo=google)](https://ai.google.dev/)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features by Role](#-key-features-by-role)
  - [Student Super-Studio](#-for-students)
  - [Faculty Verification Pipeline](#-for-faculty--educators)
  - [Institutional Administration](#-for-institutions--administrators)
  - [Accessibility & Inclusion](#-accessibility--universal-inclusion)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation Instructions](#-installation-instructions)
- [Environment Variable Configuration](#-environment-variable-configuration)
- [Running the Development Server](#-running-the-development-server)
- [Building & Deploying to Production](#-building--deploying-to-production)
- [API & WebSocket Endpoints](#-api--websocket-endpoints)
- [Contributing Guide](#-contributing-guide)
  - [Development Workflow](#development-workflow)
  - [Code Standards](#code-standards)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [License & Attribution](#-license--attribution)

---

## 🌟 Overview

In higher education, the explosion of generic AI chatbots has created an acute integrity challenge: students struggle with unverified hallucinated explanations, while professors face fragmented, uncurated study materials.

**EduVault AI** solves this by establishing a **verified academic ecosystem**:
1. **Human-in-the-Loop AI Verification**: Course notes and problem sets submitted by instructors pass through an automated 4-stage validation rubric before earning institutional trust badges.
2. **Pedagogical AI Tutoring**: Rather than handing out quick ungrounded answers, the built-in Socratic AI Tutor guides students through first-principles reasoning, asymptotic proofs, and interactive diagrams.
3. **Institutional Trust Governance**: Universities and academic departments maintain complete auditability, role-based access control, and syllabus mapping.

---

## 🏛️ System Architecture

EduVault AI is architected as a full-stack unified Node.js/Express and Vite application:
- **Client**: Single-page application built on **React 19**, **TypeScript**, and **Tailwind CSS v4** featuring fluid visual diagram engines, Markdown rendering, and bilingual voice interfaces.
- **Backend Server (`server.ts`)**: Express service running on Node 22 that coordinates Google Gemini 3 models, proxies secure AI requests, handles file uploads, and streams full-duplex audio over **WebSockets (`/live`)**.
- **Dev Mode**: Express mounts Vite via `vite.middlewares` for instant hot module reloading and low-latency feedback.
- **Production Mode**: Express serves pre-compiled, gzip-optimized static assets from `dist/` with SPA fallback routing.

---

## ✨ Key Features by Role

### 👨‍🎓 For Students
- **Interactive Diagram Studio**: Visual step-by-step simulations for Data Structures & Algorithms (e.g., Singly/Doubly Linked Lists, Binary Search Trees, Heap memory mutations, CPU scheduling queues).
- **AI Academic Super-Studio & Tutor**: Multi-turn academic mentor supporting selectable pedagogical personas:
  - *Prof. Socratic*: Socratic inquiry, thought experiments, foundational axioms.
  - *Exam Prep Coach*: High-yield formulas, mark weighting rubrics, and the top 3 exam traps.
  - *Code & Systems Mentor*: Asymptotic complexity ($O(1), O(\log N), O(N)$), heap vs. stack memory traces, and production syntax.
- **AI Practice Exam & Quiz Generator**: Generate university-grade MCQs on any curriculum topic with instant scoring, confetti feedback, and rationales.
- **Smart Flashcard Decks**: Spaced-repetition flashcards dynamically generated for any STEM or humanities topic.
- **Live Voice Coaching**: Full-duplex voice tutor powered by `gemini-3.8-live` and WebSockets with bidirectional PCM audio.
- **Global Search (`⌘K` / `Ctrl+K`)**: Rapid keyword and conceptual query search across verified course modules.

### 👩‍🏫 For Faculty & Educators
- **4-Pillar AI Verification Pipeline**:
  1. *Factual Consistency & Truthfulness* (0–100% anomaly detection)
  2. *Curriculum Alignment* (ABET, UGC, and ACM CS2023 syllabus standards)
  3. *Pedagogical Clarity & Bloom's Taxonomy Index*
  4. *Academic Bias & Plagiarism Screen*
- **Resource Authoring & Versioning**: Draft notes with rich markdown, diagrams, and syllabus taxonomy tags.
- **Telemetry & Feedback**: Track student comprehension rates, ratings, and requested revisions.

### 🏛️ For Institutions & Administrators
- **Departmental Analytics**: Monitor faculty participation, review pass rates, and trust scores across academic departments.
- **Audit Logs**: Immutable records of AI verification reports and faculty verification stamps.
- **Institutional Privacy**: Enterprise-grade data protection with zero client-side credential leakage.

### ♿ Accessibility & Universal Inclusion
- Three selectable typography scales (Normal, Large, Extra Large).
- WCAG-compliant high-contrast dark mode.
- Dyslexia-friendly font toggling.
- Multilingual translation across English, Hindi (हिंदी), Spanish (Español), French (Français), German (Deutsch), Tamil (தமிழ்), and Telugu (తెలుగు).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Canvas Confetti |
| **Icons & UI** | Lucide React, Plus Jakarta Sans, JetBrains Mono |
| **Backend & Server** | Node.js 22, Express 4.21, `ws` (WebSockets), `dotenv` |
| **AI SDK** | `@google/genai` (Official Google Gen AI SDK) |
| **Models Used** | `gemini-3.8-flash` (General reasoning & rapid evaluation)<br>`gemini-3.1-pro-preview` (Deep proofs & verification)<br>`gemini-3.1-flash-lite` (High-speed generation)<br>`gemini-3.8-live` (Real-time live voice duplex) |
| **Build & Tooling** | Vite 8.3, TSX, TypeScript 7.0 |

---

## 📂 Project Structure

```text
eduvault-ai/
├── public/                 # Static assets and icons
├── src/
│   ├── components/
│   │   ├── auth/           # Role authentication & teacher verification flows
│   │   ├── common/         # Global search (⌘K), accessibility, diagrams, trust modals
│   │   ├── institution/    # Institutional admin dashboard & department analytics
│   │   ├── landing/        # High-conversion landing screen & role selector
│   │   ├── layout/         # Responsive navigation header with role switching
│   │   ├── student/        # Socratic tutor, diagram studio, quiz & flashcard deck
│   │   └── teacher/        # Upload drafts, AI verification pipeline modal, dashboard
│   ├── data/               # University curriculum seeds & verified sample notes
│   ├── services/           # Gemini AI client proxy, key storage, voice transcription
│   ├── types/              # Comprehensive TypeScript interfaces & role models
│   ├── utils/              # i18n localization dictionaries, formatting utilities
│   ├── App.tsx             # Root orchestration component & navigation state
│   ├── index.css           # Tailwind CSS imports and accessibility utility classes
│   └── main.tsx            # React 19 client entrypoint
├── .env.example            # Environment variable template
├── metadata.json           # AI Studio applet capabilities and permissions
├── package.json            # Scripts, dependencies, and configuration
├── server.ts               # Express API backend, WebSocket server & Vite proxy
├── tsconfig.json           # Strict TypeScript compiler options
└── vite.config.ts          # Vite build, Tailwind plugin, and path aliases
```

---

## 🚀 Installation Instructions

### Prerequisites

Ensure you have the following installed on your local workstation:
- **Node.js**: `v20.x` or `v22.x` (LTS recommended). Check with `node -v`.
- **npm**: `v9.x` or higher. Check with `npm -v`.
- **Git**: `git -v`.
- **Google Gemini API Key**: Create an API key at [Google AI Studio](https://aistudio.google.com/).

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/eduvault-ai.git
   cd eduvault-ai
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a local `.env` file by copying the template:
   ```bash
   cp .env.example .env
   ```

4. **Verify environment setup**:
   Confirm that `.env` contains your API key and desired port (see below).

---

## ⚙️ Environment Variable Configuration

Create a `.env` file in the project root with the following variables:

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | `""` | Your Google Gemini API key from AI Studio. Required for AI verification, tutoring, and quiz generation. |
| `PORT` | No | `3000` | The port on which the Express server and dev environment will listen. Automatically overridden in Cloud Run. |
| `APP_URL` | No | `http://localhost:3000` | Base public URL of the application. Used for canonical URLs and OAuth redirects. |
| `NODE_ENV` | No | `development` | Set to `production` in deployed environments to serve compiled static assets from `dist/`. |

### Example `.env` File:
```env
# Google Gemini AI Key
GEMINI_API_KEY="AIzaSyYourSecretKeyHere"

# Server Port
PORT=3000

# Base URL
APP_URL="http://localhost:3000"
```

> **Client Key Override**: Users can also input their own Gemini API key directly in the browser via the top navbar key dialog. This key is transmitted via the secure `X-Gemini-API-Key` HTTP header and never stored on the server.

---

## 💻 Running the Development Server

To launch the full-stack development environment:

```bash
npm run dev
```

### What Happens:
1. `server.ts` executes using `tsx`.
2. The Express server binds to `http://localhost:3000`.
3. Vite starts in middleware mode inside Express, serving the React client with rapid HMR.
4. WebSocket server initializes on `/live` for real-time voice streaming.
5. All `/api/*` endpoints are immediately active.

### Health Verification:
You can verify the backend status by executing:
```bash
curl http://localhost:3000/api/health
```
**Expected response:**
```json
{"status":"ok","service":"EduVault AI","timestamp":"2026-09-26T08:38:26.211Z"}
```

---

## 📦 Building & Deploying to Production

### 1. Build the Application
Compile the client application and optimize assets:
```bash
npm run build
```
This generates optimized CSS, minified JavaScript chunks, and the HTML entry point into the `/dist` directory.

### 2. Type-Check and Lint
Verify there are no syntax, type, or styling regressions:
```bash
npm run lint
```

### 3. Run Production Server Locally
```bash
npm start
```
This runs `node server.ts` directly on Node.js 22. In production mode, Express automatically serves static files from `dist/` and forwards unknown routes to `dist/index.html`.

### 4. Deploying to Google Cloud Run / Docker
EduVault AI is container-ready:
- Ensure `PORT` is dynamically accepted (handled automatically in `server.ts`).
- Set `NODE_ENV=production`.
- Provide `GEMINI_API_KEY` through Cloud Run Secret Manager or environment variables.
- Run `npm run build` during container build stage and `npm start` as the container entrypoint.

---

## 🔌 API & WebSocket Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and timestamp probe for deployment health checks |
| `POST` | `/api/ai/validate-key` | Verifies client-provided Gemini API key validity |
| `POST` | `/api/ai/verify` | Runs the 4-stage AI verification pipeline on an educational resource draft |
| `POST` | `/api/ai/chat` | Multi-turn conversational tutor endpoint with persona and grounding support |
| `POST` | `/api/ai/quiz` | Generates a 3-question MCQ assessment with explanations |
| `POST` | `/api/ai/flashcards` | Generates a 4-card spaced repetition deck for a topic |
| `POST` | `/api/ai/explain-simply` | Generates simplified intuition for a complex concept |
| `POST` | `/api/ai/summarize` | Summarizes long lecture notes into high-yield exam takeaways |
| `POST` | `/api/ai/translate` | Translates academic notes into one of 7 supported languages |
| `POST` | `/api/ai/transcribe` | Transcribes audio webm blobs via Gemini multimodal speech recognition |
| `WS` | `/live` | Bidirectional WebSocket for low-latency live spoken tutoring (`gemini-3.8-live`) |

---

## 🤝 Contributing Guide

We welcome contributions from educators, students, and software engineers! Follow these guidelines to contribute effectively:

### Development Workflow

1. **Fork the Repository**:
   Click the **Fork** button on GitHub to create your own copy of the repository.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/<your-username>/eduvault-ai.git
   cd eduvault-ai
   ```

3. **Create a Feature Branch**:
   Use descriptive branch names with a prefix:
   ```bash
   # For new features
   git checkout -b feature/interactive-matrix-diagram

   # For bug fixes
   git checkout -b bugfix/quiz-score-calculation
   ```

4. **Make Your Changes**:
   Implement your code adhering to the project's architecture and styling standards.

5. **Run Pre-Commit Checks**:
   Always run linting and build checks before committing:
   ```bash
   # Must exit with 0 errors
   npm run lint

   # Must compile cleanly
   npm run build
   ```

### Code Standards

- **TypeScript**: Strict typing required. Avoid `any` where possible. Use shared interfaces from `src/types/index.ts`.
- **Styling**: Use **Tailwind CSS v4** utility classes exclusively. Avoid separate CSS files or inline style objects.
- **Component Architecture**: Keep components modular, accessible, and functional. Place reusable widgets in `src/components/common/`.
- **AI Integration**: Always route AI requests through `src/services/aiService.ts` or server endpoints. Never hardcode credentials.
- **Accessibility**: Ensure buttons have descriptive labels, adequate color contrast, and keyboard navigation support (`Tab`, `Esc`, `Enter`).

### Submitting a Pull Request

1. Commit your changes with clear, semantic messages:
   ```bash
   git commit -m "feat(tutor): add LaTeX mathematical formula rendering"
   ```
2. Push your branch to GitHub:
   ```bash
   git push origin feature/interactive-matrix-diagram
   ```
3. Open a **Pull Request (PR)** against the `main` branch.
4. Fill out the PR template with:
   - A summary of the problem and your solution.
   - Screenshots or screencasts of UI changes.
   - Verification that `npm run lint` and `npm run build` passed.

---

## 📄 License & Attribution

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

### Attribution
**Created by Alchemists**  
© 2026 Alchemists. All rights reserved.
