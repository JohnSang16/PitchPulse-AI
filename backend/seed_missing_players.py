"""
Seed players for all teams that currently have no players in the database.
Ratings are pulled from manual_ratings.py; positions are defined here.
Run from the backend/ directory:
    python seed_missing_players.py
"""

from app import create_app
from app.extensions import db
from app.models.player import Player
from app.models.team import Team

app = create_app()

# Full squad data: team_short_name -> list of (name, position, attack, defense)
SQUADS = {
    "LIV": [
        ("Alisson Becker",  "GK", 1.42, 2.10),
        ("C. Bradley",      "RB", 1.82, 1.85),
        ("J. Gomez",        "CB", 1.62, 1.92),
        ("I. Konaté",       "CB", 1.58, 2.02),
        ("M. Kerkez",       "LB", 1.75, 1.85),
        ("W. Endo",         "CM", 1.78, 1.95),
        ("R. Gravenberch",  "CM", 1.88, 1.92),
        ("C. Jones",        "CM", 1.85, 1.78),
        ("J. Frimpong",     "RW", 2.05, 1.88),
        ("F. Chiesa",       "LW", 2.08, 1.62),
        ("J. Danns",        "ST", 1.72, 1.65),
    ],
    "MUN": [
        ("A. Bayındır",      "GK", 1.42, 1.88),
        ("Diogo Dalot",      "RB", 1.88, 1.92),
        ("T. Fredricson",    "CB", 1.55, 1.82),
        ("A. Heaven",        "CB", 1.50, 1.75),
        ("P. Dorgu",         "LB", 1.85, 1.82),
        ("Casemiro",         "CM", 1.78, 2.08),
        ("Bruno Fernandes",  "CM", 2.15, 1.72),
        ("J. Fletcher",      "CM", 1.60, 1.72),
        ("T. Fletcher",      "CM", 1.58, 1.70),
        ("S. Lacey",         "ST", 1.65, 1.62),
        ("Bendito Mantato",  "ST", 1.70, 1.55),
    ],
    "CHE": [
        ("F. Jörgensen",              "GK", 1.42, 1.95),
        ("Joshua Kofi Acheampong",    "RB", 1.75, 1.85),
        ("T. Adarabioyo",             "CB", 1.55, 1.92),
        ("B. Badiashile",             "CB", 1.52, 1.95),
        ("T. Chalobah",               "CB", 1.62, 1.88),
        ("Andrey Santos",             "CM", 1.78, 1.85),
        ("M. Caicedo",                "CM", 1.82, 2.02),
        ("Dário Essugo",              "CM", 1.72, 1.82),
        ("E. Fernández",              "CM", 1.95, 1.85),
        ("L. Delap",                  "ST", 2.05, 1.58),
        ("Estêvão",                   "RW", 2.15, 1.62),
    ],
    "TOT": [
        ("A. Gray",        "GK", 1.50, 1.85),
        ("D. Spence",      "RB", 1.75, 1.82),
        ("R. Drăgușin",    "CB", 1.55, 1.92),
        ("K. Danso",       "CB", 1.55, 1.95),
        ("B. Davies",      "LB", 1.62, 1.90),
        ("R. Bentancur",   "CM", 1.85, 1.92),
        ("L. Bergvall",    "CM", 1.82, 1.85),
        ("X. Simons",      "CM", 2.05, 1.78),
        ("R. Kolo Muani",  "ST", 2.08, 1.62),
        ("B. Austin",      "ST", 1.88, 1.65),
        ("Aidan Harris",   "ST", 1.65, 1.58),
    ],
    "NEW": [
        ("M. Bizot",          "GK", 1.42, 1.92),
        ("E. Krafth",         "RB", 1.68, 1.82),
        ("S. Botman",         "CB", 1.55, 2.02),
        ("D. Burn",           "CB", 1.58, 1.92),
        ("L. Hall",           "LB", 1.72, 1.82),
        ("Bruno Guimarães",   "CM", 2.02, 2.08),
        ("Joelinton",         "CM", 1.92, 1.88),
        ("L. Miley",          "CM", 1.75, 1.78),
        ("J. Murphy",         "RW", 1.95, 1.72),
        ("S. Neave",          "ST", 1.70, 1.65),
        ("S. Alabi",          "GK", 1.45, 1.85),
    ],
    "AVL": [
        ("E. Konsa",       "CB", 1.58, 2.02),
        ("M. Cash",        "RB", 1.78, 1.88),
        ("L. Bogarde",     "CB", 1.58, 1.88),
        ("Andrés García",  "CB", 1.62, 1.82),
        ("L. Digne",       "LB", 1.75, 1.85),
        ("R. Barkley",     "CM", 1.92, 1.82),
        ("B. Burrows",     "LB", 1.68, 1.78),
        ("Alysson Edward", "CM", 1.65, 1.70),
        ("E. Buendía",     "RW", 2.02, 1.72),
        ("T. Abraham",     "ST", 2.05, 1.62),
        ("J. Byfield",     "ST", 1.72, 1.58),
    ],
}

with app.app_context():
    inserted = 0
    skipped = 0

    for short_name, players in SQUADS.items():
        team = Team.query.filter_by(short_name=short_name).first()
        if not team:
            print(f"⚠️  Team not found: {short_name} — skipping")
            continue

        existing_names = {p.name for p in Player.query.filter_by(team_id=team.id).all()}

        for name, position, attack, defense in players:
            if name in existing_names:
                print(f"  ↩  {team.name} / {name} already exists — skipping")
                skipped += 1
                continue

            player = Player(
                name=name,
                position=position,
                team_id=team.id,
                attack_rating=attack,
                defense_rating=defense,
            )
            db.session.add(player)
            print(f"  ✅ {team.name} / {name} ({position}) — ATK {attack} DEF {defense}")
            inserted += 1

    db.session.commit()
    print(f"\n✅ Done — {inserted} players inserted, {skipped} already existed.")
