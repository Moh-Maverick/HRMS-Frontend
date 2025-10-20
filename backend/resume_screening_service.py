"""
Resume Screening Service
Integrates teammate's resume screening functionality with FastAPI
"""

import os
import json
import base64
import tempfile
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enhanced_resume_parser import EnhancedResumeParser
from skill_matcher import SkillMatcher
from resume_scorer import ResumeScorer
from gemini_analyzer import GeminiResumeAnalyzer
from firebase_client import FirebaseClient


class ResumeScreeningRequest(BaseModel):
    """Request model for resume screening"""
    resume_base64: str = Field(..., description="Base64 encoded resume PDF")
    resume_filename: str = Field(..., description="Original filename of the resume")
    job_id: str = Field(..., description="Job ID to get requirements from")
    candidate_name: str = Field(..., description="Candidate name")
    enable_ai: bool = Field(True, description="Enable AI-powered analysis")


class ResumeScreeningResponse(BaseModel):
    """Response model for resume screening"""
    success: bool
    ai_score: Optional[float] = None
    analysis: Optional[Dict[str, Any]] = None
    parsed_data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ResumeScreeningService:
    """Service class for resume screening operations"""
    
    def __init__(self):
        self.parser = EnhancedResumeParser()
        self.matcher = SkillMatcher(use_ai=False)
        self.scorer = ResumeScorer()
        self.gemini_analyzer = GeminiResumeAnalyzer()
        self.firebase = FirebaseClient()
    
    def get_job_requirements(self, job_id: str) -> Dict[str, Any]:
        """Get job requirements from Firebase"""
        try:
            print(f"Fetching job requirements for job_id: {job_id}")
            
            # Try to get from jobs collection first
            job_data = self.firebase.get_metadata('jobs', job_id)
            if job_data:
                print(f"Found job data in 'jobs' collection: {job_data}")
                return self._format_job_config(job_data)
            
            # Fallback to job_descriptions collection
            jd_data = self.firebase.get_metadata('job_descriptions', job_id)
            if jd_data:
                print(f"Found job data in 'job_descriptions' collection: {jd_data}")
                return self._format_job_config(jd_data)
            
            print(f"No job data found for job_id: {job_id}")
            raise HTTPException(status_code=404, detail="Job not found")
            
        except Exception as e:
            print(f"Error fetching job requirements: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch job requirements")
    
    def _format_job_config(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format job data into screening config"""
        return {
            'job_title': job_data.get('title') or job_data.get('role', 'Unknown Position'),
            'job_description': job_data.get('description') or job_data.get('jd_text', ''),
            'required_skills': job_data.get('skills', []) or job_data.get('requirements', []),
            'optional_skills': [],  # Can be extended later
            'custom_keywords': [],
            'required_education_level': 'Bachelor',  # Default
            'required_experience_years': 0,  # Default
            'target_domain': job_data.get('department', 'Any')
        }
    
    def screen_resume(self, request: ResumeScreeningRequest) -> ResumeScreeningResponse:
        """Main resume screening function"""
        try:
            # Get job requirements
            job_config = self.get_job_requirements(request.job_id)
            
            # Decode base64 resume
            resume_bytes = base64.b64decode(request.resume_base64)
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(resume_bytes)
                temp_file_path = temp_file.name
            
            try:
                # Parse resume
                parsed_data = self.parser.parse_resume(temp_file_path)
                print(f"✓ Resume parsed successfully for {request.candidate_name}")
                
                # Calculate basic scores using the original method
                overall_score_data = self.scorer.calculate_overall_score(parsed_data, job_config)
                overall_score = overall_score_data.get('overall_score', 0)
                
                # Skill matching using the original method
                skill_match = self.matcher.match_against_job_description(
                    parsed_data,
                    job_config.get('job_description', ''),
                    job_config.get('required_skills', []),
                    job_config.get('optional_skills', []),
                    job_config.get('custom_keywords', [])
                )
                
                result = {
                    'success': True,
                    'ai_score': overall_score,
                    'parsed_data': parsed_data,
                    'analysis': {
                        'overall_assessment': 'Resume analysis completed',
                        'strengths': [],
                        'weaknesses': [],
                        'recommendation': 'Manual review recommended'
                    }
                }
                
                # Add AI analysis if enabled
                if request.enable_ai:
                    try:
                        ai_analysis = self.gemini_analyzer.analyze_resume(parsed_data, job_config)
                        if ai_analysis.get('success'):
                            result['analysis'] = ai_analysis.get('analysis', result['analysis'])
                        print(f"✓ AI analysis completed for {request.candidate_name}")
                    except Exception as e:
                        print(f"⚠ AI analysis failed: {e}")
                        # Keep default analysis
                
                return ResumeScreeningResponse(**result)
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            print(f"✗ Resume screening failed: {e}")
            return ResumeScreeningResponse(
                success=False,
                error=str(e)
            )


# Initialize service
resume_service = ResumeScreeningService()


def create_resume_screening_app() -> FastAPI:
    """Create FastAPI app for resume screening"""
    app = FastAPI(
        title="Resume Screening API",
        description="AI-powered resume screening service",
        version="1.0.0"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.post("/screen-resume", response_model=ResumeScreeningResponse)
    async def screen_resume_endpoint(request: ResumeScreeningRequest):
        """Screen a single resume against job requirements"""
        return await resume_service.screen_resume(request)
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {"status": "healthy", "service": "resume-screening"}
    
    return app


# Create the app instance
resume_screening_app = create_resume_screening_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(resume_screening_app, host="0.0.0.0", port=8001)
