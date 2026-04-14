#!/bin/sh
set -e

echo "=== PitchPulse AI Starting ==="
echo "PORT:         ${PORT:-8000}"
echo "FLASK_ENV:    ${FLASK_ENV:-not set}"
echo "DATABASE_URL: $([ -n "$DATABASE_URL" ] && echo "SET (${#DATABASE_URL} chars)" || echo "NOT SET")"
echo "SECRET_KEY:   $([ -n "$SECRET_KEY" ] && echo "SET" || echo "NOT SET")"
echo "==============================="

if [ -z "$DATABASE_URL" ]; then
    echo "FATAL: DATABASE_URL is not set. Set it in EB environment properties and redeploy."
    exit 1
fi

echo "Running database migrations..."
flask --app run db upgrade
echo "Migrations complete."

echo "Starting gunicorn on port ${PORT:-8000}..."
exec gunicorn run:app \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile -
