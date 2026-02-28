from app.extensions import db

class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(20), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    attack_rating = db.Column(db.Float, default=1.5)
    defense_rating = db.Column(db.Float, default=1.5)
    x_position = db.Column(db.Float, default=0.0)
    y_position = db.Column(db.Float, default=0.0)

    team = db.relationship("Team", backref="players")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "position": self.position,
            "team_id": self.team_id,
            "attack_rating": self.attack_rating,
            "defense_rating": self.defense_rating,
            "x_position": self.x_position,
            "y_position": self.y_position
        }