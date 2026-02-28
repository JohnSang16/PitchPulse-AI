import pandas as pd
from thefuzz import process
import os
from dotenv import load_dotenv
from app import create_app
from app.extensions import db
from app.models.player import Player

load_dotenv()

app = create_app()

# Load FIFA dataset
print("Loading FIFA dataset...")
fifa_df = pd.read_csv("fifa_data/male_players.csv", low_memory=False)

# Keep only the columns we need
fifa_df = fifa_df[["short_name", "long_name", "overall", "pace", 
                    "shooting", "passing", "dribbling", 
                    "defending", "physic"]].dropna()

# Build a lookup dict by long_name
fifa_lookup = {}
for _, row in fifa_df.iterrows():
    fifa_lookup[row["long_name"]] = row

fifa_names = list(fifa_lookup.keys())

def calculate_ratings(row):
    """Convert FIFA stats to attack/defense ratings on a 1.0-2.5 scale"""
    attack = (float(row["shooting"]) * 0.4 + 
              float(row["pace"]) * 0.3 + 
              float(row["dribbling"]) * 0.3) / 100 * 1.5 + 1.0
    
    defense = (float(row["defending"]) * 0.5 + 
               float(row["physic"]) * 0.3 +
               float(row["passing"]) * 0.2) / 100 * 1.5 + 1.0
    
    return round(attack, 2), round(defense, 2)

with app.app_context():
    players = Player.query.all()
    matched = 0
    unmatched = []

    for player in players:
        # Fuzzy match player name against FIFA dataset
        result = process.extractOne(player.name, fifa_names, score_cutoff=70)
        
        if result:
            matched_name = result[0]
            fifa_row = fifa_lookup[matched_name]
            attack, defense = calculate_ratings(fifa_row)
            
            player.attack_rating = attack
            player.defense_rating = defense
            matched += 1
            print(f"✅ {player.name} → {matched_name} (ATK: {attack}, DEF: {defense})")
        else:
            unmatched.append(player.name)
            print(f"❌ No match found for: {player.name}")

    db.session.commit()
    print(f"\n✅ Matched {matched} players")
    if unmatched:
        print(f"❌ Unmatched players ({len(unmatched)}): {', '.join(unmatched)}")