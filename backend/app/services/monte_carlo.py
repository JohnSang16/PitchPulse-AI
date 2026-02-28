import numpy as np

def run_simulation(home_attack, home_defense, away_attack, away_defense, n=1000):
    """
    Simulates n matches between two teams using Poisson distribution.
    
    - home_attack: how many goals the home team scores on average
    - home_defense: how well the home team defends
    - away_attack: how many goals the away team scores on average
    - away_defense: how well the away team defends
    """
    # Home advantage factor
    home_advantage = 1.1

    # Expected goals for each team
    home_expected_goals = home_attack * (1 / away_defense) * home_advantage
    away_expected_goals = away_attack * (1 / home_defense)

    # Run n simulations using Poisson distribution
    home_goals = np.random.poisson(home_expected_goals, n)
    away_goals = np.random.poisson(away_expected_goals, n)

    # Count outcomes
    home_wins = int(np.sum(home_goals > away_goals))
    draws     = int(np.sum(home_goals == away_goals))
    away_wins = int(np.sum(home_goals < away_goals))

    return {
        "home_win_pct": round(home_wins / n * 100, 1),
        "draw_pct":     round(draws / n * 100, 1),
        "away_win_pct": round(away_wins / n * 100, 1),
        "simulations":  n,
        "home_expected_goals": round(home_expected_goals, 2),
        "away_expected_goals": round(away_expected_goals, 2)
    }