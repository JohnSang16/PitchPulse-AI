#!/bin/sh
set -e

echo "Running database migrations..."
flask --app run db upgrade

echo "Starting gunicorn..."
exec gunicorn run:app --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120
