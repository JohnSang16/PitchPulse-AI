from flask import Blueprint, jsonify, request
from app.models.team import Team
from app.services.monte_carlo import run_simulation
from app.services.ai_coach import get_coaching_insight

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