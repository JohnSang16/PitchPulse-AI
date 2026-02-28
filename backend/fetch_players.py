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
    "Arsenal": 42,
    "Manchester City": 50,
    "Liverpool": 40,
    "Manchester United": 33,
    "Chelsea": 49,
    "Tottenham": 47,
    "Newcastle": 34,
    "Aston Villa": 66,
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

    for team_name, team_api_id in PL_TEAMS.items():
        print(f"Fetching {team_name}...")

        team = Team(
            name=team_name,
            short_name=team_name[:3].upper(),
            attack_rating=1.8,
            defense_rating=1.8
        )
        db.session.add(team)
        db.session.flush()

        all_players = fetch_squad(team_api_id)
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