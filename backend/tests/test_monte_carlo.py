"""
Unit tests for the Monte Carlo simulation engine.

Tests validate:
- Output shape and key presence
- All percentages are in [0, 100] and sum to ~100
- Expected goals are positive
- Probability distributions shift in the correct direction when inputs change
- Confidence interval bounds across repeated runs
"""
import pytest
import numpy as np
from app.services.monte_carlo import run_simulation


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _sum_pcts(result):
    return result["home_win_pct"] + result["draw_pct"] + result["away_win_pct"]


# ---------------------------------------------------------------------------
# Output shape
# ---------------------------------------------------------------------------

class TestOutputShape:
    def test_returns_all_keys(self):
        result = run_simulation(1.8, 1.6, 1.7, 1.5)
        expected_keys = {
            "home_win_pct", "draw_pct", "away_win_pct",
            "simulations", "home_expected_goals", "away_expected_goals",
        }
        assert expected_keys == set(result.keys())

    def test_simulation_count_matches_n(self):
        result = run_simulation(1.8, 1.6, 1.7, 1.5, n=500)
        assert result["simulations"] == 500

    def test_default_n_is_1000(self):
        result = run_simulation(1.8, 1.6, 1.7, 1.5)
        assert result["simulations"] == 1000


# ---------------------------------------------------------------------------
# Probability ranges and sum
# ---------------------------------------------------------------------------

class TestProbabilityRanges:
    @pytest.fixture
    def result(self):
        return run_simulation(1.8, 1.6, 1.7, 1.5)

    def test_home_win_pct_in_range(self, result):
        assert 0.0 <= result["home_win_pct"] <= 100.0

    def test_draw_pct_in_range(self, result):
        assert 0.0 <= result["draw_pct"] <= 100.0

    def test_away_win_pct_in_range(self, result):
        assert 0.0 <= result["away_win_pct"] <= 100.0

    def test_percentages_sum_to_100(self, result):
        # Rounding is to 1 dp, so tolerance of 0.3 covers worst case
        assert abs(_sum_pcts(result) - 100.0) <= 0.3


# ---------------------------------------------------------------------------
# Expected goals
# ---------------------------------------------------------------------------

class TestExpectedGoals:
    def test_home_expected_goals_positive(self):
        result = run_simulation(2.0, 1.8, 1.5, 1.5)
        assert result["home_expected_goals"] > 0

    def test_away_expected_goals_positive(self):
        result = run_simulation(2.0, 1.8, 1.5, 1.5)
        assert result["away_expected_goals"] > 0

    def test_home_advantage_baked_in(self):
        # With identical ratings, home team should have more expected goals
        # because of the 1.1 home_advantage factor
        result = run_simulation(
            home_attack=1.8, home_defense=1.8,
            away_attack=1.8, away_defense=1.8,
        )
        assert result["home_expected_goals"] > result["away_expected_goals"]

    def test_expected_goals_formula(self):
        # Verify the formula: home_xg = home_attack * (1/away_defense) * 1.1
        ha, hd, aa, ad = 2.0, 1.5, 1.8, 1.6
        result = run_simulation(ha, hd, aa, ad)
        expected_home_xg = round(ha * (1 / ad) * 1.1, 2)
        expected_away_xg = round(aa * (1 / hd), 2)
        assert result["home_expected_goals"] == expected_home_xg
        assert result["away_expected_goals"] == expected_away_xg


# ---------------------------------------------------------------------------
# Directional / sensitivity tests
# ---------------------------------------------------------------------------

class TestDirectionalBehavior:
    def test_dominant_home_team_wins_more(self):
        """A much stronger home team should win the majority of simulations."""
        result = run_simulation(
            home_attack=3.0, home_defense=2.5,
            away_attack=1.0, away_defense=1.0,
            n=5000,
        )
        assert result["home_win_pct"] > 60.0

    def test_dominant_away_team_wins_more(self):
        """A much stronger away team should still win the majority."""
        result = run_simulation(
            home_attack=1.0, home_defense=1.0,
            away_attack=3.5, away_defense=3.0,
            n=5000,
        )
        assert result["away_win_pct"] > 50.0

    def test_increasing_home_attack_increases_home_win_pct(self):
        """Raising home attack rating should raise home win probability."""
        base = run_simulation(1.5, 1.5, 1.5, 1.5, n=5000)
        boosted = run_simulation(2.5, 1.5, 1.5, 1.5, n=5000)
        assert boosted["home_win_pct"] > base["home_win_pct"]

    def test_increasing_away_defense_lowers_away_expected_goals(self):
        """Better away defense (higher rating) means fewer expected away goals."""
        weak_def = run_simulation(1.8, 1.2, 1.8, 1.5)
        strong_def = run_simulation(1.8, 2.5, 1.8, 1.5)
        assert strong_def["away_expected_goals"] < weak_def["away_expected_goals"]


# ---------------------------------------------------------------------------
# Confidence intervals across repeated runs
# ---------------------------------------------------------------------------

class TestConfidenceIntervals:
    """
    Run the simulation multiple times with a large n and verify that the
    resulting win probabilities fall within a statistically expected range.
    """

    RUNS = 10
    N = 5000
    # With n=5000, std of a binomial proportion is at most sqrt(0.25/5000) ≈ 0.007
    # 4-sigma tolerance gives ~2.8 pp — we use 5 pp to be safe.
    TOLERANCE = 5.0

    def test_home_win_pct_stable_across_runs(self):
        results = [
            run_simulation(1.9, 1.6, 1.7, 1.5, n=self.N)["home_win_pct"]
            for _ in range(self.RUNS)
        ]
        spread = max(results) - min(results)
        assert spread < self.TOLERANCE, (
            f"home_win_pct spread {spread:.1f} pp exceeds {self.TOLERANCE} pp "
            f"over {self.RUNS} runs: {results}"
        )

    def test_draw_pct_stable_across_runs(self):
        results = [
            run_simulation(1.9, 1.6, 1.7, 1.5, n=self.N)["draw_pct"]
            for _ in range(self.RUNS)
        ]
        spread = max(results) - min(results)
        assert spread < self.TOLERANCE

    def test_pct_sum_always_100(self):
        for _ in range(self.RUNS):
            result = run_simulation(1.9, 1.6, 1.7, 1.5, n=self.N)
            assert abs(_sum_pcts(result) - 100.0) <= 0.3


# ---------------------------------------------------------------------------
# Edge / boundary inputs
# ---------------------------------------------------------------------------

class TestEdgeCases:
    def test_very_high_attack_ratings(self):
        result = run_simulation(5.0, 5.0, 5.0, 5.0, n=1000)
        assert abs(_sum_pcts(result) - 100.0) <= 0.3

    def test_minimum_realistic_ratings(self):
        result = run_simulation(0.5, 0.5, 0.5, 0.5, n=1000)
        assert abs(_sum_pcts(result) - 100.0) <= 0.3

    def test_large_n_runs_without_error(self):
        result = run_simulation(1.8, 1.6, 1.7, 1.5, n=10_000)
        assert result["simulations"] == 10_000


# ---------------------------------------------------------------------------
# Deterministic / seeded output
# ---------------------------------------------------------------------------

class TestDeterministicOutput:
    def test_seeded_runs_produce_identical_results(self):
        """With the same numpy seed, two runs must return bit-for-bit equal pcts."""
        np.random.seed(42)
        r1 = run_simulation(1.9, 1.6, 1.7, 1.5, n=1000)
        np.random.seed(42)
        r2 = run_simulation(1.9, 1.6, 1.7, 1.5, n=1000)
        assert r1["home_win_pct"] == r2["home_win_pct"]
        assert r1["draw_pct"] == r2["draw_pct"]
        assert r1["away_win_pct"] == r2["away_win_pct"]

    def test_expected_goals_are_fully_deterministic(self):
        """xG values are pure math — must be identical across all calls."""
        results = [run_simulation(2.1, 1.8, 1.6, 1.5) for _ in range(5)]
        xg_home = {r["home_expected_goals"] for r in results}
        xg_away = {r["away_expected_goals"] for r in results}
        assert len(xg_home) == 1, "home_expected_goals must be deterministic"
        assert len(xg_away) == 1, "away_expected_goals must be deterministic"


# ---------------------------------------------------------------------------
# Boundary value tests
# ---------------------------------------------------------------------------

class TestBoundaryValues:
    def test_n_equals_1_returns_valid_result(self):
        result = run_simulation(1.8, 1.6, 1.7, 1.5, n=1)
        assert result["simulations"] == 1

    def test_n_equals_1_exactly_one_outcome(self):
        """With n=1, exactly one of the three outcomes must be 100.0."""
        result = run_simulation(1.8, 1.6, 1.7, 1.5, n=1)
        pcts = [result["home_win_pct"], result["draw_pct"], result["away_win_pct"]]
        assert sorted(pcts) == [0.0, 0.0, 100.0]

    def test_very_small_attack_ratings_no_error(self):
        # Ratings of 0.01 produce tiny xG but must not raise ZeroDivisionError
        result = run_simulation(0.01, 0.01, 0.01, 0.01, n=1000)
        assert abs(_sum_pcts(result) - 100.0) <= 0.3

    def test_home_defense_boost_reduces_away_xg(self):
        """Doubling home defense should halve away expected goals (linear relationship)."""
        r_low = run_simulation(1.8, 1.0, 1.8, 1.5)
        r_high = run_simulation(1.8, 2.0, 1.8, 1.5)
        # away_xg = away_attack / home_defense — so doubling hd halves away_xg
        assert abs(r_high["away_expected_goals"] - r_low["away_expected_goals"] / 2) < 0.05

    def test_home_attack_boost_increases_home_xg_proportionally(self):
        """Doubling home attack doubles home expected goals."""
        r_base = run_simulation(1.0, 1.5, 1.5, 1.5)
        r_double = run_simulation(2.0, 1.5, 1.5, 1.5)
        assert abs(r_double["home_expected_goals"] - r_base["home_expected_goals"] * 2) < 0.05


# ---------------------------------------------------------------------------
# Return type guarantees
# ---------------------------------------------------------------------------

class TestOutputTypes:
    @pytest.fixture
    def result(self):
        return run_simulation(1.8, 1.6, 1.7, 1.5)

    def test_home_win_pct_is_float(self, result):
        assert isinstance(result["home_win_pct"], float)

    def test_draw_pct_is_float(self, result):
        assert isinstance(result["draw_pct"], float)

    def test_away_win_pct_is_float(self, result):
        assert isinstance(result["away_win_pct"], float)

    def test_expected_goals_are_floats(self, result):
        assert isinstance(result["home_expected_goals"], float)
        assert isinstance(result["away_expected_goals"], float)

    def test_simulations_is_int(self, result):
        assert isinstance(result["simulations"], int)

    def test_pct_values_have_at_most_one_decimal(self, result):
        for key in ("home_win_pct", "draw_pct", "away_win_pct"):
            val = result[key]
            # round(x, 1) should equal x for values already rounded to 1 dp
            assert round(val, 1) == val

    def test_xg_values_have_at_most_two_decimals(self, result):
        for key in ("home_expected_goals", "away_expected_goals"):
            val = result[key]
            assert round(val, 2) == val
