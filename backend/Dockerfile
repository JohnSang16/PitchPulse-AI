# ── Build stage ──────────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install only build deps first (layer-cache friendly)
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from the builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application source
COPY . .

# Don't run as root
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Railway injects PORT at runtime; default to 5001 for local use
ENV PORT=5001

EXPOSE $PORT

# gunicorn is already in requirements.txt
CMD ["sh", "-c", "gunicorn run:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120"]
