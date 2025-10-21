"""
Dedicated LLM service for job description generation
Based on the AI Job Description Generator implementation
"""
import os
import httpx
from typing import Dict, List, Any, Optional
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


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
        
        # Build the prompt without f-string to avoid backslash issues
        prompt_parts = [
            "Generate a clean, professional job description for this position. Keep it concise and well-structured.",
            "",
            f"**Position:** {role}",
            f"**Department:** {department}",
            f"**Experience:** {experience}",
            f"**Location:** {location}",
            f"**Type:** {employment_type}",
            "",
            f"**Required Skills:** {skills_str}",
            ""
        ]
        
        if responsibilities_str:
            prompt_parts.extend([f"**Responsibilities:**\n{responsibilities_str}", ""])
        
        if additional_notes:
            prompt_parts.extend([f"**Notes:** {additional_notes}", ""])
        
        prompt_parts.extend([
            "Create a job description with these sections only:",
            "",
            "**Job Summary:**",
            "[2-3 sentences about the role and impact]",
            "",
            "**Key Responsibilities:**",
            "- [Responsibility 1]",
            "- [Responsibility 2]", 
            "- [Responsibility 3]",
            "- [Responsibility 4]",
            "",
            "**Required Skills:**",
            "- [Group related skills together like: Python/JavaScript, React/Node.js, HTML/CSS, Git/GitHub, SQL/MongoDB, Docker/AWS]",
            "",
            "**Qualifications:**",
            "- [Education/experience requirements]",
            "",
            "**Benefits:**",
            "- [Key benefits 1-3]",
            "",
            "**Important:**",
            "- Use clean formatting with bullet points",
            "- Group related skills together (e.g., Python/JavaScript, React/Node.js, HTML/CSS)",
            f"- Include ALL provided skills: {skills_str}",
            "- Keep each section concise",
            "- No repetition or extra formatting",
            "- Professional tone"
        ])
        
        prompt = "\n".join(prompt_parts)
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
                    "maxOutputTokens": 1500,  # Reduced for cleaner, concise JDs
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
        
        # Create grouped skill entries
        def group_skills(skills_list):
            """Group related skills together"""
            if not skills_list:
                return "- Relevant technical skills"
            
            # Define skill groups
            groups = {
                'programming': ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript'],
                'frontend': ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'Bootstrap', 'jQuery', 'SASS', 'LESS'],
                'backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'FastAPI', 'Laravel'],
                'database': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle'],
                'cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
                'tools': ['Git', 'GitHub', 'GitLab', 'Jenkins', 'Jira', 'Confluence'],
                'mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'],
                'testing': ['Jest', 'Cypress', 'Selenium', 'JUnit', 'Pytest', 'Mocha']
            }
            
            grouped = []
            remaining_skills = skills_list.copy()
            
            # Group skills by category
            for category, category_skills in groups.items():
                found_skills = []
                for skill in remaining_skills[:]:
                    if any(cat_skill.lower() in skill.lower() for cat_skill in category_skills):
                        found_skills.append(skill)
                        remaining_skills.remove(skill)
                
                if found_skills:
                    if len(found_skills) == 1:
                        grouped.append(f"- {found_skills[0]}")
                    else:
                        grouped.append(f"- {'/'.join(found_skills)}")
            
            # Add remaining skills individually
            for skill in remaining_skills:
                grouped.append(f"- {skill}")
            
            return "\n".join(grouped)
        
        skills_list = group_skills(skills)
        
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
        """Parse AI response into structured sections with cleaner formatting"""
        sections = {
            "summary": "",
            "responsibilities": [],
            "required_skills": [],
            "qualifications": [],
            "benefits": []
        }
        
        try:
            # Clean up the text - remove extra formatting
            text = raw_text.strip()
            text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Remove **bold** formatting
            text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)  # Remove excessive line breaks
            
            # Extract summary - look for Job Summary section
            summary_patterns = [
                r'Job Summary:\s*(.*?)(?=\n[A-Z][a-z\s]+:|\n\n[A-Z]|\Z)',
                r'JOB SUMMARY:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'SUMMARY:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in summary_patterns:
                summary_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if summary_match:
                    summary_text = summary_match.group(1).strip()
                    # Clean up summary - remove bullet points and extra formatting
                    summary_text = re.sub(r'^[-•*]\s*', '', summary_text, flags=re.MULTILINE)
                    sections["summary"] = summary_text
                    break
            
            # Extract responsibilities - look for Key Responsibilities section
            resp_patterns = [
                r'Key Responsibilities:\s*(.*?)(?=\n[A-Z][a-z\s]+:|\n\n[A-Z]|\Z)',
                r'RESPONSIBILITIES:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'KEY RESPONSIBILITIES:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in resp_patterns:
                resp_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if resp_match:
                    responsibilities_text = resp_match.group(1).strip()
                    # Clean up responsibilities - extract bullet points
                    responsibilities = []
                    for line in responsibilities_text.split('\n'):
                        line = line.strip()
                        if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                            clean_line = re.sub(r'^[-•*]\s*', '', line).strip()
                            if clean_line and not clean_line.startswith(('Required', 'Qualifications', 'Benefits')):
                                responsibilities.append(clean_line)
                    sections["responsibilities"] = responsibilities
                    break
            
            # Extract required skills - look for Required Skills section
            skills_patterns = [
                r'Required Skills:\s*(.*?)(?=\n[A-Z][a-z\s]+:|\n\n[A-Z]|\Z)',
                r'REQUIRED SKILLS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'KEY SKILLS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in skills_patterns:
                skills_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if skills_match:
                    skills_text = skills_match.group(1).strip()
                    # Clean up skills - extract bullet points
                    skills = []
                    for line in skills_text.split('\n'):
                        line = line.strip()
                        if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                            clean_line = re.sub(r'^[-•*]\s*', '', line).strip()
                            if clean_line and not clean_line.startswith(('Qualifications', 'Benefits', 'Responsibilities')):
                                skills.append(clean_line)
                    sections["required_skills"] = skills
                    break
            
            # Extract qualifications - look for Qualifications section
            qual_patterns = [
                r'Qualifications:\s*(.*?)(?=\n[A-Z][a-z\s]+:|\n\n[A-Z]|\Z)',
                r'QUALIFICATIONS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'REQUIREMENTS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in qual_patterns:
                qual_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if qual_match:
                    qual_text = qual_match.group(1).strip()
                    # Clean up qualifications - extract bullet points
                    qualifications = []
                    for line in qual_text.split('\n'):
                        line = line.strip()
                        if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                            clean_line = re.sub(r'^[-•*]\s*', '', line).strip()
                            if clean_line and not clean_line.startswith(('Benefits', 'Responsibilities', 'Skills')):
                                qualifications.append(clean_line)
                    sections["qualifications"] = qualifications
                    break
            
            # Extract benefits - look for Benefits section
            benefits_patterns = [
                r'Benefits:\s*(.*?)(?=\n[A-Z][a-z\s]+:|\n\n[A-Z]|\Z)',
                r'BENEFITS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)',
                r'BENEFITS & PERKS:\s*(.*?)(?=\n[A-Z][A-Z\s]+:|\n\n[A-Z]|\Z)'
            ]
            
            for pattern in benefits_patterns:
                benefits_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if benefits_match:
                    benefits_text = benefits_match.group(1).strip()
                    # Clean up benefits - extract bullet points
                    benefits = []
                    for line in benefits_text.split('\n'):
                        line = line.strip()
                        if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                            clean_line = re.sub(r'^[-•*]\s*', '', line).strip()
                            if clean_line:
                                benefits.append(clean_line)
                    sections["benefits"] = benefits
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
