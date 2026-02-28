from flask import Blueprint, jsonify
from app.models.team import Team

api_bp = Blueprint("api", __name__)

@api_bp.route("/hello")
def hello():
    return jsonify({"message": "PitchPulse AI is alive ⚽", "status": "ok"})

@api_bp.route("/teams")
def get_teams():
    teams = Team.query.all()
    return jsonify([team.to_dict() for team in teams])