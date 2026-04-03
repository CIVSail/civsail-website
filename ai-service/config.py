"""
CIVSail AI Service — Configuration

Central place for all environment variables and the model factory.
Import constants from here — never read os.getenv() in other files.

The get_llm() factory is where model agnosticism lives. When we add
LangGraph agents in Phase 3, every node will call get_llm() instead
of hardcoding a model name. This lets us swap between Anthropic,
OpenAI, or HuggingFace with a single env var change.
"""

import os

from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ---------------------------------------------------------------------------
# Supabase — the shared database both Next.js and Python use
# ---------------------------------------------------------------------------

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# ---------------------------------------------------------------------------
# Auth — shared secret between Next.js and this service
# ---------------------------------------------------------------------------

AI_SERVICE_SECRET = os.getenv("AI_SERVICE_SECRET", "")

# ---------------------------------------------------------------------------
# LLM Provider — controls which model get_llm() returns
# ---------------------------------------------------------------------------

MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "anthropic")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


def get_llm():
    """
    Factory function that returns the configured LLM.

    Will be implemented in Phase 3 when we add the LangGraph advisor agent.
    The pattern will be:
        - Read MODEL_PROVIDER to decide which SDK to use
        - Return a LangChain-compatible chat model with streaming enabled
        - Never hardcode model names in agent/node files — always call this

    See ai-service/CLAUDE.md "Model Agnosticism" section for the full pattern.
    """
    raise NotImplementedError(
        "get_llm() will be implemented in Phase 3. "
        "Phase 0 is foundation only — no AI logic yet."
    )
