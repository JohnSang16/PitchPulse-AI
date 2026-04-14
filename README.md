## ⚽ PitchPulse AI
<strong>_Predictive Team-Chemistry & Win-Probability Engine_</strong>
PitchPulse AI is a high-performance soccer analytics platform designed to provide real-time tactical insights. By leveraging Monte Carlo simulations and AI-driven analysis, it helps coaches and analysts predict match outcomes and optimize team formations based on chemistry and historical performance data.
<br>  <a href = https://pitch-pulse-ai.vercel.app/><u>🚀 View Live Demo on Vercel 
</u></a>

## 📖 Overview
<strong>PitchPulse AI</strong> is a specialized analytics web application designed to bridge the gap between complex data modeling and actionable sports strategy. Built with a focus on clean UI and seamless performance, it provides users with a direct connection to predictive tactical data through a modern, intuitive interface.

## 📦 Technologies
<ul>
  <li><strong>Backend</strong>: Python 3 with Flask Framework</li>
  <li><strong>Frontend</strong>: React.js, Tailwind CSS, and Asynchronous JavaScript (Fetch API)</li>
  <li><strong>Database</strong>: PostgreSQL </li>
  <li><strong>Deployment</strong>:  Vercel (Frontend) and Railway (Backend/Database)</li>
  <li><strong>Modeling</strong>:Monte Carlo Simulations for stochastic match dynamics</li>
</ul>



## ✨ Features
<ul>
  <li><strong>Predictive Win-Probability:</strong> A custom engine that calculates real-time match outcomes based on weighted variables.
</li>
  <li><strong>Tactical AI Assistant: </strong> LLM-powered agents that interpret simulation data to provide human-readable formation advice.
</li>
  <li><strong> Interactive Pitch Map: </strong>A dynamic visualization tool for player positioning and chemistry links.
)</li>
  <li><strong>Contextual Feedback:</strong> Unlike standard stats tools, this app uses a mapping system to understand specific squad situations and provide relevant tactical encouragement.
</li>
</ul>


## ⌨️ Navigation
<ul>
  <li><strong>Squad Input:</strong> Enter player data or select formations to find tailored win-probabilities.
</li>
  <li><strong>The Tactical Pitch:</strong>  Interact with the central field icon to trigger the get-tactical-analysis logic.
 </li>
  <li><strong>Dynamic Probability Display:</strong> View your results instantly in the highlighted dashboard area without page reloads.
</li>
</ul>



## 💡 Project Motivation
PitchPulse AI was born from a desire to solve a specific, high-stakes problem: the "information overload" faced by modern soccer coaches during live match-play. While professional teams have access to massive amounts of data, the ability to translate that data into real-time, actionable tactical shifts remains a significant bottleneck.

As a Computer Science student and a lifelong soccer enthusiast, I recognized that <strong>stochastic modeling and AI</strong> could bridge this gap. I targeted the coaching workflow specifically because it requires a unique blend of analytical precision and human intuition.

On a technical level, this project allowed me to move beyond basic CRUD applications and explore the intersection of <strong>predictive mathematics and scalable systems</strong>. By implementing Monte Carlo simulations in a Flask environment and delivering them through an optimized React interface, I’ve created a tool that doesn't just display stats—it predicts outcomes and offers strategic counsel. This is a reflection of my commitment to using technology to solve complex, niche problems in industries I am passionate about.

## 🧪 QA Testing

PitchPulse AI includes an automated QA agent that black-box tests the live API and prints a formatted results table.

### Running locally

```bash
# Start the Flask backend first (in one terminal)
cd backend && flask --app run run

# Then run the QA agent (in another terminal)
python backend/tests/qa_agent.py
```

### Running against production

```bash
python backend/tests/qa_agent.py --env production
```

### What each test covers

| Test | Endpoint | What it verifies |
|------|----------|-----------------|
| Health check | `GET /api/hello` | Server is up, status = "ok" |
| List teams | `GET /api/teams` | 200, non-empty list, each item has `id` and `name` |
| Get players | `GET /api/teams/{id}/players` | 200, returns player objects for a valid team |
| Players 404 | `GET /api/teams/99999/players` | Returns 404 for a non-existent team |
| Simulate valid | `POST /api/simulate` | 200, win/draw/loss sums to 100%, xG values present |
| Simulate same team | `POST /api/simulate` | Still returns valid result when same team selected twice |
| Simulate invalid IDs | `POST /api/simulate` | Returns 400 for non-existent team IDs |
| Simulate missing body | `POST /api/simulate` | Returns 400 for empty request body |
| Coach valid | `POST /api/coach` | 200, `insight` field is a non-empty string |
| Coach invalid IDs | `POST /api/coach` | Returns 400 for non-existent team IDs |

### CI integration

The QA agent runs automatically on every pull request via GitHub Actions (after pytest passes). A failing API test will block the PR from merging.

---

## 🤝 Acknowledgements
Special Thanks to:
<ul>
  <li><strong>Liam (Progsu Executive): </strong> For the pivotal advice to stop building "generic" apps and instead target a specific, niche problem that demonstrates true engineering depth.
 </li>
  <li><strong>Joey (Progsu President):</strong>  For instilling in me a "get started before you're ready" mindset, which was the final push needed to move this from a whiteboard concept to a functional deployment.
  <li><strong>The Free Football API: </strong> For providing the essential real-world data feeds that allowed this engine to move beyond static testing and into live predictive modeling.
</li>
</ul>




