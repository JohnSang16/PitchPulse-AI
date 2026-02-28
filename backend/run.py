from app import create_app
import os
app = create_app()

if __name__ == "__main__":
    # Use the port assigned by Railway, or default to 5001 for local dev
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, host="0.0.0.0", port=port)