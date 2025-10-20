from __future__ import annotations

import io
import uuid
from datetime import datetime
from typing import Any, Dict

from llm_handler import LLMHandler
from firebase_client import FirebaseClient
from jd_llm_service import JDLLMService


class JDService:
    def __init__(self, firebase: FirebaseClient | None = None, llm: LLMHandler | None = None) -> None:
        self.firebase = firebase or FirebaseClient()
        self.llm = llm or LLMHandler()
        self.jd_llm = JDLLMService()  # Use specialized JD LLM service

    async def generate_jd_text(self, payload: Dict[str, Any]) -> str:
        # Use the specialized JD LLM service for better results
        try:
            jd_sections = await self.jd_llm.generate_job_description(payload)
            return self._format_jd_sections(jd_sections)
        except Exception as e:
            print(f"Error with specialized JD service: {e}")
            # Fallback to original method
            prompt = self._build_prompt(payload)
            text = await self.llm.generate_response(prompt)
            return text

    def _format_jd_sections(self, jd_sections: Dict[str, Any]) -> str:
        """Format structured JD sections into readable text"""
        formatted_text = f"{jd_sections.get('summary', '')}\n\n"
        
        if jd_sections.get('responsibilities'):
            formatted_text += "Key Responsibilities:\n"
            for resp in jd_sections['responsibilities']:
                formatted_text += f"• {resp}\n"
            formatted_text += "\n"
        
        if jd_sections.get('required_skills'):
            formatted_text += "Required Skills:\n"
            for skill in jd_sections['required_skills']:
                formatted_text += f"• {skill}\n"
            formatted_text += "\n"
        
        if jd_sections.get('qualifications'):
            formatted_text += "Qualifications:\n"
            for qual in jd_sections['qualifications']:
                formatted_text += f"• {qual}\n"
            formatted_text += "\n"
        
        if jd_sections.get('benefits'):
            formatted_text += "Benefits & Perks:\n"
            for benefit in jd_sections['benefits']:
                formatted_text += f"• {benefit}\n"
        
        return formatted_text.strip()

    def export_pdf(self, title: str, text: str) -> bytes:
        # Lightweight PDF via reportlab fallback if available; else simple text-as-bytes placeholder
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.pdfgen import canvas
            buffer = io.BytesIO()
            c = canvas.Canvas(buffer, pagesize=A4)
            width, height = A4
            y = height - 50
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, y, title)
            y -= 20
            c.setFont("Helvetica", 11)
            for line in text.splitlines():
                if y < 50:
                    c.showPage()
                    y = height - 50
                    c.setFont("Helvetica", 11)
                c.drawString(50, y, line[:110])
                y -= 16
            c.showPage()
            c.save()
            return buffer.getvalue()
        except Exception:
            return text.encode("utf-8")

    def _build_prompt(self, payload: Dict[str, Any]) -> str:
        role = payload.get("role", "Role")
        dept = payload.get("department", "General")
        exp = payload.get("experience", "0-1 years")
        skills = ", ".join(payload.get("skills", [])) or payload.get("skills", "")
        location = payload.get("location", "Remote/Hybrid")
        employment = payload.get("employment_type", "Full-time")
        responsibilities = "\n- ".join(payload.get("responsibilities", [])) if payload.get("responsibilities") else ""
        company = payload.get("company", "Our Company")
        extra = payload.get("additional_notes", "")
        return (
            "You are an HR expert. Draft a clear, inclusive, and attractive Job Description (JD) with the following details. "
            "Structure it with title, summary, responsibilities, required skills, preferred qualifications, and benefits.\n\n"
            f"Role: {role}\nDepartment: {dept}\nExperience: {exp}\n"
            f"Skills: {skills}\nLocation: {location}\nEmployment: {employment}\n"
            f"Company: {company}\nResponsibilities:\n- {responsibilities}\n"
            f"Additional Notes: {extra}\n"
            "Ensure the JD is concise and scannable."
        )

    def upload_assets(self, jd_id: str, title: str, pdf_bytes: bytes, jd_text: str) -> Dict[str, str]:
        # Skip file uploads if Storage not available (no billing)
        # Store JD text directly in Firestore metadata instead
        return {"pdf_url": "", "txt_url": "", "jd_text": jd_text}

    def save_metadata(self, jd_id: str, meta: Dict[str, Any]) -> None:
        meta_with_ts = {**meta, "updated_at": datetime.utcnow().isoformat() + "Z"}
        self.firebase.save_metadata("job_descriptions", jd_id, meta_with_ts)

    def generate_id(self) -> str:
        return uuid.uuid4().hex


