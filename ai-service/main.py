"""
CIVSail AI Service — FastAPI Entry Point

This is the Python backend that powers CIVSail's AI career advisor
and NMC monitor. It runs separately from the Next.js frontend and
communicates via HTTP REST with a shared secret.

Phase 0: Foundation only — health check, auth scaffolding, Supabase connection.
No AI logic yet.
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from pydantic import BaseModel

from db.client import get_supabase_client

# Load environment variables before anything else
load_dotenv()

# Configure logging (never use print() — use the logging module)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("civsail-ai")

# ---------------------------------------------------------------------------
# Auth dependency — every protected endpoint runs through this
# ---------------------------------------------------------------------------

AI_SERVICE_SECRET = os.getenv("AI_SERVICE_SECRET")


def verify_secret(request: Request) -> None:
    """
    Verify the shared secret from the Authorization header.

    Next.js sends: Authorization: Bearer <AI_SERVICE_SECRET>
    If the header is missing or wrong, reject immediately.
    This runs as a FastAPI dependency on every protected endpoint.
    """
    if not AI_SERVICE_SECRET:
        # If the secret isn't configured on the server, something is very wrong.
        # Fail closed — don't let requests through without auth.
        logger.error("AI_SERVICE_SECRET is not set — rejecting all requests")
        raise HTTPException(status_code=500, detail="Server auth not configured")

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = auth_header.removeprefix("Bearer ").strip()
    if token != AI_SERVICE_SECRET:
        raise HTTPException(status_code=401, detail="Invalid authorization token")


# ---------------------------------------------------------------------------
# Startup / shutdown — verify critical services are reachable
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs on startup and shutdown.
    On startup: verify Supabase is reachable so we fail fast if misconfigured.
    """
    logger.info("Starting CIVSail AI Service...")

    # Verify Supabase connection by attempting a lightweight query
    try:
        client = get_supabase_client()
        # Query a single row from profiles just to confirm the connection works.
        # We don't care about the result — just that it doesn't throw.
        client.table("profiles").select("user_id").limit(1).execute()
        logger.info("Supabase connection verified")
    except Exception as e:
        logger.error(f"Supabase connection failed: {e}")
        logger.error("Check SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env")
        # Don't crash the server — let the health endpoint report the issue.
        # This way you can still diagnose problems via /health.

    yield  # App runs here

    logger.info("Shutting down CIVSail AI Service")


# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="CIVSail AI Service",
    description="AI career advisor and NMC monitor for U.S. merchant mariners",
    version="0.1.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Request/response models
# ---------------------------------------------------------------------------


class ChatRequest(BaseModel):
    """What Next.js sends when a user asks the AI advisor a question."""

    user_id: str
    message: str


class ChatResponse(BaseModel):
    """What we send back. Will grow significantly in later phases."""

    response: str
    user_id: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
async def health_check():
    """
    Public endpoint — no auth required.
    Used by Railway health checks and for quick verification that
    the service is running.
    """
    environment = os.getenv("ENVIRONMENT", "development")
    return {"status": "ok", "environment": environment}


@app.post("/advisor/chat", dependencies=[Depends(verify_secret)])
async def advisor_chat(request: ChatRequest) -> ChatResponse:
    """
    Main endpoint for the AI career advisor.

    Phase 0: Returns a placeholder response.
    Phase 3+: Will run the full LangGraph advisor agent, pulling
    the user's profile, searching regulations, checking requirements,
    and building a personalized action plan.
    """
    logger.info(f"Chat request from user_id={request.user_id}")

    # Phase 0: Just acknowledge the request
    return ChatResponse(
        response="not implemented yet",
        user_id=request.user_id,
    )
