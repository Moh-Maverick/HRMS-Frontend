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
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
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
    component_scores: Optional[Dict[str, Any]] = None
    skill_analysis: Optional[Dict[str, Any]] = None
    keyword_analysis: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ResumeScreeningService:
    """Service class for resume screening operations"""
    
    def __init__(self):
        self.parser = EnhancedResumeParser()
        self.matcher = SkillMatcher(use_ai=False)
        self.scorer = ResumeScorer()
        
        # Initialize Gemini analyzer with error handling
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            print(f"🔍 Environment check - GEMINI_API_KEY: {'***' + api_key[-4:] if api_key else 'NOT_FOUND'}")
            if api_key:
                self.gemini_analyzer = GeminiResumeAnalyzer()
                print("✓ Gemini analyzer initialized successfully")
            else:
                print("⚠ GEMINI_API_KEY not found, AI analysis disabled")
                self.gemini_analyzer = None
        except Exception as e:
            print(f"⚠ Gemini analyzer initialization failed: {e}")
            self.gemini_analyzer = None
        
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
            
            print(f"No job data found for job_id: {job_id}, using fallback config")
            return self._create_fallback_job_config(job_id)
            
        except Exception as e:
            print(f"Error fetching job requirements: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch job requirements")
    
    def _format_job_config(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format job data into screening config"""
        job_description = job_data.get('description') or job_data.get('jd_text', '')
        
        # Extract experience requirement from job description
        required_experience_years = self._extract_experience_requirement(job_description)
        print(f"Extracted experience requirement: {required_experience_years} years")
        
        return {
            'job_title': job_data.get('title') or job_data.get('role', 'Unknown Position'),
            'job_description': job_description,
            'required_skills': job_data.get('skills', []) or job_data.get('requirements', []),
            'optional_skills': [],  # Can be extended later
            'custom_keywords': [],
            'required_education_level': 3,  # Bachelor's degree level
            'required_experience_years': required_experience_years,
            'target_domain': job_data.get('department', 'Any')
        }
    
    def _extract_experience_requirement(self, job_description: str) -> int:
        """Extract experience requirement from job description text"""
        import re
        
        if not job_description:
            return 0
        
        # Convert to lowercase for case-insensitive matching
        desc_lower = job_description.lower()
        
        # Look for patterns like "3-5 years", "2+ years", "5 years", etc.
        patterns = [
            r'(\d+)\s*-\s*(\d+)\s*years?',  # "3-5 years"
            r'(\d+)\s*\+\s*years?',          # "2+ years"
            r'(\d+)\s*years?',               # "5 years"
            r'(\d+)\s*to\s*(\d+)\s*years?',  # "3 to 5 years"
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, desc_lower)
            if matches:
                print(f"Found experience pattern '{pattern}' with matches: {matches}")
                if isinstance(matches[0], tuple):
                    # For ranges like "3-5 years", take the minimum
                    min_years = int(matches[0][0])
                    max_years = int(matches[0][1])
                    print(f"Using minimum years from range: {min_years}")
                    return min_years
                else:
                    # For single values like "5 years"
                    years = int(matches[0])
                    print(f"Using single value: {years}")
                    return years
        
        # Look for senior/junior keywords
        if 'senior' in desc_lower:
            print("Found 'senior' keyword, using 5 years requirement")
            return 5  # Senior typically requires 5+ years
        elif 'junior' in desc_lower or 'entry' in desc_lower:
            print("Found 'junior' or 'entry' keyword, using 0 years requirement")
            return 0  # Junior/entry level
        elif 'mid' in desc_lower or 'intermediate' in desc_lower:
            print("Found 'mid' or 'intermediate' keyword, using 3 years requirement")
            return 3  # Mid-level typically requires 3+ years
        
        print("No experience requirement found, using default 0 years")
        return 0  # Default if no experience requirement found
    
    def _create_fallback_job_config(self, job_id: str) -> Dict[str, Any]:
        """Create a fallback job config when job data is not found"""
        print(f"Creating fallback job config for job_id: {job_id}")
        fallback_description = 'General software engineering position'
        return {
            'job_title': 'Software Engineer',
            'job_description': fallback_description,
            'required_skills': ['Python', 'JavaScript', 'SQL', 'Git'],
            'optional_skills': ['React', 'Node.js', 'AWS', 'Docker'],
            'custom_keywords': ['programming', 'development', 'coding'],
            'required_education_level': 3,  # Bachelor's degree
            'required_experience_years': self._extract_experience_requirement(fallback_description),
            'target_domain': 'IT'
        }

    def _calculate_matched_skills(self, parsed_data: Dict, required_skills: List[str]) -> List[str]:
        """Calculate which required skills the candidate has"""
        if not required_skills:
            return []
        
        candidate_skills = []
        if isinstance(parsed_data.get('skills'), dict):
            candidate_skills = parsed_data['skills'].get('skills', [])
        elif isinstance(parsed_data.get('skills'), list):
            candidate_skills = parsed_data['skills']
        
        # Ensure all skills are strings
        candidate_skills = [str(skill) for skill in candidate_skills if skill]
        required_skills = [str(skill) for skill in required_skills if skill]
        
        matched = []
        for req_skill in required_skills:
            for cand_skill in candidate_skills:
                try:
                    if (req_skill.lower() in cand_skill.lower() or 
                        cand_skill.lower() in req_skill.lower() or
                        req_skill.lower() == cand_skill.lower()):
                        matched.append(req_skill)
                        break
                except AttributeError:
                    # Skip if not a string
                    continue
        
        return matched

    def _calculate_missing_skills(self, parsed_data: Dict, required_skills: List[str]) -> List[str]:
        """Calculate which required skills the candidate is missing"""
        matched = self._calculate_matched_skills(parsed_data, required_skills)
        return [skill for skill in required_skills if skill not in matched]
    
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
                
                # Calculate comprehensive scores and analysis
                overall_score_data = self.scorer.calculate_overall_score(parsed_data, job_config)
                overall_score = overall_score_data.get('overall_score', 0)
                
                # Extract component scores with better defaults
                education_score = overall_score_data.get('education_score', 0)
                experience_score = overall_score_data.get('experience_score', 0)
                domain_score = overall_score_data.get('domain_alignment_score', 0)
                language_score = overall_score_data.get('language_quality_score', 0)
                skill_match_score = skill_match.get('relevance_score', 0)
                
                # Calculate skill match score manually if needed
                if skill_match_score == 0:
                    required_skills = job_config.get('required_skills', [])
                    candidate_skills = []
                    if isinstance(parsed_data.get('skills'), dict):
                        candidate_skills = parsed_data['skills'].get('skills', [])
                    elif isinstance(parsed_data.get('skills'), list):
                        candidate_skills = parsed_data['skills']
                    
                    # Ensure all skills are strings
                    candidate_skills = [str(skill) for skill in candidate_skills if skill]
                    required_skills = [str(skill) for skill in required_skills if skill]
                    
                    if required_skills and candidate_skills:
                        matched_count = 0
                        for req_skill in required_skills:
                            for cand_skill in candidate_skills:
                                try:
                                    if (req_skill.lower() in cand_skill.lower() or 
                                        cand_skill.lower() in req_skill.lower() or
                                        req_skill.lower() == cand_skill.lower()):
                                        matched_count += 1
                                        break
                                except AttributeError:
                                    continue
                        
                        # Calculate skill match percentage
                        skill_match_percentage = (matched_count / len(required_skills)) * 100
                        
                        # Apply penalty for missing critical skills
                        missing_skills_penalty = 0
                        if matched_count < len(required_skills):
                            missing_ratio = (len(required_skills) - matched_count) / len(required_skills)
                            # Apply exponential penalty for missing skills
                            missing_skills_penalty = missing_ratio * 30  # Up to 30% penalty
                        
                        skill_match_score = max(0, skill_match_percentage - missing_skills_penalty)
                
                # Calculate education score manually if needed
                if education_score == 0:
                    education_level = parsed_data.get('education', {})
                    if isinstance(education_level, dict):
                        degree = education_level.get('degree', '').lower()
                        if 'btech' in degree or 'bachelor' in degree or 'b.e' in degree or 'b.tech' in degree:
                            education_score = 90  # BTech gets high score
                        elif 'master' in degree or 'mtech' in degree or 'm.e' in degree:
                            education_score = 95  # Masters gets highest score
                        elif 'diploma' in degree:
                            education_score = 60
                        else:
                            education_score = 40
                    else:
                        # Check if education field contains BTech keywords
                        education_text = str(parsed_data.get('education', '')).lower()
                        if 'btech' in education_text or 'bachelor' in education_text or 'b.e' in education_text:
                            education_score = 90
                        else:
                            education_score = 50  # Default for unknown education
                
                # Calculate experience score manually if needed
                if experience_score == 0:
                    experience_years = parsed_data.get('experience', {}).get('total_years', 0)
                    if isinstance(experience_years, str):
                        try:
                            experience_years = float(experience_years)
                        except:
                            experience_years = 0
                    
                    # Get required experience from job
                    required_exp = job_config.get('required_experience_years', 0)
                    if isinstance(required_exp, str):
                        try:
                            required_exp = float(required_exp)
                        except:
                            required_exp = 0
                    
                    # Calculate score based on experience vs requirement
                    if experience_years >= required_exp and required_exp > 0:
                        # Meets or exceeds requirement
                        if experience_years >= required_exp * 1.5:
                            experience_score = 95  # Overqualified
                        else:
                            experience_score = 85  # Meets requirement
                    elif experience_years > 0 and required_exp > 0:
                        # Has some experience but less than required
                        ratio = experience_years / required_exp
                        experience_score = max(20, ratio * 60)  # 20-60% based on ratio
                    elif experience_years == 0 and required_exp == 0:
                        # No experience required, fresh graduate
                        experience_score = 70  # Fresh graduate score
                    else:
                        # No experience when experience is required
                        experience_score = 10  # Very low score
                
                # Calculate domain score manually if needed
                if domain_score == 0:
                    candidate_domain = parsed_data.get('domain', '')
                    if isinstance(candidate_domain, dict):
                        candidate_domain = str(candidate_domain.get('domain', ''))
                    candidate_domain = str(candidate_domain).lower()
                    
                    target_domain = str(job_config.get('target_domain', '')).lower()
                    if candidate_domain == target_domain or 'it' in candidate_domain:
                        domain_score = 85
                    else:
                        domain_score = 60
                
                # Calculate language score manually if needed
                if language_score == 0:
                    language_quality = parsed_data.get('language_quality', {})
                    if isinstance(language_quality, dict):
                        language_score = language_quality.get('score', 70)
                    else:
                        language_score = 70  # Default reasonable score
                
                # Calculate weighted overall score
                weighted_score = (
                    education_score * 0.15 +
                    experience_score * 0.20 +
                    domain_score * 0.10 +
                    language_score * 0.10 +
                    skill_match_score * 0.45
                )
                
                # Use the better score
                final_overall_score = max(overall_score, weighted_score)
                
                # Generate realistic recommendation based on score
                if final_overall_score >= 80:
                    recommendation = "Highly recommended - Strong match for the position"
                elif final_overall_score >= 65:
                    recommendation = "Recommended - Good fit with minor gaps"
                elif final_overall_score >= 50:
                    recommendation = "Consider with reservations - Significant skill gaps"
                elif final_overall_score >= 35:
                    recommendation = "Not recommended - Major skill mismatch"
                else:
                    recommendation = "Strongly not recommended - Poor fit for the role"
                
                # Create comprehensive analysis
                comprehensive_analysis = {
                    'overall_assessment': f'Resume analysis completed with {final_overall_score:.1f}% overall score',
                    'strengths': [],
                    'weaknesses': [],
                    'recommendation': recommendation,
                    'component_scores': {
                        'education': education_score,
                        'experience': experience_score,
                        'domain': domain_score,
                        'language': language_score,
                        'skill_match': skill_match_score
                    },
                    'skill_analysis': {
                        'matched_required': self._calculate_matched_skills(parsed_data, job_config.get('required_skills', [])),
                        'missing_required': self._calculate_missing_skills(parsed_data, job_config.get('required_skills', [])),
                        'matched_optional': self._calculate_matched_skills(parsed_data, job_config.get('optional_skills', [])),
                        'all_candidate_skills': parsed_data.get('skills', {}).get('skills', []) if isinstance(parsed_data.get('skills'), dict) else parsed_data.get('skills', [])
                    },
                    'keyword_analysis': {
                        'coverage_percentage': skill_match_score,
                        'overall_density': skill_match_score * 0.7,  # Simulate density
                        'keywords_found': len(self._calculate_matched_skills(parsed_data, job_config.get('required_skills', []))),
                        'keywords_missing': len(self._calculate_missing_skills(parsed_data, job_config.get('required_skills', [])))
                    },
                    'education_details': overall_score_data.get('education_details', {}),
                    'experience_details': overall_score_data.get('experience_details', {}),
                    'domain_details': overall_score_data.get('domain_details', {})
                }
                
                result = {
                    'success': True,
                    'ai_score': final_overall_score,
                    'parsed_data': parsed_data,
                    'analysis': comprehensive_analysis,
                    'component_scores': comprehensive_analysis['component_scores'],
                    'skill_analysis': comprehensive_analysis['skill_analysis'],
                    'keyword_analysis': comprehensive_analysis['keyword_analysis']
                }
                
                # Use AI analysis if enabled
                if request.enable_ai and self.gemini_analyzer:
                    try:
                        print(f"Starting AI analysis for {request.candidate_name}")
                        ai_analysis = self.gemini_analyzer.analyze_resume(parsed_data, job_config)
                        print(f"AI analysis result type: {type(ai_analysis)}")
                        print(f"AI analysis result: {ai_analysis}")
                        
                        if isinstance(ai_analysis, dict) and ai_analysis.get('success'):
                            analysis_data = ai_analysis.get('analysis', {})
                            if isinstance(analysis_data, dict):
                                # Use AI-generated scores and analysis
                                ai_component_scores = analysis_data.get('component_scores', {})
                                ai_skill_analysis = analysis_data.get('skill_analysis', {})
                                ai_overall_score = analysis_data.get('overall_score', final_overall_score)
                                
                                # Update result with AI data
                                result['ai_score'] = ai_overall_score
                                result['analysis'] = analysis_data
                                result['component_scores'] = ai_component_scores
                                result['skill_analysis'] = ai_skill_analysis
                                
                                print(f"✓ AI analysis completed for {request.candidate_name} - Score: {ai_overall_score}")
                            else:
                                print(f"⚠ AI analysis returned non-dict analysis: {type(analysis_data)}")
                        else:
                            print(f"⚠ AI analysis failed, using fallback analysis")
                    except Exception as e:
                        print(f"⚠ AI analysis failed: {e}")
                        # Keep comprehensive analysis as fallback
                elif request.enable_ai and not self.gemini_analyzer:
                    print("⚠ AI analysis requested but Gemini analyzer not available")
                
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
