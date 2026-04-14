"""
Integration tests for Flask API endpoints.

Uses an in-memory SQLite database so no real PostgreSQL connection is needed.
The `app` and `client` fixtures create a fresh app + DB for each test module.
"""
import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy.pool import StaticPool
from app import create_app
from app.extensions import db as _db
from app.models.team import Team


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def app():
    """Application configured for testing with an in-memory SQLite DB.

    Config is passed into create_app() so TESTING=True is set before the
    auto-seed block inside create_app() runs — preventing it from querying
    a table that doesn't exist yet.
    """
    test_app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        # StaticPool forces all connections to reuse the same in-memory SQLite
        # connection, so create_all() and test queries see the same schema.
        "SQLALCHEMY_ENGINE_OPTIONS": {
            "connect_args": {"check_same_thread": False},
            "poolclass": StaticPool,
        },
    })
    with test_app.app_context():
        _db.create_all()
        _seed_teams()
        yield test_app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture(scope="module")
def client(app):
    return app.test_client()


def _seed_teams():
    """Insert two known teams so route tests have real IDs to work with."""
    t1 = Team(name="Liverpool", short_name="LIV", attack_rating=2.2, defense_rating=1.7)
    t2 = Team(name="Arsenal", short_name="ARS", attack_rating=2.1, defense_rating=1.8)
    _db.session.add_all([t1, t2])
    _db.session.commit()


# ---------------------------------------------------------------------------
# GET /api/hello
# ---------------------------------------------------------------------------

class TestHello:
    def test_status_200(self, client):
        resp = client.get("/api/hello")
        assert resp.status_code == 200

    def test_response_shape(self, client):
        data = client.get("/api/hello").get_json()
        assert "message" in data
        assert "status" in data

    def test_status_ok(self, client):
        data = client.get("/api/hello").get_json()
        assert data["status"] == "ok"


# ---------------------------------------------------------------------------
# GET /api/teams
# ---------------------------------------------------------------------------

class TestGetTeams:
    def test_status_200(self, client):
        resp = client.get("/api/teams")
        assert resp.status_code == 200

    def test_returns_list(self, client):
        data = client.get("/api/teams").get_json()
        assert isinstance(data, list)

    def test_team_shape(self, client):
        teams = client.get("/api/teams").get_json()
        assert len(teams) >= 1
        team = teams[0]
        for key in ("id", "name", "short_name", "attack_rating", "defense_rating"):
            assert key in team, f"Missing key: {key}"

    def test_seeded_teams_present(self, client):
        names = {t["name"] for t in client.get("/api/teams").get_json()}
        assert "Liverpool" in names
        assert "Arsenal" in names


# ---------------------------------------------------------------------------
# POST /api/simulate
# ---------------------------------------------------------------------------

class TestSimulate:
    @pytest.fixture(autouse=True)
    def _get_ids(self, client):
        teams = client.get("/api/teams").get_json()
        self.liv_id = next(t["id"] for t in teams if t["short_name"] == "LIV")
        self.ars_id = next(t["id"] for t in teams if t["short_name"] == "ARS")

    def test_status_200(self, client):
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
        )
        assert resp.status_code == 200

    def test_response_shape(self, client):
        data = client.post(
            "/api/simulate",
            json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
        ).get_json()
        expected_keys = {
            "home_team", "away_team",
            "home_win_pct", "draw_pct", "away_win_pct",
            "simulations", "home_expected_goals", "away_expected_goals",
        }
        assert expected_keys == set(data.keys())

    def test_team_names_in_response(self, client):
        data = client.post(
            "/api/simulate",
            json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
        ).get_json()
        assert data["home_team"] == "Liverpool"
        assert data["away_team"] == "Arsenal"

    def test_percentages_sum_to_100(self, client):
        data = client.post(
            "/api/simulate",
            json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
        ).get_json()
        total = data["home_win_pct"] + data["draw_pct"] + data["away_win_pct"]
        assert abs(total - 100.0) <= 0.3

    def test_invalid_team_id_returns_400(self, client):
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": 99999, "away_team_id": self.ars_id},
        )
        assert resp.status_code == 400

    def test_missing_body_returns_400(self, client):
        resp = client.post("/api/simulate", json={})
        assert resp.status_code == 400

    def test_both_invalid_ids_returns_400(self, client):
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": 99998, "away_team_id": 99999},
        )
        assert resp.status_code == 400


# ---------------------------------------------------------------------------
# GET /api/teams/<id>/players
# ---------------------------------------------------------------------------

class TestTeamPlayers:
    @pytest.fixture(autouse=True)
    def _get_liv_id(self, client):
        teams = client.get("/api/teams").get_json()
        self.liv_id = next(t["id"] for t in teams if t["short_name"] == "LIV")

    def test_status_200(self, client):
        resp = client.get(f"/api/teams/{self.liv_id}/players")
        assert resp.status_code == 200

    def test_response_shape(self, client):
        data = client.get(f"/api/teams/{self.liv_id}/players").get_json()
        assert "team" in data
        assert "players" in data
        assert isinstance(data["players"], list)

    def test_team_object_shape(self, client):
        team = client.get(f"/api/teams/{self.liv_id}/players").get_json()["team"]
        for key in ("id", "name", "short_name", "attack_rating", "defense_rating"):
            assert key in team

    def test_nonexistent_team_returns_404(self, client):
        resp = client.get("/api/teams/99999/players")
        assert resp.status_code == 404


# ---------------------------------------------------------------------------
# POST /api/simulate — edge / boundary cases
# ---------------------------------------------------------------------------

class TestSimulateEdgeCases:
    @pytest.fixture(autouse=True)
    def _get_ids(self, client):
        teams = client.get("/api/teams").get_json()
        self.liv_id = next(t["id"] for t in teams if t["short_name"] == "LIV")
        self.ars_id = next(t["id"] for t in teams if t["short_name"] == "ARS")

    def test_null_home_team_id_returns_400(self, client):
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": None, "away_team_id": self.ars_id},
        )
        assert resp.status_code == 400

    def test_null_away_team_id_returns_400(self, client):
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": self.liv_id, "away_team_id": None},
        )
        assert resp.status_code == 400

    def test_negative_home_id_returns_400(self, client):
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": -1, "away_team_id": self.ars_id},
        )
        assert resp.status_code == 400

    def test_missing_home_team_id_key_returns_400(self, client):
        # Key absent entirely — data.get() returns None → team lookup fails
        resp = client.post("/api/simulate", json={"away_team_id": self.ars_id})
        assert resp.status_code == 400

    def test_missing_away_team_id_key_returns_400(self, client):
        resp = client.post("/api/simulate", json={"home_team_id": self.liv_id})
        assert resp.status_code == 400

    def test_same_team_vs_itself_returns_200(self, client):
        # Not a business-logic error — simulation still runs fine
        resp = client.post(
            "/api/simulate",
            json={"home_team_id": self.liv_id, "away_team_id": self.liv_id},
        )
        assert resp.status_code == 200

    def test_get_method_not_allowed(self, client):
        resp = client.get("/api/simulate")
        assert resp.status_code == 405


# ---------------------------------------------------------------------------
# POST /api/coach — mocked Gemini
# ---------------------------------------------------------------------------

_MOCK_INSIGHT = (
    "Liverpool's high press will test Arsenal's build-up. "
    "Key battle: Salah vs White. Home side favoured by expected goals."
)

_COACH_EXPECTED_KEYS = {
    "home_team", "away_team", "insight",
    "home_win_pct", "draw_pct", "away_win_pct",
    "simulations", "home_expected_goals", "away_expected_goals",
}


def _mock_gemini():
    """Return a context manager that patches genai.Client at construction time.

    Because the client is now lazy-initialized inside get_coaching_insight(),
    we patch google.genai.Client so that when the function calls
    genai.Client(api_key=...) it gets our mock back instead of a real client.
    """
    mock_response = MagicMock()
    mock_response.text = _MOCK_INSIGHT
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response
    return patch("google.genai.Client", return_value=mock_client)


class TestCoach:
    @pytest.fixture(autouse=True)
    def _get_ids(self, client):
        teams = client.get("/api/teams").get_json()
        self.liv_id = next(t["id"] for t in teams if t["short_name"] == "LIV")
        self.ars_id = next(t["id"] for t in teams if t["short_name"] == "ARS")

    def test_status_200_with_mocked_gemini(self, client):
        with _mock_gemini():
            resp = client.post(
                "/api/coach",
                json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
            )
        assert resp.status_code == 200

    def test_response_shape(self, client):
        with _mock_gemini():
            data = client.post(
                "/api/coach",
                json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
            ).get_json()
        assert _COACH_EXPECTED_KEYS == set(data.keys())

    def test_insight_is_nonempty_string(self, client):
        with _mock_gemini():
            data = client.post(
                "/api/coach",
                json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
            ).get_json()
        assert isinstance(data["insight"], str)
        assert len(data["insight"]) > 0

    def test_mocked_insight_text_returned(self, client):
        with _mock_gemini():
            data = client.post(
                "/api/coach",
                json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
            ).get_json()
        assert data["insight"] == _MOCK_INSIGHT

    def test_custom_formations_accepted(self, client):
        with _mock_gemini():
            resp = client.post(
                "/api/coach",
                json={
                    "home_team_id": self.liv_id,
                    "away_team_id": self.ars_id,
                    "home_formation": "4-3-3",
                    "away_formation": "3-5-2",
                },
            )
        assert resp.status_code == 200

    def test_simulation_percentages_sum_to_100(self, client):
        with _mock_gemini():
            data = client.post(
                "/api/coach",
                json={"home_team_id": self.liv_id, "away_team_id": self.ars_id},
            ).get_json()
        total = data["home_win_pct"] + data["draw_pct"] + data["away_win_pct"]
        assert abs(total - 100.0) <= 0.3

    def test_invalid_team_ids_returns_400(self, client):
        # No mock needed — route returns 400 before reaching Gemini
        resp = client.post(
            "/api/coach",
            json={"home_team_id": 99999, "away_team_id": 99998},
        )
        assert resp.status_code == 400


# ---------------------------------------------------------------------------
# GET /api/teams/<id>/players — edge cases
# ---------------------------------------------------------------------------

class TestTeamPlayersEdgeCases:
    def test_zero_id_returns_404(self, client):
        # ID 0 is a valid int for the URL converter but won't match any row
        resp = client.get("/api/teams/0/players")
        assert resp.status_code == 404

    def test_string_id_returns_404(self, client):
        # Flask's <int:team_id> converter rejects non-numeric segments
        resp = client.get("/api/teams/abc/players")
        assert resp.status_code == 404
