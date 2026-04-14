#!/usr/bin/env python3
"""
PitchPulse AI — QA Agent
========================
Runs a suite of black-box HTTP tests against the live API and prints a
formatted results table.

Usage:
    python backend/tests/qa_agent.py                  # local (default)
    python backend/tests/qa_agent.py --env production  # EB environment

Exit codes:
    0  all tests passed
    1  one or more tests failed
"""

import argparse
import sys
import time
import requests

# ── Targets ───────────────────────────────────────────────────────────────────
TARGETS = {
    "local":      "http://localhost:5173",
    "production": "http://pitchpulse-backend-env.eba-yhtgfwu8.us-east-1.elasticbeanstalk.com",
}

# ── ANSI colours (disabled on Windows CI runners automatically) ───────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

PASS_ICON = "✅"
FAIL_ICON = "❌"
SKIP_ICON = "⚠️ "


# ── Result accumulator ────────────────────────────────────────────────────────
class Result:
    def __init__(self, name: str, passed: bool, notes: str = ""):
        self.name   = name
        self.passed = passed
        self.notes  = notes


results: list[Result] = []


def record(name: str, passed: bool, notes: str = "") -> bool:
    results.append(Result(name, passed, notes))
    return passed


# ── Individual checks ─────────────────────────────────────────────────────────

def check_health(base: str) -> None:
    try:
        r = requests.get(f"{base}/api/hello", timeout=10)
        record(
            "GET /api/hello (health)",
            r.status_code == 200 and r.json().get("status") == "ok",
            f"status={r.status_code}",
        )
    except Exception as e:
        record("GET /api/hello (health)", False, str(e))


def check_get_teams(base: str) -> list[int]:
    """Returns list of discovered team IDs (empty list on failure)."""
    try:
        r = requests.get(f"{base}/api/teams", timeout=10)
        data = r.json()
        ok = (
            r.status_code == 200
            and isinstance(data, list)
            and len(data) > 0
            and all("id" in t and "name" in t for t in data)
        )
        record(
            "GET /api/teams",
            ok,
            f"{len(data)} teams returned" if ok else f"status={r.status_code}",
        )
        return [t["id"] for t in data] if ok else []
    except Exception as e:
        record("GET /api/teams", False, str(e))
        return []


def check_get_players(base: str, team_id: int) -> None:
    try:
        r = requests.get(f"{base}/api/teams/{team_id}/players", timeout=10)
        data = r.json()
        players = data.get("players", [])
        ok = (
            r.status_code == 200
            and "team" in data
            and isinstance(players, list)
            and len(players) > 0
        )
        record(
            f"GET /api/teams/{{id}}/players",
            ok,
            f"{len(players)} players returned" if ok else f"status={r.status_code}",
        )
    except Exception as e:
        record("GET /api/teams/{id}/players", False, str(e))


def check_players_not_found(base: str) -> None:
    try:
        r = requests.get(f"{base}/api/teams/99999/players", timeout=10)
        record(
            "GET /api/teams/99999/players → 404",
            r.status_code == 404,
            f"got {r.status_code}",
        )
    except Exception as e:
        record("GET /api/teams/99999/players → 404", False, str(e))


def check_simulate_valid(base: str, home_id: int, away_id: int) -> None:
    try:
        r = requests.post(
            f"{base}/api/simulate",
            json={"home_team_id": home_id, "away_team_id": away_id},
            timeout=30,
        )
        data = r.json()
        required = {
            "home_team", "away_team",
            "home_win_pct", "draw_pct", "away_win_pct",
            "simulations", "home_expected_goals", "away_expected_goals",
        }
        total = (
            data.get("home_win_pct", 0)
            + data.get("draw_pct", 0)
            + data.get("away_win_pct", 0)
        )
        sums_ok = abs(total - 100.0) <= 0.5
        ok = r.status_code == 200 and required.issubset(data.keys()) and sums_ok
        record(
            "POST /api/simulate (valid IDs)",
            ok,
            f"sums to {total:.1f}%" if ok else f"status={r.status_code}, total={total:.1f}%",
        )
    except Exception as e:
        record("POST /api/simulate (valid IDs)", False, str(e))


def check_simulate_same_team(base: str, team_id: int) -> None:
    try:
        r = requests.post(
            f"{base}/api/simulate",
            json={"home_team_id": team_id, "away_team_id": team_id},
            timeout=30,
        )
        data = r.json()
        total = (
            data.get("home_win_pct", 0)
            + data.get("draw_pct", 0)
            + data.get("away_win_pct", 0)
        )
        ok = r.status_code == 200 and abs(total - 100.0) <= 0.5
        record(
            "POST /api/simulate (same team twice)",
            ok,
            f"sums to {total:.1f}%" if ok else f"status={r.status_code}",
        )
    except Exception as e:
        record("POST /api/simulate (same team twice)", False, str(e))


def check_simulate_invalid_ids(base: str) -> None:
    try:
        r = requests.post(
            f"{base}/api/simulate",
            json={"home_team_id": 99998, "away_team_id": 99999},
            timeout=10,
        )
        record(
            "POST /api/simulate (invalid IDs) → 400",
            r.status_code == 400,
            f"got {r.status_code}",
        )
    except Exception as e:
        record("POST /api/simulate (invalid IDs) → 400", False, str(e))


def check_simulate_missing_body(base: str) -> None:
    try:
        r = requests.post(f"{base}/api/simulate", json={}, timeout=10)
        record(
            "POST /api/simulate (missing body) → 400",
            r.status_code == 400,
            f"got {r.status_code}",
        )
    except Exception as e:
        record("POST /api/simulate (missing body) → 400", False, str(e))


def check_coach_valid(base: str, home_id: int, away_id: int) -> None:
    try:
        r = requests.post(
            f"{base}/api/coach",
            json={
                "home_team_id": home_id,
                "away_team_id": away_id,
                "home_formation": "4-4-2",
                "away_formation": "4-3-3",
            },
            timeout=60,  # Gemini can be slow
        )
        data = r.json()
        insight = data.get("insight", "")
        ok = r.status_code == 200 and isinstance(insight, str) and len(insight) > 0
        record(
            "POST /api/coach (valid IDs)",
            ok,
            f"insight: {len(insight)} chars" if ok else f"status={r.status_code}",
        )
    except Exception as e:
        record("POST /api/coach (valid IDs)", False, str(e))


def check_coach_invalid_ids(base: str) -> None:
    try:
        r = requests.post(
            f"{base}/api/coach",
            json={"home_team_id": 99998, "away_team_id": 99999},
            timeout=10,
        )
        record(
            "POST /api/coach (invalid IDs) → 400",
            r.status_code == 400,
            f"got {r.status_code}",
        )
    except Exception as e:
        record("POST /api/coach (invalid IDs) → 400", False, str(e))


# ── Table printer ─────────────────────────────────────────────────────────────

def print_table(env: str, base: str, elapsed: float) -> int:
    col_test  = 42
    col_status = 8
    col_notes = 28

    border_top    = f"┌{'─' * col_test}┬{'─' * col_status}┬{'─' * col_notes}┐"
    border_head   = f"├{'─' * col_test}┼{'─' * col_status}┼{'─' * col_notes}┤"
    border_bottom = f"└{'─' * col_test}┴{'─' * col_status}┴{'─' * col_notes}┘"

    def row(test: str, status: str, notes: str) -> str:
        t = test[:col_test - 1].ljust(col_test - 1)
        s = status.ljust(col_status - 1)
        n = notes[:col_notes - 1].ljust(col_notes - 1)
        return f"│ {t}│ {s}│ {n}│"

    print()
    print(f"{BOLD}PitchPulse AI — QA Report{RESET}")
    print(f"Environment : {YELLOW}{env}{RESET}  ({base})")
    print(f"Completed in: {elapsed:.1f}s")
    print()
    print(border_top)
    print(row("Test", "Status", "Notes"))
    print(border_head)

    passed = 0
    failed = 0
    for r in results:
        icon  = PASS_ICON if r.passed else FAIL_ICON
        color = GREEN if r.passed else RED
        print(row(r.name, icon, r.notes))
        if r.passed:
            passed += 1
        else:
            failed += 1

    print(border_bottom)
    summary_color = GREEN if failed == 0 else RED
    print(f"\n{summary_color}{BOLD}Total: {passed} passed, {failed} failed{RESET}\n")

    return 0 if failed == 0 else 1


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(description="PitchPulse AI QA Agent")
    parser.add_argument(
        "--env",
        choices=["local", "production"],
        default="local",
        help="Target environment (default: local)",
    )
    args   = parser.parse_args()
    base   = TARGETS[args.env]
    start  = time.time()

    print(f"\nRunning QA suite against {YELLOW}{args.env}{RESET} → {base}\n")

    # ── 1. Health check ──────────────────────────────────────────────────────
    check_health(base)

    # ── 2. Teams ─────────────────────────────────────────────────────────────
    team_ids = check_get_teams(base)

    if len(team_ids) < 2:
        # Can't run team-dependent tests; record skips and bail out
        for name in [
            "GET /api/teams/{id}/players",
            "GET /api/teams/99999/players → 404",
            "POST /api/simulate (valid IDs)",
            "POST /api/simulate (same team twice)",
            "POST /api/simulate (invalid IDs) → 400",
            "POST /api/simulate (missing body) → 400",
            "POST /api/coach (valid IDs)",
            "POST /api/coach (invalid IDs) → 400",
        ]:
            record(name, False, "skipped — no teams available")
        return print_table(args.env, base, time.time() - start)

    home_id = team_ids[0]
    away_id = team_ids[1]

    # ── 3. Players ───────────────────────────────────────────────────────────
    check_get_players(base, home_id)
    check_players_not_found(base)

    # ── 4. Simulate ──────────────────────────────────────────────────────────
    check_simulate_valid(base, home_id, away_id)
    check_simulate_same_team(base, home_id)
    check_simulate_invalid_ids(base)
    check_simulate_missing_body(base)

    # ── 5. Coach ─────────────────────────────────────────────────────────────
    check_coach_valid(base, home_id, away_id)
    check_coach_invalid_ids(base)

    return print_table(args.env, base, time.time() - start)


if __name__ == "__main__":
    sys.exit(main())
