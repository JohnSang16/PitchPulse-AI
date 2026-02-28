from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def get_coaching_insight(home_team, away_team, home_formation, away_formation, simulation_result):
    prompt = f"""
    You are an expert soccer tactical analyst and coach.
    
    Analyze this Premier League matchup:
    - Home Team: {home_team} playing {home_formation}
    - Away Team: {away_team} playing {away_formation}
    
    Simulation Results (based on 1000 Monte Carlo simulations):
    - {home_team} Win Probability: {simulation_result['home_win_pct']}%
    - Draw Probability: {simulation_result['draw_pct']}%
    - {away_team} Win Probability: {simulation_result['away_win_pct']}%
    - {home_team} Expected Goals: {simulation_result['home_expected_goals']}
    - {away_team} Expected Goals: {simulation_result['away_expected_goals']}
    
    Please provide:
    1. A brief tactical analysis of this matchup (2-3 sentences)
    2. The key tactical battle to watch
    3. One tactical recommendation for the home team
    4. One tactical recommendation for the away team
    
    Keep your response concise and focused. Use soccer terminology.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text