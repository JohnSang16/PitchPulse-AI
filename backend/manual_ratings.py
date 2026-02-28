from app import create_app
from app.extensions import db
from app.models.player import Player

# FIFA/EAFC ratings manually curated
# Format: "player_name": (attack_rating, defense_rating)
# Scale: 1.0 - 2.5 (converted from FIFA 0-99 scale)
# Attack = (shooting * 0.4 + pace * 0.3 + dribbling * 0.3) / 100 * 1.5 + 1.0
# Defense = (defending * 0.5 + physical * 0.3 + passing * 0.2) / 100 * 1.5 + 1.0

PLAYER_RATINGS = {
    # ============ ARSENAL ============
    "Kepa": (1.45, 1.95),               # OVR 79 - GK
    "R. Calafiori": (1.72, 1.90),       # OVR 82 - CB
    "Gabriel Magalhães": (1.55, 2.05),  # OVR 84 - CB
    "P. Hincapié": (1.62, 1.88),        # OVR 80 - CB
    "M. Lewis-Skelly": (1.68, 1.82),    # OVR 76 - LB
    "M. Dowman": (1.60, 1.75),          # OVR 68 - CM
    "E. Eze": (2.05, 1.62),             # OVR 84 - CM
    "I. Ibrahim": (1.65, 1.78),         # OVR 70 - CM
    "Mikel Merino": (1.88, 1.92),       # OVR 83 - CM
    "B. Bailey-Joseph": (1.75, 1.55),   # OVR 72 - ST
    "Gabriel Jesus": (2.05, 1.68),      # OVR 82 - ST

    # ============ MANCHESTER CITY ============
    "M. Bettinelli": (1.40, 1.88),      # OVR 76 - GK
    "R. Aït-Nouri": (1.78, 1.85),       # OVR 82 - LB
    "N. Aké": (1.58, 1.95),             # OVR 82 - CB
    "Max Alleyne": (1.55, 1.72),        # OVR 66 - CB
    "K. Braithwaite": (1.62, 1.70),     # OVR 68 - CB
    "R. Cherki": (2.08, 1.62),          # OVR 82 - CM
    "P. Foden": (2.18, 1.72),           # OVR 91 - CM
    "Charlie Gray": (1.58, 1.60),       # OVR 65 - CM
    "M. Kovačić": (1.92, 1.88),         # OVR 83 - CM
    "J. Doku": (2.12, 1.58),            # OVR 82 - ST
    "E. Haaland": (2.48, 1.45),         # OVR 94 - ST

    # ============ LIVERPOOL ============
    "Alisson Becker": (1.42, 2.10),     # OVR 90 - GK
    "C. Bradley": (1.82, 1.85),         # OVR 78 - RB
    "J. Gomez": (1.62, 1.92),           # OVR 80 - CB
    "M. Kerkez": (1.75, 1.85),          # OVR 79 - LB
    "I. Konaté": (1.58, 2.02),          # OVR 84 - CB
    "W. Endo": (1.78, 1.95),            # OVR 80 - CM
    "R. Gravenberch": (1.88, 1.92),     # OVR 84 - CM
    "C. Jones": (1.85, 1.78),           # OVR 79 - CM
    "J. Frimpong": (2.05, 1.88),        # OVR 84 - RW
    "F. Chiesa": (2.08, 1.62),          # OVR 83 - LW
    "J. Danns": (1.72, 1.65),           # OVR 70 - ST

    # ============ MANCHESTER UNITED ============
    "A. Bayındır": (1.42, 1.88),        # OVR 76 - GK
    "Diogo Dalot": (1.88, 1.92),        # OVR 82 - RB
    "P. Dorgu": (1.85, 1.82),           # OVR 78 - LB
    "T. Fredricson": (1.55, 1.82),      # OVR 72 - CB
    "A. Heaven": (1.50, 1.75),          # OVR 68 - CB
    "Casemiro": (1.78, 2.08),           # OVR 85 - CM
    "Bruno Fernandes": (2.15, 1.72),    # OVR 88 - CM
    "J. Fletcher": (1.60, 1.72),        # OVR 68 - CM
    "T. Fletcher": (1.58, 1.70),        # OVR 66 - CM
    "S. Lacey": (1.65, 1.62),           # OVR 68 - ST
    "Bendito Mantato": (1.70, 1.55),    # OVR 68 - ST

    # ============ CHELSEA ============
    "F. Jörgensen": (1.42, 1.95),       # OVR 79 - GK
    "Joshua Kofi Acheampong": (1.75, 1.85), # OVR 74 - RB
    "T. Adarabioyo": (1.55, 1.92),      # OVR 78 - CB
    "B. Badiashile": (1.52, 1.95),      # OVR 80 - CB
    "T. Chalobah": (1.62, 1.88),        # OVR 76 - CB
    "Andrey Santos": (1.78, 1.85),      # OVR 76 - CM
    "M. Caicedo": (1.82, 2.02),         # OVR 85 - CM
    "Dário Essugo": (1.72, 1.82),       # OVR 74 - CM
    "E. Fernández": (1.95, 1.85),       # OVR 84 - CM
    "L. Delap": (2.05, 1.58),           # OVR 78 - ST
    "Estêvão": (2.15, 1.62),            # OVR 82 - RW

    # ============ TOTTENHAM ============
    "K. Danso": (1.55, 1.95),           # OVR 80 - CB
    "B. Davies": (1.62, 1.90),          # OVR 78 - LB
    "R. Drăgușin": (1.55, 1.92),        # OVR 78 - CB
    "A. Gray": (1.50, 1.85),            # OVR 72 - GK
    "D. Spence": (1.75, 1.82),          # OVR 74 - RB
    "R. Bentancur": (1.85, 1.92),       # OVR 83 - CM
    "L. Bergvall": (1.82, 1.85),        # OVR 76 - CM
    "X. Simons": (2.05, 1.78),          # OVR 83 - CM
    "R. Kolo Muani": (2.08, 1.62),      # OVR 82 - ST
    "Aidan Harris": (1.65, 1.58),       # OVR 66 - ST
    "B. Austin": (1.88, 1.65),          # OVR 76 - ST

    # ============ NEWCASTLE ============
    "S. Botman": (1.55, 2.02),          # OVR 82 - CB
    "D. Burn": (1.58, 1.92),            # OVR 78 - CB
    "L. Hall": (1.72, 1.82),            # OVR 74 - LB
    "E. Krafth": (1.68, 1.82),          # OVR 74 - RB
    "S. Alabi": (1.45, 1.85),           # OVR 68 - GK
    "Bruno Guimarães": (2.02, 2.08),    # OVR 87 - CM
    "Joelinton": (1.92, 1.88),          # OVR 80 - CM
    "L. Miley": (1.75, 1.78),           # OVR 72 - CM
    "J. Murphy": (1.95, 1.72),          # OVR 78 - RW
    "S. Neave": (1.70, 1.65),           # OVR 68 - ST
    "M. Bizot": (1.42, 1.92),           # OVR 76 - GK

    # ============ ASTON VILLA ============
    "L. Bogarde": (1.58, 1.88),         # OVR 72 - CB
    "M. Cash": (1.78, 1.88),            # OVR 80 - RB
    "L. Digne": (1.75, 1.85),           # OVR 79 - LB
    "Andrés García": (1.62, 1.82),      # OVR 72 - CB
    "E. Konsa": (1.58, 2.02),           # OVR 82 - CB
    "R. Barkley": (1.92, 1.82),         # OVR 78 - CM
    "E. Buendía": (2.02, 1.72),         # OVR 80 - RW
    "B. Burrows": (1.68, 1.78),         # OVR 72 - LB
    "T. Abraham": (2.05, 1.62),         # OVR 80 - ST
    "Alysson Edward": (1.65, 1.70),     # OVR 68 - CM
    "J. Byfield": (1.72, 1.58),         # OVR 68 - ST
}

app = create_app()

with app.app_context():
    players = Player.query.all()
    updated = 0
    not_found = []

    for player in players:
        if player.name in PLAYER_RATINGS:
            attack, defense = PLAYER_RATINGS[player.name]
            player.attack_rating = attack
            player.defense_rating = defense
            updated += 1
            print(f"✅ {player.name} → ATK: {attack}, DEF: {defense}")
        else:
            not_found.append(player.name)
            print(f"❌ Not found: {player.name}")

    db.session.commit()
    print(f"\n✅ Updated {updated} players")
    if not_found:
        print(f"❌ Not found ({len(not_found)}): {', '.join(not_found)}")