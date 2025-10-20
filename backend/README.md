## HRMS Chatbot FastAPI Backend

Endpoints:
- POST `/chat`: { user_id, query, session_id? } -> { session_id, response, intent, context }
- GET `/health`

### Local development
1. Create venv and install deps
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # on Windows PowerShell
pip install -r requirements.txt
```
2. Run server
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
3. Configure Next.js to call `http://localhost:8000` via `NEXT_PUBLIC_BACKEND_BASE` env.

### Environment variables (optional)
- `LLM_PROVIDER` = gemini | openai | huggingface
- `GEMINI_API_KEY`, `OPENAI_API_KEY`, `HUGGINGFACE_API_KEY`

### Deployment suggestions
- Render: Python FastAPI, auto-deploy from repo; simple and free tier available
- Railway/Zeet/Fly.io: quick Docker-free deploys
- Google Cloud Run: containerized deploy with autoscaling


