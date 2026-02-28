from app import create_app
from app.extensions import db
from app.models.team import Team

app = create_app()

teams = [
    {"name": "Arsenal", "short_name": "ARS", "attack_rating": 2.1, "defense_rating": 1.8},
    {"name": "Manchester City", "short_name": "MCI", "attack_rating": 2.3, "defense_rating": 1.9},
    {"name": "Manchester United", "short_name": "MUN", "attack_rating": 1.8, "defense_rating": 1.6},
    {"name": "Liverpool", "short_name": "LIV", "attack_rating": 2.2, "defense_rating": 1.7},
    {"name": "Chelsea", "short_name": "CHE", "attack_rating": 1.9, "defense_rating": 1.7},
    {"name": "Tottenham", "short_name": "TOT", "attack_rating": 1.8, "defense_rating": 1.5},
    {"name": "Newcastle", "short_name": "NEW", "attack_rating": 1.7, "defense_rating": 1.6},
    {"name": "Aston Villa", "short_name": "AVL", "attack_rating": 1.8, "defense_rating": 1.6},
]

with app.app_context():
    for t in teams:
        team = Team(
            name=t["name"],
            short_name=t["short_name"],
            attack_rating=t["attack_rating"],
            defense_rating=t["defense_rating"]
        )
        db.session.add(team)
    db.session.commit()
    print("✅ Teams seeded successfully!")