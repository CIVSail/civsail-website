"""
Supabase Client — Database Connection for the AI Service

This module initializes the Supabase Python client using the SERVICE_ROLE key.
The service_role key bypasses Row Level Security, which is necessary because
the AI service needs to read any user's profile to answer their questions.

IMPORTANT: The service_role key must NEVER be exposed to the browser or
included in any client-side code. It lives only in the Python service's .env.
"""

import os
import logging

from supabase import create_client, Client

logger = logging.getLogger("civsail-ai.db")

# Module-level singleton — initialized once, reused across requests
_client: Client | None = None


def get_supabase_client() -> Client:
    """
    Returns the Supabase client, creating it on first call.

    Uses a singleton pattern so we don't create a new connection
    on every request. The client is thread-safe for read operations.

    Raises RuntimeError if the required environment variables are missing,
    so you get a clear error message instead of a cryptic NoneType failure.
    """
    global _client

    if _client is not None:
        return _client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")

    if not url:
        raise RuntimeError(
            "SUPABASE_URL is not set. "
            "Copy ai-service/.env.example to ai-service/.env and fill in the values. "
            "Find your project URL in the Supabase dashboard under Settings > API."
        )

    if not key:
        raise RuntimeError(
            "SUPABASE_SERVICE_KEY is not set. "
            "Copy ai-service/.env.example to ai-service/.env and fill in the values. "
            "Find your service_role key in the Supabase dashboard under Settings > API. "
            "Use the service_role key, NOT the anon key."
        )

    _client = create_client(url, key)
    logger.info("Supabase client initialized")
    return _client
