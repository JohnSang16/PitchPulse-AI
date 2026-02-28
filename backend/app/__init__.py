from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={r"/api/*": {"origins": ["https://pitchpulse-ai-production.up.railway.app", "http://localhost:5173"]}})
    
    db.init_app(app)
    migrate.init_app(app, db)

    from app.api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    from app.models import Team, Player, Match

    return app