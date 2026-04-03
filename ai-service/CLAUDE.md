# ai-service/CLAUDE.md — CIVSail Python AI Service

> Read the root CLAUDE.md first for overall project context.
> This file covers the Python AI service specifically.
> Load this file at the start of every session working in ai-service/.

---

## 🤖 What This Service Is

A Python FastAPI service running CIVSail's AI agents. Deployed separately
from the Next.js app (Railway, not Vercel). Communicates with Next.js via
HTTP REST. Shares the same Supabase database using the service_role key.

**This service is not yet built. Phase 0 is the starting point.**

---

## 🗂️ Folder Structure
```
ai-service/
├── main.py                     FastAPI entry point, all endpoints defined here
├── config.py                   Model selection, env vars, get_llm() factory
├── requirements.txt            Python dependencies pinned to versions
├── .env                        Gitignored — never commit
├── .env.example                Committed — all variable names, empty values
├── .python-version             Pins Python to 3.11
├── CLAUDE.md                   This file
│
├── agents/                     LangGraph graphs
│   ├── __init__.py
│   ├── state.py                AdvisorState TypedDict — shared data object
│   ├── advisor_graph.py        Main advisor graph definition
│   └── nodes/                  One file per graph node
│       ├── __init__.py
│       ├── intake.py           Classifies user intent
│       ├── fetch_profile.py    Reads Supabase user data
│       ├── search_regulations.py  RAG retrieval
│       ├── check_requirements.py  Rules engine integration
│       ├── clarify.py          Asks user for missing info, loops back
│       ├── build_plan.py       LLM synthesizes action plan
│       └── respond.py          Formats final response with citations
│
├── tools/                      LangChain @tool decorated functions
│   ├── __init__.py
│   ├── rag_tool.py             search_regulations()
│   ├── profile_tool.py         get_user_profile()
│   ├── ships_tool.py           find_matching_ships()
│   ├── requirements_tool.py    check_license_requirements()
│   ├── courses_tool.py         find_approved_courses()
│   ├── timeline_tool.py        estimate_timeline()
│   └── course_providers/       Provider pattern — swap without touching graph
│       ├── __init__.py
│       ├── base_provider.py    Abstract base class
│       ├── static_provider.py  Phase 1: CSV lookup
│       └── tavily_provider.py  Phase 2: live web search
│
├── rag/                        RAG pipeline
│   ├── __init__.py
│   ├── chunker.py              PDF text → ~500 token segments, 50 token overlap
│   ├── embedder.py             OpenAI embedding wrapper, batches chunks
│   ├── retriever.py            similarity_search(query, top_k) via pgvector
│   └── ingest.py               Full pipeline: PDF → chunks → embeddings → Supabase
│
├── rules/                      Deterministic rules engine — NO LLM CALLS HERE
│   ├── __init__.py
│   ├── license_requirements.py 46 CFR thresholds per license type
│   ├── stcw_requirements.py    Required STCW courses per license level
│   └── medical_requirements.py Physical exam validity periods
│
├── monitor/                    NMC Monitor agent (separate from advisor)
│   ├── __init__.py
│   ├── pipeline.py             Orchestrates the 6-step monitor pipeline
│   ├── scheduler.py            APScheduler — runs pipeline on cron schedule
│   ├── classifier.py           LLM step: page change → NMCUpdate object
│   ├── matcher.py              NMCUpdate → list of affected user_ids
│   ├── personalizer.py         LLM step: update + profile → personal message
│   ├── alerter.py              Sends email (Resend) + in-app notification
│   ├── models.py               NMCUpdate Pydantic model
│   └── fetchers/               One file per monitored NMC page
│       ├── __init__.py
│       ├── base_fetcher.py     Abstract base class all fetchers inherit
│       ├── policy_letters.py   NMC policy letters page
│       ├── exemptions.py       Exemptions and waivers page
│       ├── checklists.py       Checklist PDF change detection
│       └── approved_courses.py Approved course list monitoring
│
├── db/                         Supabase query functions
│   ├── __init__.py
│   ├── client.py               Supabase Python client initialization
│   ├── profiles.py             get_user_profile(), credential queries
│   └── documents.py            insert_chunks(), search_chunks()
│
├── scripts/                    Manual run scripts — never deployed
│   ├── ingest_documents.py     CLI: add a new PDF to the knowledge base
│   ├── test_retrieval.py       Quality check: ask questions, print chunks
│   └── source-documents/       Raw PDFs — gitignored, local only
│
└── tests/
    ├── test_chunker.py
    ├── test_retriever.py
    ├── test_rules_engine.py
    └── test_advisor_graph.py
```

---

## 🏗️ Architecture — Three Layers (Keep Separate)
```
RAG Layer      → retrieves what regulations say       → no reasoning
Rules Engine   → determines if user meets requirements → no LLM
Agent Layer    → reasons about what user should do     → uses LLM
```

**The rules/ folder must contain pure Python logic only.**
Never add LLM calls to rules/. Accuracy comes from deterministic
logic. Communication comes from the LLM reading the rules output.

---

## 📊 AdvisorState — The Shared Data Object

Every graph node reads from and writes to this TypedDict.
Defined in agents/state.py.

| Field | Type | Set By |
|---|---|---|
| messages | list[BaseMessage] | LangGraph (automatic) |
| user_id | str | FastAPI endpoint |
| intent | str | INTAKE node |
| mariner_profile | dict | FETCH_PROFILE node |
| career_goals | dict | FETCH_PROFILE node |
| employer_config | dict | FETCH_PROFILE node |
| regulation_chunks | list[dict] | SEARCH_REGULATIONS node |
| employer_policy_chunks | list[dict] | SEARCH_EMPLOYER_POLICY node |
| requirements_gap | dict | CHECK_REQUIREMENTS node |
| recommended_ships | list[dict] | FIND_MATCHING_SHIPS node |
| recommended_courses | list[dict] | FIND_COURSES node |
| need_clarification | bool | CHECK_REQUIREMENTS node |
| clarification_question | str | CHECK_REQUIREMENTS node |
| action_plan | dict | BUILD_PLAN node |
| final_response | str | RESPOND node |

---

## 🔀 Graph Flow
```
START
  ↓
INTAKE           — classify intent into 6 categories
  ↓
FETCH_PROFILE    — read Supabase: profile + credentials + goals + employer
  ↓
SEARCH (parallel)
  ├── SEARCH_REGULATIONS      — pgvector on CFRs + NMC checklists
  └── SEARCH_EMPLOYER_POLICY  — pgvector on employer policy docs
  ↓
CHECK_REQUIREMENTS — deterministic rules engine, no LLM
  ↓
need_clarification?
  ├── YES → CLARIFY → loop back to FETCH_PROFILE
  └── NO  → continue
  ↓
TOOL CALLS (parallel)
  ├── FIND_MATCHING_SHIPS  — query ship_classes table
  └── FIND_COURSES         — course provider (Phase 1: static list)
  ↓
BUILD_PLAN       — LLM synthesizes everything into action_plan
  ↓
RESPOND          — format with regulation citations, stream to FastAPI
  ↓
END
```

---

## 🔧 LangGraph Patterns
```python
# Node signature — always this shape
def node_name(state: AdvisorState) -> dict:
    # Read from state
    user_id = state["user_id"]
    # Do work
    result = do_something(user_id)
    # Return ONLY the fields this node updates
    return {"field_name": result}

# Never return the full state object
# Never modify state directly
# Always return a dict with only changed fields
```

- Conditional edges return strings, not booleans
- Always compile graph with a checkpointer (Supabase backend)
- Use `use context7` in prompts when writing LangGraph code

---

## 🔄 Model Agnosticism
```python
# config.py — the only place model names appear
def get_llm():
    if MODEL_PROVIDER == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model="claude-sonnet-4-5", streaming=True)
    elif MODEL_PROVIDER == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o", streaming=True)
    elif MODEL_PROVIDER == "huggingface":
        from langchain_huggingface import HuggingFaceEndpoint
        return HuggingFaceEndpoint(repo_id=os.getenv("HF_MODEL_ID"))

# In node files — always import, never hardcode
from config import get_llm
llm = get_llm()
```

Embeddings always use OpenAI regardless of MODEL_PROVIDER.
Embeddings are separate from the chat model.

---

## 🔒 API Security

Every endpoint except GET /health requires the AI_SERVICE_SECRET.
Next.js sends: `Authorization: Bearer {AI_SERVICE_SECRET}`
Python verifies on every request via a FastAPI dependency.
Never skip this check.

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| fastapi | 0.115.0 | Web framework |
| uvicorn | 0.30.0 | ASGI server |
| langgraph | 0.2.0 | Agent graph orchestration |
| langchain | 0.3.0 | Tool definitions, message types |
| langchain-core | 0.3.0 | Core interfaces |
| langchain-anthropic | 0.2.0 | Claude integration |
| langchain-openai | 0.2.0 | GPT-4 + embeddings |
| langchain-huggingface | 0.1.0 | HuggingFace models |
| supabase | 2.7.0 | Python Supabase client |
| pypdf | 4.3.0 | PDF text extraction |
| tiktoken | 0.7.0 | Token counting for chunking |
| python-dotenv | 1.0.0 | Load .env file |
| pydantic | 2.9.0 | Data validation |
| httpx | 0.27.0 | Async HTTP client |
| beautifulsoup4 | 4.12.0 | HTML parsing for NMC monitor |
| apscheduler | 3.10.0 | Cron scheduling for NMC monitor |
| pytest | 8.3.0 | Testing |
| pytest-asyncio | 0.24.0 | Async test support |

---

## 🌍 Environment Variables
```
MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
HUGGINGFACE_API_TOKEN=
HF_MODEL_ID=mistralai/Mistral-7B-Instruct-v0.2
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
AI_SERVICE_SECRET=
ENVIRONMENT=development
```

---

## 🚀 Running Locally
```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Next.js runs simultaneously in a separate terminal on port 3000.

---

## ❌ What NOT To Do

- Do not add LLM calls inside rules/ — rules engine must be deterministic
- Do not hardcode model names anywhere — always use get_llm()
- Do not use the requests library — use httpx async
- Do not store raw PDF content in the database — chunks + embeddings only
- Do not skip AI_SERVICE_SECRET verification on any endpoint
- Do not use print() for logging — use Python logging module
- Do not commit .env — only .env.example is committed
- Do not put scripts/ content in deployed code — scripts/ is local only
- Do not create Supabase tables in the dashboard — write migrations

---

## 📋 Build Status

**Current phase: Phase 0 — not yet started.**

| Phase | Goal | Status |
|---|---|---|
| 0 | FastAPI scaffolding, Supabase connection | Not started |
| 1 | RAG pipeline — ingest PDFs, retrieve chunks | Not started |
| 2 | Rules engine — deterministic CFR logic | Not started |
| 3 | First LangGraph agent end-to-end | Not started |
| 4 | Ships database + Next.js UI integration | Not started |
| 5 | Course finder + employer context | Not started |

---

## ✅ Session Startup Checklist

At the start of every Claude Code session in ai-service/:

1. Read this file
2. Check Build Status above — know which phase you're in
3. Run `use context7` for any LangGraph or FastAPI questions
4. Never modify files outside ai-service/ without checking root CLAUDE.md

---

*CIVSail AI Service — Built by mariners, for mariners.*
