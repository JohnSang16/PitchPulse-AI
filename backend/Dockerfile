# ── Build stage ──────────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# EB reads EXPOSE statically to configure its nginx reverse proxy.
# Default port 8000; override with PORT env var if needed.
ENV PORT=8000
EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
