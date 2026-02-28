from flask import Blueprint, jsonify, request
from app.models.team import Team
from app.services.monte_carlo import run_simulation
from app.services.ai_coach import get_coaching_insight
import os

api_bp = Blueprint("api", __name__)

@api_bp.route("/hello")
def hello():
    return jsonify({"message": "PitchPulse AI is alive ⚽", "status": "ok"})

@api_bp.route("/teams")
def get_teams():
    teams = Team.query.all()
    return jsonify([team.to_dict() for team in teams])

@api_bp.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()
    
    home_team = Team.query.get(data.get("home_team_id"))
    away_team = Team.query.get(data.get("away_team_id"))

    if not home_team or not away_team:
        return jsonify({"error": "Invalid team IDs"}), 400

    result = run_simulation(
        home_attack=home_team.attack_rating,
        home_defense=home_team.defense_rating,
        away_attack=away_team.attack_rating,
        away_defense=away_team.defense_rating
    )

    return jsonify({
        "home_team": home_team.name,
        "away_team": away_team.name,
        **result
    })

@api_bp.route("/coach", methods=["POST"])
def coach():
    data = request.get_json()

    home_team = Team.query.get(data.get("home_team_id"))
    away_team = Team.query.get(data.get("away_team_id"))

    if not home_team or not away_team:
        return jsonify({"error": "Invalid team IDs"}), 400

    simulation_result = run_simulation(
        home_attack=home_team.attack_rating,
        home_defense=home_team.defense_rating,
        away_attack=away_team.attack_rating,
        away_defense=away_team.defense_rating
    )

    insight = get_coaching_insight(
        home_team=home_team.name,
        away_team=away_team.name,
        home_formation=data.get("home_formation", "4-4-2"),
        away_formation=data.get("away_formation", "4-3-3"),
        simulation_result=simulation_result
    )

    return jsonify({
        "home_team": home_team.name,
        "away_team": away_team.name,
        "insight": insight,
        **simulation_result
    })

@api_bp.route("/teams/<int:team_id>/players")
def get_team_players(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    return jsonify({
        "team": team.to_dict(),
        "players": [p.to_dict() for p in team.players]
    })

@api_bp.route("/seed-db", methods=["GET"])
def seed_db():
    from app.models.player import Player
    import requests as req

    API_KEY = os.environ.get("API_FOOTBALL_KEY")
    BASE_URL = "https://v3.football.api-sports.io"
    HEADERS = {"x-apisports-key": API_KEY}

    PL_TEAMS = {
        "Arsenal":           {"api_id": 42,  "attack": 2.1, "defense": 1.8, "short": "ARS"},
        "Manchester City":   {"api_id": 50,  "attack": 2.3, "defense": 1.9, "short": "MCI"},
        "Liverpool":         {"api_id": 40,  "attack": 2.2, "defense": 1.7, "short": "LIV"},
        "Manchester United": {"api_id": 33,  "attack": 1.8, "defense": 1.6, "short": "MUN"},
        "Chelsea":           {"api_id": 49,  "attack": 1.9, "defense": 1.7, "short": "CHE"},
        "Tottenham":         {"api_id": 47,  "attack": 1.8, "defense": 1.5, "short": "TOT"},
        "Newcastle":         {"api_id": 34,  "attack": 1.7, "defense": 1.6, "short": "NEW"},
        "Aston Villa":       {"api_id": 66,  "attack": 1.8, "defense": 1.6, "short": "AVL"},
    }

    POSITION_MAP = {
        "Goalkeeper": "GK",
        "Defender": "CB",
        "Midfielder": "CM",
        "Attacker": "ST"
    }

    POSITION_LIMITS = {
        "Goalkeeper": 1,
        "Defender": 4,
        "Midfielder": 4,
        "Attacker": 2
    }

    PLAYER_RATINGS = {
        "Kepa": (1.45, 1.95), "R. Calafiori": (1.72, 1.90),
        "Gabriel Magalhães": (1.55, 2.05), "P. Hincapié": (1.62, 1.88),
        "M. Lewis-Skelly": (1.68, 1.82), "M. Dowman": (1.60, 1.75),
        "E. Eze": (2.05, 1.62), "I. Ibrahim": (1.65, 1.78),
        "Mikel Merino": (1.88, 1.92), "B. Bailey-Joseph": (1.75, 1.55),
        "Gabriel Jesus": (2.05, 1.68), "M. Bettinelli": (1.40, 1.88),
        "R. Aït-Nouri": (1.78, 1.85), "N. Aké": (1.58, 1.95),
        "Max Alleyne": (1.55, 1.72), "K. Braithwaite": (1.62, 1.70),
        "R. Cherki": (2.08, 1.62), "P. Foden": (2.18, 1.72),
        "Charlie Gray": (1.58, 1.60), "M. Kovačić": (1.92, 1.88),
        "J. Doku": (2.12, 1.58), "E. Haaland": (2.48, 1.45),
        "Alisson Becker": (1.42, 2.10), "C. Bradley": (1.82, 1.85),
        "J. Gomez": (1.62, 1.92), "M. Kerkez": (1.75, 1.85),
        "I. Konaté": (1.58, 2.02), "W. Endo": (1.78, 1.95),
        "R. Gravenberch": (1.88, 1.92), "C. Jones": (1.85, 1.78),
        "J. Frimpong": (2.05, 1.88), "F. Chiesa": (2.08, 1.62),
        "J. Danns": (1.72, 1.65), "A. Bayındır": (1.42, 1.88),
        "Diogo Dalot": (1.88, 1.92), "P. Dorgu": (1.85, 1.82),
        "T. Fredricson": (1.55, 1.82), "A. Heaven": (1.50, 1.75),
        "Casemiro": (1.78, 2.08), "Bruno Fernandes": (2.15, 1.72),
        "J. Fletcher": (1.60, 1.72), "T. Fletcher": (1.58, 1.70),
        "S. Lacey": (1.65, 1.62), "Bendito Mantato": (1.70, 1.55),
        "F. Jörgensen": (1.42, 1.95), "Joshua Kofi Acheampong": (1.75, 1.85),
        "T. Adarabioyo": (1.55, 1.92), "B. Badiashile": (1.52, 1.95),
        "T. Chalobah": (1.62, 1.88), "Andrey Santos": (1.78, 1.85),
        "M. Caicedo": (1.82, 2.02), "Dário Essugo": (1.72, 1.82),
        "E. Fernández": (1.95, 1.85), "L. Delap": (2.05, 1.58),
        "Estêvão": (2.15, 1.62), "K. Danso": (1.55, 1.95),
        "B. Davies": (1.62, 1.90), "R. Drăgușin": (1.55, 1.92),
        "A. Gray": (1.50, 1.85), "D. Spence": (1.75, 1.82),
        "R. Bentancur": (1.85, 1.92), "L. Bergvall": (1.82, 1.85),
        "X. Simons": (2.05, 1.78), "R. Kolo Muani": (2.08, 1.62),
        "Aidan Harris": (1.65, 1.58), "B. Austin": (1.88, 1.65),
        "J. Byfield": (1.72, 1.58), "S. Botman": (1.55, 2.02),
        "D. Burn": (1.58, 1.92), "L. Hall": (1.72, 1.82),
        "E. Krafth": (1.68, 1.82), "S. Alabi": (1.45, 1.85),
        "Bruno Guimarães": (2.02, 2.08), "Joelinton": (1.92, 1.88),
        "L. Miley": (1.75, 1.78), "J. Murphy": (1.95, 1.72),
        "S. Neave": (1.70, 1.65), "M. Bizot": (1.42, 1.92),
        "L. Bogarde": (1.58, 1.88), "M. Cash": (1.78, 1.88),
        "L. Digne": (1.75, 1.85), "Andrés García": (1.62, 1.82),
        "E. Konsa": (1.58, 2.02), "R. Barkley": (1.92, 1.82),
        "E. Buendía": (2.02, 1.72), "B. Burrows": (1.68, 1.78),
        "T. Abraham": (2.05, 1.62), "Alysson Edward": (1.65, 1.70),
    }

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

    try:
        Player.query.delete()
        Team.query.delete()
        db.session.commit()

        for team_name, info in PL_TEAMS.items():
            team = Team(
                name=team_name,
                short_name=info["short"],
                attack_rating=info["attack"],
                defense_rating=info["defense"]
            )
            db.session.add(team)
            db.session.flush()

            res = req.get(f"{BASE_URL}/players/squads",
                         headers=HEADERS,
                         params={"team": info["api_id"]})
            data = res.json()
            all_players = data["response"][0]["players"] if data.get("response") else []
            starting_11 = pick_starting_11(all_players)

            for p in starting_11:
                position = POSITION_MAP.get(p.get("position", "Midfielder"), "CM")
                atk, def_ = PLAYER_RATINGS.get(p["name"], (1.75, 1.75))
                player = Player(
                    name=p["name"],
                    position=position,
                    attack_rating=atk,
                    defense_rating=def_,
                    team_id=team.id
                )
                db.session.add(player)

        db.session.commit()
        return jsonify({"message": "✅ Database seeded successfully!"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500