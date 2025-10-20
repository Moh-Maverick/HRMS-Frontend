"""
Dedicated LLM service for job description generation
Based on the AI Job Description Generator implementation
"""
import os
import httpx
from typing import Dict, List, Any, Optional
import re


class JDLLMService:
    """Specialized LLM service for generating structured job descriptions using Gemini"""
    
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
    async def generate_job_description(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a structured job description using Gemini AI
        
        Args:
            job_data: Dictionary containing job details
            
        Returns:
            Dictionary with structured JD sections
        """
        try:
            print(f"Generating JD for role: {job_data.get('role', 'Unknown')}")
            print(f"Skills provided: {job_data.get('skills', [])}")
            
            # Build the specialized prompt for job description generation
            prompt = self._build_jd_prompt(job_data)
            
            # Generate content using Gemini API
            if self.gemini_api_key:
                print("Using Gemini API for JD generation")
                raw_text = await self._generate_gemini_jd(prompt)
            else:
                print("Using fallback JD generation (GEMINI_API_KEY not configured)")
                print("💡 TIP: Set GEMINI_API_KEY in your .env file for AI-powered JD generation")
                # Fallback to basic generation
                raw_text = await self._generate_fallback_jd(job_data)
            
            print(f"Generated text length: {len(raw_text)} characters")
            
            # Parse the response into structured format
            jd_sections = self._parse_ai_response(raw_text)
            
            print(f"Parsed sections: {list(jd_sections.keys())}")
            print(f"Skills in parsed result: {jd_sections.get('required_skills', [])}")
            
            # Validate and apply fallbacks if needed
            if not self._validate_sections(jd_sections):
                print("Validation failed, applying fallback sections")
                jd_sections = self._apply_fallback_sections(jd_sections, job_data)
            
            print(f"Final skills count: {len(jd_sections.get('required_skills', []))}")
            return jd_sections
            
        except Exception as e:
            print(f"Error generating JD with Gemini: {e}")
            import traceback
            traceback.print_exc()
            # Return fallback template on failure
            return self._create_fallback_jd(job_data)
    
    def _build_jd_prompt(self, job_data: Dict[str, Any]) -> str:
        """Build a comprehensive prompt for JD generation"""
        role = job_data.get("role", "Software Engineer")
        department = job_data.get("department", "Engineering")
        experience = job_data.get("experience", "2-4 years")
        skills = job_data.get("skills", [])
        location = job_data.get("location", "Remote")
        employment_type = job_data.get("employment_type", "Full-time")
        company = job_data.get("company", "Our Company")
        additional_notes = job_data.get("additional_notes", "")
        responsibilities = job_data.get("responsibilities", [])
        
        skills_str = ", ".join(skills) if skills else "Relevant technical skills"
        responsibilities_str = "\n".join([f"- {resp}" for resp in responsibilities]) if responsibilities else ""
        
        prompt = f"""You are an expert HR professional and technical recruiter with 10+ years of experience. Generate a professional, detailed, and engaging job description for the following role using Gemini AI.

**Position Details:**
- Job Title: {role}
- Department: {department}
- Experience Required: {experience}
- Location: {location}
- Employment Type: {employment_type}
- Company: {company}

**MANDATORY SKILLS TO INCLUDE (ALL OF THESE MUST BE LISTED):**
{skills_str}

{f"**SPECIFIC RESPONSIBILITIES PROVIDED:**\n{responsibilities_str}" if responsibilities_str else ""}

{f"**ADDITIONAL NOTES:**\n{additional_notes}" if additional_notes else ""}

**CRITICAL REQUIREMENTS FOR GEMINI:**
1. You MUST include ALL the provided skills in the Required Skills section
2. Create a professional, industry-standard job description
3. Use specific, technical language appropriate for the role
4. Make it competitive and attractive to top talent
5. Include modern technologies and methodologies
6. Structure the response exactly as requested below

**Instructions:**
Create a comprehensive job description with the following sections. Provide the response in EXACTLY this format:

JOB SUMMARY:
[Write 2-3 engaging sentences about the role, company impact, and growth opportunities]

RESPONSIBILITIES:
- [Specific responsibility 1]
- [Specific responsibility 2]
- [Specific responsibility 3]
- [Specific responsibility 4]
- [Specific responsibility 5]
- [Specific responsibility 6]

REQUIRED SKILLS:
- [MUST include ALL provided skills: {skills_str}]
- [Add 2-3 complementary technical skills]
- [Add 2-3 soft skills]

QUALIFICATIONS:
- [Educational requirement]
- [Experience requirement: {experience}]
- [Technical certification if relevant]
- [Additional qualification]

BENEFITS:
- [Competitive benefit 1]
- [Competitive benefit 2]
- [Competitive benefit 3]
- [Competitive benefit 4]
- [Competitive benefit 5]

**IMPORTANT:** Ensure ALL provided skills ({skills_str}) are explicitly listed in the Required Skills section. Do not omit any of them."""
        return prompt
    
    async def _generate_gemini_jd(self, prompt: str) -> str:
        """Generate JD content using Gemini API with optimized settings"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1/models/{self.gemini_model}:generateContent?key={self.gemini_api_key}"
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 3000,  # Increased for longer, detailed JDs
                    "topP": 0.95,
                    "topK": 40,
                    "candidateCount": 1
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH", 
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(url, headers=headers, json=data)
                resp.raise_for_status()
                result = resp.json()
                
                if "candidates" in result and result["candidates"]:
                    candidate = result["candidates"][0]
                    parts = candidate.get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
                
                # Handle potential safety blocks
                if "promptFeedback" in result:
                    print(f"Gemini safety feedback: {result['promptFeedback']}")
                
                return ""
                
        except httpx.HTTPStatusError as e:
            print(f"Gemini API HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            print(f"Gemini API error: {e}")
            raise
    
    async def _generate_fallback_jd(self, job_data: Dict[str, Any]) -> str:
        """Generate a basic fallback JD when AI generation fails"""
        role = job_data.get("role", "Software Engineer")
        skills = job_data.get("skills", [])
        experience = job_data.get("experience", "2-4 years")
        location = job_data.get("location", "Remote")
        responsibilities = job_data.get("responsibilities", [])
        
        # Ensure skills is a list
        if isinstance(skills, str):
            skills = [skill.strip() for skill in skills.split(',')]
        
        skills_str = ", ".join(skills) if skills else "relevant technologies"
        
        # Use provided responsibilities or create default ones
        if responsibilities:
            resp_text = "\n".join([f"- {resp}" for resp in responsibilities])
        else:
            primary_skill = skills[0] if skills else "relevant technologies"
            resp_text = f"""- Develop and maintain high-quality applications using {primary_skill}
- Collaborate with cross-functional teams to deliver scalable solutions
- Write clean, maintainable, and well-documented code
- Participate in code reviews and technical discussions
- Implement best practices and design patterns
- Stay updated with latest industry trends and technologies"""
        
        # Create individual skill entries
        skills_list = "\n".join([f"- {skill}" for skill in skills]) if skills else "- Relevant technical skills"
        
        return f"""JOB SUMMARY:
We are seeking a skilled {role} to join our dynamic team in {location}. The ideal candidate will have {experience} of experience and strong expertise in {skills_str}. This role offers excellent opportunities for professional growth and the chance to work on cutting-edge projects.

RESPONSIBILITIES:
{resp_text}

REQUIRED SKILLS:
{skills_list}
- Strong problem-solving abilities
- Excellent communication skills
- Team collaboration
- Attention to detail
- Agile/Scrum methodology

QUALIFICATIONS:
- Bachelor's degree in Computer Science, Engineering, or related field
- {experience} of relevant professional experience
- Strong analytical and problem-solving skills
- Ability to work in a fast-paced, collaborative environment
- Experience with version control systems (Git)

BENEFITS:
- Competitive salary package with performance bonuses
- Comprehensive health and wellness benefits
- Professional development and training opportunities
- Flexible work arrangements and remote work options
- Collaborative and innovative work environment
- Career growth and advancement opportunities"""
    
    def _parse_ai_response(self, raw_text: str) -> Dict[str, Any]:
        """Parse AI response into structured sections"""
        sections = {
            "summary": "",
            "responsibilities": [],
            "required_skills": [],
            "qualifications": [],
            "benefits": []
        }
        
        try:
            # Clean up the text
            text = raw_text.strip()
            
            # Extract summary - more flexible pattern
            summary_patterns = [
                r'JOB SUMMARY:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'SUMMARY:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'OVERVIEW:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in summary_patterns:
                summary_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if summary_match:
                    sections["summary"] = summary_match.group(1).strip()
                    break
            
            # Extract responsibilities - more flexible patterns
            resp_patterns = [
                r'RESPONSIBILITIES:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'KEY RESPONSIBILITIES:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'DUTIES:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in resp_patterns:
                resp_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if resp_match:
                    responsibilities_text = resp_match.group(1).strip()
                    sections["responsibilities"] = [line.strip('- •*').strip() for line in responsibilities_text.split('\n') if line.strip() and not line.strip().startswith(('JOB', 'REQUIRED', 'QUALIFICATIONS', 'BENEFITS'))]
                    break
            
            # Extract required skills - more flexible patterns
            skills_patterns = [
                r'REQUIRED SKILLS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'KEY SKILLS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'TECHNICAL SKILLS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'SKILLS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in skills_patterns:
                skills_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if skills_match:
                    skills_text = skills_match.group(1).strip()
                    skills_list = []
                    for line in skills_text.split('\n'):
                        line = line.strip('- •*').strip()
                        if line and not line.startswith(('QUALIFICATIONS', 'BENEFITS', 'RESPONSIBILITIES')):
                            # Handle comma-separated skills in a single line
                            if ',' in line and not any(word in line.lower() for word in ['communication', 'problem', 'team', 'attention', 'agile']):
                                # Split comma-separated skills
                                individual_skills = [skill.strip() for skill in line.split(',')]
                                skills_list.extend(individual_skills)
                            else:
                                skills_list.append(line)
                    sections["required_skills"] = skills_list
                    break
            
            # Extract qualifications
            qual_patterns = [
                r'QUALIFICATIONS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'REQUIREMENTS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'EDUCATION:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in qual_patterns:
                qual_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if qual_match:
                    qual_text = qual_match.group(1).strip()
                    sections["qualifications"] = [line.strip('- •*').strip() for line in qual_text.split('\n') if line.strip() and not line.strip().startswith(('BENEFITS', 'RESPONSIBILITIES', 'SKILLS'))]
                    break
            
            # Extract benefits
            benefits_patterns = [
                r'BENEFITS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'BENEFITS & PERKS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'COMPENSATION:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in benefits_patterns:
                benefits_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if benefits_match:
                    benefits_text = benefits_match.group(1).strip()
                    sections["benefits"] = [line.strip('- •*').strip() for line in benefits_text.split('\n') if line.strip()]
                    break
                
        except Exception as e:
            print(f"Error parsing AI response: {e}")
        
        return sections
    
    def _validate_sections(self, sections: Dict[str, Any]) -> bool:
        """Validate that all sections have meaningful content"""
        if not sections.get("summary") or len(sections["summary"]) < 20:
            return False
        if not sections.get("responsibilities") or len(sections["responsibilities"]) < 2:
            return False
        if not sections.get("required_skills") or len(sections["required_skills"]) < 2:
            return False
        if not sections.get("qualifications") or len(sections["qualifications"]) < 2:
            return False
        if not sections.get("benefits") or len(sections["benefits"]) < 2:
            return False
        return True
    
    def _apply_fallback_sections(self, sections: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply fallback values to incomplete sections"""
        role = job_data.get("role", "Software Engineer")
        skills = job_data.get("skills", [])
        experience = job_data.get("experience", "2-4 years")
        location = job_data.get("location", "Remote")
        responsibilities = job_data.get("responsibilities", [])
        
        # Fill in missing or invalid sections
        if not sections.get("summary") or len(sections["summary"]) < 20:
            skills_preview = ", ".join(skills[:3]) if skills else "relevant technologies"
            sections["summary"] = f"We are seeking a skilled {role} to join our dynamic team in {location}. The ideal candidate will have {experience} of experience and strong expertise in {skills_preview}. This role offers excellent opportunities for professional growth and the chance to work on cutting-edge projects."
        
        if not sections.get("responsibilities") or len(sections["responsibilities"]) < 2:
            if responsibilities:
                sections["responsibilities"] = responsibilities
            else:
                primary_skill = skills[0] if skills else "relevant technologies"
                sections["responsibilities"] = [
                    f"Develop and maintain high-quality applications using {primary_skill}",
                    "Collaborate with cross-functional teams to deliver scalable solutions",
                    "Write clean, maintainable, and well-documented code",
                    "Participate in code reviews and technical discussions",
                    "Implement best practices and design patterns",
                    "Stay updated with latest industry trends and technologies"
                ]
        
        if not sections.get("required_skills") or len(sections["required_skills"]) < 2:
            # Ensure ALL provided skills are included
            all_skills = skills.copy() if skills else []
            # Add complementary skills
            complementary_skills = [
                "Strong problem-solving abilities",
                "Excellent communication skills",
                "Team collaboration",
                "Attention to detail",
                "Agile/Scrum methodology"
            ]
            sections["required_skills"] = all_skills + complementary_skills
        
        if not sections.get("qualifications") or len(sections["qualifications"]) < 2:
            sections["qualifications"] = [
                "Bachelor's degree in Computer Science, Engineering, or related field",
                f"{experience} of relevant professional experience",
                "Strong analytical and problem-solving skills",
                "Ability to work in a fast-paced, collaborative environment",
                "Experience with version control systems (Git)"
            ]
        
        if not sections.get("benefits") or len(sections["benefits"]) < 2:
            sections["benefits"] = [
                "Competitive salary package with performance bonuses",
                "Comprehensive health and wellness benefits",
                "Professional development and training opportunities",
                "Flexible work arrangements and remote work options",
                "Collaborative and innovative work environment",
                "Career growth and advancement opportunities"
            ]
        
        return sections
    
    def _create_fallback_jd(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a basic fallback JD when AI generation completely fails"""
        role = job_data.get("role", "Software Engineer")
        skills = job_data.get("skills", [])
        experience = job_data.get("experience", "2-4 years")
        location = job_data.get("location", "Remote")
        responsibilities = job_data.get("responsibilities", [])
        
        skills_preview = ", ".join(skills[:3]) if skills else "relevant technologies"
        
        return {
            "summary": f"We are seeking a skilled {role} to join our dynamic team in {location}. The ideal candidate will have {experience} of experience and strong expertise in {skills_preview}. This role offers excellent opportunities for professional growth and the chance to work on cutting-edge projects.",
            "responsibilities": responsibilities if responsibilities else [
                f"Develop and maintain high-quality applications using {skills[0] if skills else 'relevant technologies'}",
                "Collaborate with cross-functional teams to deliver scalable solutions",
                "Write clean, maintainable, and well-documented code",
                "Participate in code reviews and technical discussions",
                "Implement best practices and design patterns",
                "Stay updated with latest industry trends and technologies"
            ],
            "required_skills": skills + [
                "Strong problem-solving abilities",
                "Excellent communication skills",
                "Team collaboration",
                "Attention to detail",
                "Agile/Scrum methodology"
            ],
            "qualifications": [
                "Bachelor's degree in Computer Science, Engineering, or related field",
                f"{experience} of relevant professional experience",
                "Strong analytical and problem-solving skills",
                "Ability to work in a fast-paced, collaborative environment",
                "Experience with version control systems (Git)"
            ],
            "benefits": [
                "Competitive salary package with performance bonuses",
                "Comprehensive health and wellness benefits",
                "Professional development and training opportunities",
                "Flexible work arrangements and remote work options",
                "Collaborative and innovative work environment",
                "Career growth and advancement opportunities"
            ]
        }
