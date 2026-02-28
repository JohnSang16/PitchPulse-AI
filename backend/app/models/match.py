from app.extensions import db
from datetime import datetime

class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)
    home_team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    away_team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    match_date = db.Column(db.DateTime, default=datetime.utcnow)
    home_win_pct = db.Column(db.Float)
    draw_pct = db.Column(db.Float)
    away_win_pct = db.Column(db.Float)
    simulations_run = db.Column(db.Integer, default=0)

    home_team = db.relationship("Team", foreign_keys=[home_team_id])
    away_team = db.relationship("Team", foreign_keys=[away_team_id])

    def to_dict(self):
        return {
            "id": self.id,
            "home_team": self.home_team.to_dict(),
            "away_team": self.away_team.to_dict(),
            "match_date": self.match_date.isoformat(),
            "home_win_pct": self.home_win_pct,
            "draw_pct": self.draw_pct,
            "away_win_pct": self.away_win_pct,
            "simulations_run": self.simulations_run
        }