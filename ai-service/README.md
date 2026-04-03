# CIVSail AI Service

Python backend powering CIVSail's AI career advisor and NMC monitor. Runs alongside the Next.js frontend as a separate service.

## Setup

### 1. Create the virtual environment

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create your .env file

```bash
cp .env.example .env
```

Then fill in the values:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase dashboard → Settings → API → service_role key (not anon) |
| `AI_SERVICE_SECRET` | Generate any strong random string — must match the value in Next.js .env.local |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys (not needed until Phase 3) |
| `OPENAI_API_KEY` | platform.openai.com → API Keys (not needed until Phase 1 for embeddings) |

### 4. Run the server

```bash
uvicorn main:app --reload --port 8000
```

The `--reload` flag auto-restarts on code changes. Remove it in production.

## Verify it's working

Health check (no auth required):
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "ok", "environment": "development"}
```

Test the advisor endpoint (requires auth):
```bash
curl -X POST http://localhost:8000/advisor/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AI_SERVICE_SECRET" \
  -d '{"user_id": "test", "message": "hello"}'
```

Expected response:
```json
{"response": "not implemented yet", "user_id": "test"}
```

## Running tests

```bash
pytest
```

No tests exist yet — they'll be added starting in Phase 1.

## Architecture

See `CLAUDE.md` in this directory for full architecture documentation including the LangGraph agent design, RAG pipeline, and rules engine.

## Project structure

```
ai-service/
├── main.py          FastAPI entry point
├── config.py        Env vars and model factory
├── db/
│   ├── client.py    Supabase connection
│   └── profiles.py  User profile queries
├── agents/          LangGraph graphs (Phase 3+)
├── tools/           LangChain tools (Phase 3+)
├── rag/             RAG pipeline (Phase 1+)
├── rules/           Deterministic rules engine (Phase 2+)
├── monitor/         NMC monitor agent (Phase 4+)
└── tests/           pytest test files
```
