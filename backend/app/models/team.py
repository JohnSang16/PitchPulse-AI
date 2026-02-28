from app.extensions import db

class Team(db.Model):
    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_name = db.Column(db.String(10), nullable=False)
    attack_rating = db.Column(db.Float, default=1.5)
    defense_rating = db.Column(db.Float, default=1.5)
    logo_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "short_name": self.short_name,
            "attack_rating": self.attack_rating,
            "defense_rating": self.defense_rating,
            "logo_url": self.logo_url
        }