# PitchPulse AI

**Premier League match prediction powered by Monte Carlo simulation and Gemini AI.**

PitchPulse AI simulates 10,000 Premier League matches per prediction using real squad data and Poisson goal modelling, then synthesises the results into plain-English tactical insights via Google Gemini 2.5 Flash. The UI is built around a Noir Bloomberg aesthetic — jet black surfaces, champagne gold accents, and a live interactive formation visualiser.

<a href="https://pitch-pulse-ai.vercel.app/">View Live Demo →</a>

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Framer Motion, Vercel Analytics |
| Backend | Python 3 / Flask, Gunicorn |
| Database | PostgreSQL on AWS RDS |
| Simulation | NumPy Monte Carlo (10,000 iterations) |
| AI | Google Gemini 2.5 Flash |
| Backend hosting | AWS Elastic Beanstalk (Docker) |
| Frontend hosting | Vercel |
| CI/CD | GitHub Actions |

---

## Features

- **Win probability engine** — Monte Carlo simulation across 10,000 matches produces home win / draw / away win percentages and xG values derived from player rating distributions
- **Gemini AI Coach** — After each simulation, match data and formations are sent to Gemini 2.5 Flash which returns a structured tactical report: overview, key battle, home advice, and away advice
- **Formation visualiser** — Interactive SVG pitch with live formation control (4-4-2, 4-3-3, etc.) and FIFA-style player cards when squad data is loaded
- **Noir Bloomberg UI** — Full redesign with DM Mono / Playfair Display typography, gold-on-black token system, 260px sidebar layout, and a pinned stats bar

---

## Architecture

```
Browser
  └── React (Vercel)
        └── Flask API (AWS Elastic Beanstalk)
              ├── Football Data API  →  player ratings
              ├── AWS RDS PostgreSQL →  match history, team records
              ├── Monte Carlo engine →  win/draw/loss, xG
              └── Gemini 2.5 Flash   →  AI coaching report
```

**AWS Elastic Beanstalk deployment:**
- Flask is containerised with Docker and deployed to AWS EB's Docker platform
- Gunicorn serves with 2 workers; health checks run against `/api/hello`
- Schema migrations run automatically on container start via `flask db upgrade`
- Every push to `main` triggers an automated deploy via GitHub Actions

**AWS RDS (PostgreSQL):**
- Player ratings, team records, and match history persisted in a managed PostgreSQL instance
- Schema version-controlled with Flask-Migrate

---

## Local Development

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask --app run run

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Environment variables required in `backend/.env`:

```
DATABASE_URL=postgresql://...
FOOTBALL_API_KEY=...
GEMINI_API_KEY=...
```

---

## QA Testing

An automated QA agent black-box tests the live API and prints a formatted results table.

```bash
# Against local backend
python backend/tests/qa_agent.py

# Against production
python backend/tests/qa_agent.py --env production
```

| Test | Endpoint | Verifies |
|---|---|---|
| Health check | `GET /api/hello` | Server up, status = "ok" |
| List teams | `GET /api/teams` | 200, non-empty list with `id` and `name` |
| Get players | `GET /api/teams/{id}/players` | Returns player objects for valid team |
| Players 404 | `GET /api/teams/99999/players` | 404 for non-existent team |
| Simulate valid | `POST /api/simulate` | win/draw/loss sums to 100%, xG present |
| Simulate same team | `POST /api/simulate` | Valid result when same team selected twice |
| Simulate invalid IDs | `POST /api/simulate` | 400 for non-existent team IDs |
| Simulate missing body | `POST /api/simulate` | 400 for empty request body |
| Coach valid | `POST /api/coach` | 200, `insight` is a non-empty string |
| Coach invalid IDs | `POST /api/coach` | 400 for non-existent team IDs |

The QA agent runs automatically on every pull request via GitHub Actions after pytest passes. A failing API test blocks the PR from merging.

---

## Acknowledgements

- **Liam (Progsu Executive)** — for the advice to stop building generic apps and target a specific niche problem that demonstrates real engineering depth
- **Joey (Progsu President)** — for the "get started before you're ready" mindset that pushed this from whiteboard to deployment
- **Football API** — for the real-world squad data that powers the simulation engine
