# PitchPulse AI

Premier League match prediction powered by Poisson Monte Carlo simulation and Gemini AI.

Most sports prediction tools are black boxes: a percentage with no reasoning behind it. PitchPulse runs 1,000 Poisson-distributed match simulations per prediction using real squad ratings drawn from live API data, then feeds the full simulation output to Gemini 2.5 Flash to generate a structured tactical report. The UI is built around a Noir Bloomberg aesthetic: jet black surfaces, champagne gold accents, and an interactive SVG formation visualiser with FIFA-style player cards.

**[View Live Demo](https://pitch-pulse-ai.vercel.app/)**

---

## The Problem

Football fans and analysts want to understand *why* a team wins, not just *if* they win. Generic prediction sites return a single number backed by historical win rates. They don't model player quality, tactical formations, or the probabilistic spread of outcomes across thousands of simulated matches.

PitchPulse treats a match as what it actually is: a stochastic event. Two teams enter with attack and defense ratings derived from real player data. The engine runs 1,000 independent simulations using Poisson goal models and surfaces the full probability distribution, including expected goals, then uses Gemini to synthesize those numbers into actionable tactical insights.

---

## What It Does

Four data layers work together for every prediction:

**Squad Data** Real player ratings (attack, defense) fetched from the API-Football squad endpoint and persisted in PostgreSQL. Eight Premier League clubs with 11-player starting lineups, position-limited to 1 GK / 4 DEF / 4 MID / 2 ATK.

**Simulation Engine** 1,000 independent matches simulated per prediction using NumPy Poisson sampling. Home advantage baked in at 1.1x. Expected goals derived from the ratio of attack rating to opposing defense rating. Output: home win %, draw %, away win %, xG for both sides.

**Gemini AI Coach** After simulation, match data and chosen formations are sent to Gemini 2.5 Flash. The model returns a structured tactical report: a 2-3 sentence overview, the key tactical battle, one recommendation for the home side, and one for the away side.

**Formation Visualiser** Interactive SVG pitch renders both squads in real time. Formation selector (4-4-2, 4-3-3, etc.) repositions nodes live. Home players: full gold. Away players: ghost-gold outlines. FIFA-style player cards on hover when squad data is loaded.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Framer Motion, Vercel Analytics |
| Backend | Python 3 / Flask, Gunicorn |
| Database | PostgreSQL on AWS RDS |
| Simulation | NumPy Poisson Monte Carlo (1,000 iterations) |
| AI | Google Gemini 2.5 Flash |
| Backend hosting | AWS Elastic Beanstalk (Docker) |
| Frontend hosting | Vercel |
| CI/CD | GitHub Actions |

---

## Architecture

```
Browser
  └── React + Vite (Vercel)
        └── /api proxy  →  Flask API (AWS Elastic Beanstalk)
                              ├── API-Football         →  real squad data
                              ├── AWS RDS PostgreSQL   →  teams, players, ratings
                              ├── Monte Carlo engine   →  win/draw/loss, xG
                              └── Gemini 2.5 Flash     →  tactical coaching report
```

**Simulation pipeline (per request):**

```
POST /api/coach
  → load home_team, away_team from PostgreSQL
  → compute home_xG = home_attack * (1 / away_defense) * 1.1
  → compute away_xG = away_attack * (1 / home_defense)
  → np.random.poisson(home_xG, 1000), np.random.poisson(away_xG, 1000)
  → count outcomes, compute percentages
  → send formation + simulation result to Gemini 2.5 Flash
  → return { home_win_pct, draw_pct, away_win_pct, home_xG, away_xG, insight }
```

**AWS Elastic Beanstalk:**
- Flask containerised with Docker, deployed to EB Docker platform
- Gunicorn with 2 workers; health checks run against `/api/hello`
- Schema migrations run automatically on container start via `flask db upgrade`
- Every push to `main` triggers an automated deploy via GitHub Actions

**AWS RDS (PostgreSQL):**
- Player ratings, team records, and match history in a managed PostgreSQL instance
- Schema version-controlled with Flask-Migrate

---

## Project Structure

```
pitchpulse/
  backend/
    app/
      api/
        routes.py              all API endpoints: /teams, /simulate, /coach, /seed-db
      models/
        team.py                Team: name, short_name, attack_rating, defense_rating
        player.py              Player: name, position, ratings, x/y formation coords
        match.py               Match history schema
      services/
        monte_carlo.py         Poisson simulation engine (NumPy)
        ai_coach.py            Gemini 2.5 Flash tactical analysis
      config.py                env-based Flask config
      extensions.py            SQLAlchemy, Flask-Migrate instances
    migrations/                Alembic schema migrations
    tests/
      qa_agent.py              black-box QA agent (10 tests, local + production)
      test_api.py              pytest API integration tests
      test_monte_carlo.py      unit tests for simulation engine
    Dockerfile
    requirements.txt
    run.py
  frontend/
    src/
      App.jsx                  main app: team selectors, formation controls, results
      index.css                Noir Bloomberg design tokens + layout
    package.json
    vite.config.ts
  next-app/                    TypeScript migration in progress
  vercel.json                  /api proxy rewrite to Elastic Beanstalk
  STYLE.md                     full Noir Bloomberg design system reference
```

---

## QA Testing

An automated QA agent black-box tests the live API and prints a formatted results table. Runs automatically on every pull request via GitHub Actions after pytest passes. A failing test blocks the PR from merging.

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

---

## Local Development

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
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

To seed the database with squad data from API-Football:

```bash
GET /api/seed-db      # fetches real squads from API-Football, seeds teams + players
GET /api/seed-missing-players  # backfills manually rated players for existing teams
```

---

## Deployment

**Backend:** Elastic Beanstalk via GitHub Actions

```bash
# Triggered automatically on push to main
# Manual deploy:
eb deploy pitchpulse-env --region us-east-1
```

**Frontend:** Vercel. The root `vercel.json` rewrites `/api/*` to the Elastic Beanstalk URL, so the frontend never needs CORS preflight for same-origin requests.

**CORS:** Scoped to known origins only. The backend rejects requests from origins not in the allowlist.

---

## Design System

Full reference in `STYLE.md`. The short version:

| Token | Value |
|---|---|
| Page background | `#080808` |
| Surface / card | `#0d0d0d` |
| Primary accent | `#c9a84c` (champagne gold) |
| Primary text | `#f0ead6` (warm off-white) |
| Header font | Playfair Display 300 |
| UI / data font | DM Mono |
| Max border-radius | 3px |

No gradients. No shadows. No white. Flat fills only.

---

## Acknowledgements

- **Liam (Progsu Executive)** for the advice to stop building generic apps and target a specific niche problem that demonstrates real engineering depth
- **Joey (Progsu President)** for the "get started before you're ready" mindset that pushed this from whiteboard to deployment
- **API-Football** for the real-world squad data powering the simulation engine
