import requests
import os
from dotenv import load_dotenv
from app import create_app
from app.extensions import db
from app.models.team import Team
from app.models.player import Player

load_dotenv()

API_KEY = os.environ.get("API_FOOTBALL_KEY")
BASE_URL = "https://v3.football.api-sports.io"
HEADERS = {"x-apisports-key": API_KEY}

PL_TEAMS = {
    "Arsenal":          {"api_id": 42,  "attack": 2.1, "defense": 1.8},
    "Manchester City":  {"api_id": 50,  "attack": 2.3, "defense": 1.9},
    "Liverpool":        {"api_id": 40,  "attack": 2.2, "defense": 1.7},
    "Manchester United":{"api_id": 33,  "attack": 1.8, "defense": 1.6},
    "Chelsea":          {"api_id": 49,  "attack": 1.9, "defense": 1.7},
    "Tottenham":        {"api_id": 47,  "attack": 1.8, "defense": 1.5},
    "Newcastle":        {"api_id": 34,  "attack": 1.7, "defense": 1.6},
    "Aston Villa":      {"api_id": 66,  "attack": 1.8, "defense": 1.6},
}
POSITION_MAP = {
    "Goalkeeper": "GK",
    "Defender": "CB",
    "Midfielder": "CM",
    "Attacker": "ST"
}

# How many of each position we want
POSITION_LIMITS = {
    "Goalkeeper": 1,
    "Defender": 4,
    "Midfielder": 4,
    "Attacker": 2
}

def fetch_squad(team_id):
    url = f"{BASE_URL}/players/squads"
    res = requests.get(url, headers=HEADERS, params={"team": team_id})
    data = res.json()
    if data.get("response"):
        return data["response"][0]["players"]
    return []

def pick_starting_11(players):
    counts = {"Goalkeeper": 0, "Defender": 0, "Midfielder": 0, "Attacker": 0}
    starting_11 = []

    for p in players:
        pos = p.get("position", "Midfielder")
        if pos in counts and counts[pos] < POSITION_LIMITS[pos]:
            starting_11.append(p)
            counts[pos] += 1

        if len(starting_11) == 11:
            break

    return starting_11

app = create_app()

with app.app_context():
    Player.query.delete()
    Team.query.delete()
    db.session.commit()

    for team_name, team_info in PL_TEAMS.items():
        print(f"Fetching {team_name}...")

        team = Team(
            name=team_name,
            short_name=team_name[:3].upper(),
            attack_rating=team_info["attack"],
            defense_rating=team_info["defense"]
        )
        db.session.add(team)
        db.session.flush()

        all_players = fetch_squad(team_info["api_id"])
        starting_11 = pick_starting_11(all_players)

        for p in starting_11:
            position = POSITION_MAP.get(p.get("position", "Midfielder"), "CM")
            player = Player(
                name=p["name"],
                position=position,
                attack_rating=1.8,
                defense_rating=1.8,
                team_id=team.id
            )
            db.session.add(player)

        print(f"  ✅ Added {len(starting_11)} players for {team_name}")

    db.session.commit()
    print("\n✅ All teams and players seeded from API-Football!")