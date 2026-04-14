from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, migrate

def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from app.api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    from app.models import Team, Player, Match

    with app.app_context():
        if not app.config.get("TESTING"):
            from app.models.team import Team as TeamModel
            if TeamModel.query.count() == 0:
                print("🌱 No teams found, seeding database...")
                from app.api.routes import seed_db
                seed_db()
                print("✅ Database seeded!")

    return app