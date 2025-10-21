"""
FastAPI backend for HR Chatbot

Exposes POST /chat compatible with the Next.js ChatWidget.tsx:
- Request: { user_id: str, query: str, session_id?: str }
- Response: { session_id: str, response: str, intent: str, context: dict }
"""

from typing import Optional, Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from chatbot_core import HRChatbot
from session_manager import SessionManager
from jd_service import JDService
from resume_screening_service import ResumeScreeningService, ResumeScreeningRequest, ResumeScreeningResponse


class ChatRequest(BaseModel):
    user_id: str = Field(..., description="Employee/user unique id")
    query: str = Field(..., description="User message")
    session_id: Optional[str] = Field(None, description="Existing chat session id")


class ChatResponse(BaseModel):
    session_id: str
    response: str
    intent: str
    context: Dict[str, Any]


class JDGenerateRequest(BaseModel):
    role: str
    department: str | None = None
    experience: str | None = None
    skills: list[str] | None = None
    location: str | None = None
    employment_type: str | None = None
    responsibilities: list[str] | None = None
    company: str | None = None
    additional_notes: str | None = None


class JDGenerateResponse(BaseModel):
    id: str
    title: str
    text_url: str
    pdf_url: str
    metadata: Dict[str, Any]


app = FastAPI(title="HRMS Chatbot API", version="1.0.0")

# CORS: Allow all origins for now (can be restricted later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Changed to False to allow wildcard origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


session_manager = SessionManager()
chatbot = HRChatbot(session_manager=session_manager)
jds = JDService()
resume_screening_service = ResumeScreeningService()


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "cors": "enabled"}

@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle preflight OPTIONS requests for CORS"""
    return {"message": "OK"}


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    result = await chatbot.process_query(
        user_id=payload.user_id, query=payload.query, session_id=payload.session_id
    )
    return ChatResponse(
        session_id=result["session_id"],
        response=result["response"],
        intent=result["intent"],
        context=result["context"],
    )


@app.post("/jd/generate", response_model=JDGenerateResponse)
async def generate_jd(payload: JDGenerateRequest) -> JDGenerateResponse:
    jd_id = jds.generate_id()
    title = f"Job Description - {payload.role}"
    text = await jds.generate_jd_text(payload.dict(exclude_none=True))
    pdf = jds.export_pdf(title, text)
    urls = jds.upload_assets(jd_id, title, pdf, text)
    meta = {"role": payload.role, **payload.dict(exclude_none=True), "title": title, "jd_text": urls["jd_text"]}
    jds.save_metadata(jd_id, meta)
    return JDGenerateResponse(id=jd_id, title=title, text_url=urls["txt_url"], pdf_url=urls["pdf_url"], metadata=meta)


@app.get("/jd/{jd_id}")
def get_jd(jd_id: str) -> Dict[str, Any]:
    data = jds.firebase.get_metadata("job_descriptions", jd_id) or {}
    return {"id": jd_id, **data}


@app.post("/resume/screen", response_model=ResumeScreeningResponse)
def screen_resume(request: ResumeScreeningRequest) -> ResumeScreeningResponse:
    """Screen a resume against job requirements using AI"""
    return resume_screening_service.screen_resume(request)


if __name__ == "__main__":
    # Run: python backend/app.py
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)


