"""
Gemini LLM-Powered Resume Analyzer
Integrates Google's Gemini AI for intelligent resume evaluation and insights
"""

import os
import json
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

class GeminiResumeAnalyzer:
    """
    Advanced resume analyzer using Google's Gemini LLM for:
    - Intelligent resume evaluation
    - Skill gap analysis
    - Experience quality assessment
    - Personalized recommendations
    - Interview question generation
    - Candidate comparison insights
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini analyzer
        
        Args:
            api_key: Gemini API key (optional, defaults to environment variable)
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key not found. Set GEMINI_API_KEY environment variable or pass api_key parameter.")
        
        # Initialize client with new API format
        self.client = genai.Client()
        
        # Model configuration
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
        self.temperature = float(os.getenv('GEMINI_TEMPERATURE', '0.7'))
        self.max_tokens = int(os.getenv('GEMINI_MAX_TOKENS', '2048'))
        
        print(f"✓ Gemini AI initialized: {self.model_name}")
    
    def analyze_resume(self, resume_data: Dict, job_config: Dict) -> Dict[str, Any]:
        """
        Alias for analyze_resume_quality for compatibility
        
        Args:
            resume_data: Parsed resume data
            job_config: Job requirements and configuration
            
        Returns:
            Dictionary with AI insights
        """
        return self.analyze_resume_quality(resume_data, job_config)
    
    def analyze_resume_quality(self, resume_data: Dict, job_config: Dict) -> Dict[str, Any]:
        """
        AI-powered resume analysis using Gemini to compare resume against job description
        
        Args:
            resume_data: Parsed resume data
            job_config: Job requirements and configuration
            
        Returns:
            Dictionary with AI insights and scores
        """
        try:
            # Build comprehensive prompt for Gemini analysis
            prompt = self._build_comprehensive_analysis_prompt(resume_data, job_config)
            
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                
                # Check if response is valid
                if not response:
                    raise Exception("No response from Gemini API")
                
                # Check for safety blocks or content policy violations
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    if hasattr(response.prompt_feedback, 'block_reason'):
                        raise Exception(f"Content blocked: {response.prompt_feedback.block_reason}")
                
                # Check for finish reason issues
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'finish_reason'):
                        if candidate.finish_reason == 2:  # SAFETY
                            raise Exception("Response blocked due to safety concerns")
                        elif candidate.finish_reason == 3:  # RECITATION
                            raise Exception("Response blocked due to recitation concerns")
                        elif candidate.finish_reason == 4:  # OTHER
                            raise Exception("Response blocked for other reasons")
                
                # Check if response has text
                if not hasattr(response, 'text') or not response.text:
                    raise Exception("No text content in response")
                
                # Parse the structured response from Gemini
                analysis = self._parse_comprehensive_response(response.text)
                
                return {
                    'success': True,
                    'analysis': analysis,
                    'error': None
                }
            except Exception as api_error:
                print(f"Gemini API call failed: {api_error}")
                # Try with a simpler prompt as fallback
                try:
                    simple_prompt = self._build_simple_analysis_prompt(resume_data, job_config)
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=simple_prompt
                    )
                    
                    if response and hasattr(response, 'text') and response.text:
                        analysis = self._parse_comprehensive_response(response.text)
                        return {
                            'success': True,
                            'analysis': analysis,
                            'error': None
                        }
                except Exception as fallback_error:
                    print(f"Fallback prompt also failed: {fallback_error}")
                
                return {
                    'success': False,
                    'error': f"API error: {str(api_error)}",
                    'analysis': {
                        'overall_assessment': 'AI analysis temporarily unavailable',
                        'strengths': [],
                        'weaknesses': [],
                        'recommendation': 'Manual review recommended',
                        'component_scores': {
                            'education': 50,
                            'experience': 50,
                            'domain': 50,
                            'language': 50,
                            'skill_match': 50
                        },
                        'skill_analysis': {
                            'matched_required': [],
                            'missing_required': [],
                            'matched_optional': [],
                            'all_candidate_skills': []
                        },
                        'overall_score': 50
                    }
            }
        except Exception as e:
            print(f"Error during AI analysis: {e}")
            return {
                'success': False,
                'error': str(e),
                'analysis': {
                    'overall_assessment': 'Error analyzing resume',
                    'strengths': [],
                    'weaknesses': [],
                    'recommendation': 'Manual review required',
                    'component_scores': {
                        'education': 0,
                        'experience': 0,
                        'domain': 0,
                        'language': 0,
                        'skill_match': 0
                    },
                    'skill_analysis': {
                        'matched_required': [],
                        'missing_required': [],
                        'matched_optional': [],
                        'all_candidate_skills': []
                    },
                    'overall_score': 0
                }
            }
    
    def _build_comprehensive_analysis_prompt(self, resume_data: Dict, job_config: Dict) -> str:
        """Build comprehensive analysis prompt for Gemini to score resume against job description"""
        
        # Extract candidate information
        candidate_name = resume_data.get('name', 'Candidate')
        candidate_email = resume_data.get('email', '')
        candidate_phone = resume_data.get('phone', '')
        
        # Extract education
        education_info = resume_data.get('education', {})
        if isinstance(education_info, dict):
            degree = education_info.get('degree', '')
            institution = education_info.get('institution', '')
            year = education_info.get('year', '')
        else:
            degree = str(education_info)
            institution = ''
            year = ''
        
        # Extract experience
        experience_info = resume_data.get('experience', {})
        if isinstance(experience_info, dict):
            total_years = experience_info.get('total_years', 0)
            experiences = experience_info.get('experiences', [])
        else:
            total_years = 0
            experiences = []
        
        # Extract skills
        skills_info = resume_data.get('skills', {})
        if isinstance(skills_info, dict):
            candidate_skills = skills_info.get('skills', [])
        elif isinstance(skills_info, list):
            candidate_skills = skills_info
        else:
            candidate_skills = []
        
        # Extract job information
        job_title = job_config.get('job_title', 'Position')
        job_description = job_config.get('job_description', '')
        required_skills = job_config.get('required_skills', [])
        optional_skills = job_config.get('optional_skills', [])
        required_experience = job_config.get('required_experience_years', 0)
        required_education = job_config.get('required_education_level', 'Bachelor')
        
        prompt = f"""
Analyze this candidate for the {job_title} position.

CANDIDATE:
- Education: {degree} from {institution}
- Experience: {total_years} years
- Skills: {', '.join(candidate_skills[:10]) if candidate_skills else 'None listed'}

JOB REQUIREMENTS:
- Required Skills: {', '.join(required_skills[:5]) if required_skills else 'None'}
- Required Experience: {required_experience} years
- Required Education: {required_education}

Provide scores (0-100) and analysis in this JSON format:
{{
    "component_scores": {{
        "education": 85,
        "experience": 70,
        "domain": 90,
        "language": 80,
        "skill_match": 75
    }},
    "skill_analysis": {{
        "matched_required": ["Python", "JavaScript"],
        "missing_required": ["React", "Node.js"],
        "matched_optional": ["AWS"],
        "all_candidate_skills": ["Python", "JavaScript", "SQL", "Git"]
    }},
    "overall_score": 80,
    "overall_assessment": "Strong technical background",
    "strengths": ["Good programming skills", "Relevant experience"],
    "weaknesses": ["Missing some frameworks"],
    "recommendation": "Recommended"
}}
"""
        return prompt

    def _build_simple_analysis_prompt(self, resume_data: Dict, job_config: Dict) -> str:
        """Build a simpler prompt to avoid safety blocks"""
        job_title = job_config.get('job_title', 'Position')
        required_skills = job_config.get('required_skills', [])
        
        # Extract basic info
        candidate_skills = []
        if isinstance(resume_data.get('skills'), dict):
            candidate_skills = resume_data['skills'].get('skills', [])
        elif isinstance(resume_data.get('skills'), list):
            candidate_skills = resume_data['skills']
        
        education_info = resume_data.get('education', {})
        if isinstance(education_info, dict):
            degree = education_info.get('degree', '')
        else:
            degree = str(education_info)
        
        experience_info = resume_data.get('experience', {})
        if isinstance(experience_info, dict):
            total_years = experience_info.get('total_years', 0)
        else:
            total_years = 0
        
        prompt = f"""
Rate this candidate for {job_title}:

Skills: {', '.join(candidate_skills[:5]) if candidate_skills else 'None'}
Education: {degree}
Experience: {total_years} years
Required: {', '.join(required_skills[:3]) if required_skills else 'None'}

Return JSON:
{{"education": 80, "experience": 70, "domain": 85, "language": 75, "skill_match": 60, "overall_score": 74, "recommendation": "Recommended"}}
"""
        return prompt
    
    def _build_analysis_prompt(self, resume_data: Dict, job_config: Dict) -> str:
        """Build comprehensive analysis prompt for Gemini"""
        
        # Extract key information
        candidate_name = resume_data.get('name', 'Unknown')
        skills = resume_data.get('skills', [])
        education = resume_data.get('education', [])
        experience = resume_data.get('experience', [])
        domain = resume_data.get('domain', 'Not specified')
        language_score = resume_data.get('language_quality', {}).get('score', 0)
        
        # Job requirements
        job_title = job_config.get('job_title', 'Unknown Position')
        required_skills = job_config.get('required_skills', [])
        optional_skills = job_config.get('optional_skills', [])
        min_education = job_config.get('education_level', 'Bachelor')
        min_experience = job_config.get('experience_years', 0)
        target_domain = job_config.get('domain', 'Any')
        
        prompt = f"""You are an expert HR recruiter and talent acquisition specialist. Analyze this resume against the job requirements and provide detailed insights.

**JOB POSITION:** {job_title}

**JOB REQUIREMENTS:**
- Required Skills: {', '.join(required_skills) if required_skills else 'Not specified'}
- Optional Skills: {', '.join(optional_skills) if optional_skills else 'Not specified'}
- Minimum Education: {min_education}
- Minimum Experience: {min_experience} years
- Target Domain: {target_domain}

**CANDIDATE INFORMATION:**
- Name: {candidate_name}
- Current Domain: {domain}
- Skills: {', '.join(skills) if skills else 'Not listed'}
- Education: {', '.join([f"{edu.get('degree', 'Degree')} in {edu.get('field', 'Unknown field')}" for edu in education]) if education else 'Not listed'}
- Experience: {len(experience)} positions listed
- Language Quality Score: {language_score}/100

**EXPERIENCE DETAILS:**
{self._format_experience(experience)}

Please provide a comprehensive analysis in the following JSON format:

{{
    "overall_assessment": "Brief 2-3 sentence summary of candidate fit",
    "match_score": 85,
    "strengths": [
        "Strength 1 with specific examples",
        "Strength 2 with specific examples",
        "Strength 3 with specific examples"
    ],
    "weaknesses": [
        "Weakness 1 with specific examples",
        "Weakness 2 with specific examples"
    ],
    "skill_gaps": [
        "Missing skill 1 and why it matters",
        "Missing skill 2 and why it matters"
    ],
    "experience_quality": "Assessment of experience relevance and quality",
    "education_assessment": "Assessment of educational background",
    "standout_features": [
        "Unique feature 1",
        "Unique feature 2"
    ],
    "red_flags": [
        "Concern 1 if any",
        "Concern 2 if any"
    ],
    "interview_focus_areas": [
        "Area 1 to probe",
        "Area 2 to probe",
        "Area 3 to probe"
    ],
    "recommended_interview_questions": [
        "Question 1",
        "Question 2",
        "Question 3"
    ],
    "hiring_recommendation": "STRONG_YES / YES / MAYBE / NO / STRONG_NO",
    "recommendation_rationale": "Detailed explanation for the recommendation",
    "development_suggestions": [
        "Skill/area to develop 1",
        "Skill/area to develop 2"
    ]
}}

Analyze deeply, be specific, and provide actionable insights. Focus on fit for the {job_title} role."""

        return prompt
    
    def _format_experience(self, experience: List[Dict]) -> str:
        """Format experience list for prompt"""
        if not experience:
            return "No experience listed"
        
        formatted = []
        for i, exp in enumerate(experience[:5], 1):  # Limit to 5 most recent
            job_title = exp.get('job_title', 'Position')
            company = exp.get('company', 'Unknown Company')
            duration = exp.get('duration', 'Unknown duration')
            description = exp.get('description', 'No description')
            
            formatted.append(f"{i}. {job_title} at {company} ({duration})\n   {description}")
        
        return '\n'.join(formatted)
    
    def _parse_analysis_response(self, response_text: str) -> Dict[str, Any]:
        """Parse JSON response from Gemini"""
        try:
            # Try to extract JSON from response
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            
            if start != -1 and end > start:
                json_str = response_text[start:end]
                return json.loads(json_str)
            else:
                # Fallback: parse as text
                return {
                    'overall_assessment': response_text[:300],
                    'strengths': [],
                    'weaknesses': [],
                    'recommendation': 'Manual review recommended',
                    'raw_text': response_text
                }
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                'overall_assessment': response_text[:300],
                'strengths': [],
                'weaknesses': [],
                'recommendation': 'Manual review recommended',
                'parse_error': True,
                'raw_text': response_text
            }
    
    def _parse_comprehensive_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini's comprehensive analysis response"""
        try:
            import json
            import re
            
            # Try to extract JSON from the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                parsed_data = json.loads(json_str)
                
                # Handle both comprehensive and simple response formats
                if 'component_scores' in parsed_data:
                    # Comprehensive format
                    return {
                        'overall_assessment': parsed_data.get('overall_assessment', 'Analysis completed'),
                        'strengths': parsed_data.get('strengths', []),
                        'weaknesses': parsed_data.get('weaknesses', []),
                        'recommendation': parsed_data.get('recommendation', 'Manual review recommended'),
                        'component_scores': parsed_data.get('component_scores', {
                            'education': 50,
                            'experience': 50,
                            'domain': 50,
                            'language': 50,
                            'skill_match': 50
                        }),
                        'skill_analysis': parsed_data.get('skill_analysis', {
                            'matched_required': [],
                            'missing_required': [],
                            'matched_optional': [],
                            'all_candidate_skills': []
                        }),
                        'overall_score': parsed_data.get('overall_score', 50)
                    }
                else:
                    # Simple format - convert to comprehensive format
                    return {
                        'overall_assessment': f"Candidate analysis completed with {parsed_data.get('overall_score', 50)}% overall score",
                        'strengths': [],
                        'weaknesses': [],
                        'recommendation': parsed_data.get('recommendation', 'Manual review recommended'),
                        'component_scores': {
                            'education': parsed_data.get('education', 50),
                            'experience': parsed_data.get('experience', 50),
                            'domain': parsed_data.get('domain', 50),
                            'language': parsed_data.get('language', 50),
                            'skill_match': parsed_data.get('skill_match', 50)
                        },
                        'skill_analysis': {
                            'matched_required': [],
                            'missing_required': [],
                            'matched_optional': [],
                            'all_candidate_skills': []
                        },
                        'overall_score': parsed_data.get('overall_score', 50)
                    }
            else:
                # Fallback parsing if JSON not found
                return self._fallback_parse_response(response_text)
                
        except Exception as e:
            print(f"Error parsing comprehensive response: {e}")
            return self._fallback_parse_response(response_text)
    
    def _fallback_parse_response(self, response_text: str) -> Dict[str, Any]:
        """Fallback parsing when JSON parsing fails"""
        try:
            # Extract scores using regex
            education_score = self._extract_score(response_text, 'education', 50)
            experience_score = self._extract_score(response_text, 'experience', 50)
            domain_score = self._extract_score(response_text, 'domain', 50)
            language_score = self._extract_score(response_text, 'language', 50)
            skill_score = self._extract_score(response_text, 'skill', 50)
            overall_score = self._extract_score(response_text, 'overall', 50)
            
            return {
                'overall_assessment': 'AI analysis completed with fallback parsing',
                'strengths': [],
                'weaknesses': [],
                'recommendation': 'Manual review recommended',
                'component_scores': {
                    'education': education_score,
                    'experience': experience_score,
                    'domain': domain_score,
                    'language': language_score,
                    'skill_match': skill_score
                },
                'skill_analysis': {
                    'matched_required': [],
                    'missing_required': [],
                    'matched_optional': [],
                    'all_candidate_skills': []
                },
                'overall_score': overall_score
            }
        except Exception as e:
            print(f"Fallback parsing failed: {e}")
            return {
                'overall_assessment': 'Error parsing AI response',
                'strengths': [],
                'weaknesses': [],
                'recommendation': 'Manual review required',
                'component_scores': {
                    'education': 0,
                    'experience': 0,
                    'domain': 0,
                    'language': 0,
                    'skill_match': 0
                },
                'skill_analysis': {
                    'matched_required': [],
                    'missing_required': [],
                    'matched_optional': [],
                    'all_candidate_skills': []
                },
                'overall_score': 0
            }
    
    def _extract_score(self, text: str, keyword: str, default: int) -> int:
        """Extract score for a specific component"""
        import re
        patterns = [
            rf'{keyword}[^0-9]*(\d+)',
            rf'{keyword}[^0-9]*(\d+\.\d+)',
            rf'(\d+)[^0-9]*{keyword}',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                try:
                    score = float(match.group(1))
                    return min(100, max(0, int(score)))
                except:
                    continue
        
        return default
    
    def compare_candidates(self, candidates: List[Dict], job_config: Dict, top_n: int = 3) -> Dict[str, Any]:
        """
        LLM-powered comparative analysis of multiple candidates
        
        Args:
            candidates: List of candidate data with scores
            job_config: Job requirements
            top_n: Number of top candidates to analyze in detail
            
        Returns:
            Comparative analysis and ranking insights
        """
        if not candidates:
            return {'success': False, 'error': 'No candidates provided'}
        
        # Limit to top N for detailed comparison
        top_candidates = sorted(candidates, key=lambda x: x.get('overall_score', 0), reverse=True)[:top_n]
        
        prompt = self._build_comparison_prompt(top_candidates, job_config)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            return {
                'success': True,
                'comparison': response.text,
                'candidates_analyzed': len(top_candidates)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _build_comparison_prompt(self, candidates: List[Dict], job_config: Dict) -> str:
        """Build prompt for candidate comparison"""
        
        job_title = job_config.get('job_title', 'Unknown Position')
        
        candidates_info = []
        for i, candidate in enumerate(candidates, 1):
            name = candidate.get('name', f'Candidate {i}')
            score = candidate.get('overall_score', 0)
            skills = candidate.get('skills', [])
            experience = candidate.get('experience', [])
            
            candidates_info.append(f"""
**Candidate {i}: {name}**
- Overall Score: {score}/100
- Skills: {', '.join(skills[:10]) if skills else 'Not listed'}
- Experience: {len(experience)} positions
""")
        
        prompt = f"""You are an expert HR recruiter comparing candidates for the position: **{job_title}**

Here are the top candidates:

{''.join(candidates_info)}

Please provide a comparative analysis:

1. **Ranking & Rationale**: Rank these candidates from best to worst fit and explain why
2. **Unique Strengths**: What makes each candidate stand out?
3. **Key Differentiators**: What are the critical differences between candidates?
4. **Best Fit**: Who is the strongest overall candidate and why?
5. **Alternative Choice**: Who would be the best backup candidate?
6. **Team Composition**: How might these candidates complement each other if hiring multiple?
7. **Risk Assessment**: Any concerns with the top candidates?
8. **Final Recommendation**: Who should be interviewed first?

Be specific and actionable in your analysis."""

        return prompt
    
    def generate_interview_questions(self, resume_data: Dict, job_config: Dict, focus_areas: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Generate personalized interview questions based on resume and job requirements
        
        Args:
            resume_data: Parsed resume data
            job_config: Job requirements
            focus_areas: Optional specific areas to focus on
            
        Returns:
            Dictionary with categorized interview questions
        """
        prompt = self._build_interview_questions_prompt(resume_data, job_config, focus_areas)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            questions = self._parse_interview_questions(response.text)
            
            return {
                'success': True,
                'questions': questions,
                'raw_response': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'questions': {}
            }
    
    def _build_interview_questions_prompt(self, resume_data: Dict, job_config: Dict, focus_areas: Optional[List[str]]) -> str:
        """Build prompt for interview question generation"""
        
        candidate_name = resume_data.get('name', 'the candidate')
        skills = resume_data.get('skills', [])
        experience = resume_data.get('experience', [])
        job_title = job_config.get('job_title', 'Unknown Position')
        
        focus_text = ""
        if focus_areas:
            focus_text = f"\n**FOCUS AREAS:** {', '.join(focus_areas)}"
        
        prompt = f"""Generate personalized interview questions for {candidate_name} applying for {job_title}.

**CANDIDATE BACKGROUND:**
- Skills: {', '.join(skills[:15]) if skills else 'Not listed'}
- Experience: {len(experience)} positions
{focus_text}

Generate 15-20 interview questions in the following categories:

1. **Technical Skills** (5-7 questions)
   - Questions to verify claimed technical skills
   - Hands-on problem-solving questions
   - Depth of knowledge questions

2. **Experience & Projects** (3-5 questions)
   - Questions about specific past projects
   - Challenge and resolution questions
   - Role and contribution questions

3. **Behavioral & Soft Skills** (3-5 questions)
   - Teamwork and collaboration
   - Problem-solving approach
   - Communication and leadership

4. **Job-Specific** (2-4 questions)
   - Questions specific to the {job_title} role
   - Situational questions for this position

5. **Gap Analysis** (2-3 questions)
   - Questions about missing skills or experience
   - Learning and adaptation questions

Format as a clear, numbered list under each category. Make questions specific to the candidate's background."""

        return prompt
    
    def _parse_interview_questions(self, response_text: str) -> Dict[str, List[str]]:
        """Parse interview questions from response"""
        categories = {
            'technical': [],
            'experience': [],
            'behavioral': [],
            'job_specific': [],
            'gap_analysis': []
        }
        
        current_category = None
        
        for line in response_text.split('\n'):
            line = line.strip()
            if not line:
                continue
            
            # Detect category headers
            if 'technical' in line.lower() and ('skills' in line.lower() or 'questions' in line.lower()):
                current_category = 'technical'
            elif 'experience' in line.lower() or 'projects' in line.lower():
                current_category = 'experience'
            elif 'behavioral' in line.lower() or 'soft skills' in line.lower():
                current_category = 'behavioral'
            elif 'job-specific' in line.lower() or 'job specific' in line.lower():
                current_category = 'job_specific'
            elif 'gap' in line.lower():
                current_category = 'gap_analysis'
            # Extract questions (lines starting with numbers or bullets)
            elif current_category and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
                # Clean up question
                question = line.lstrip('0123456789.-•) ').strip()
                if question and len(question) > 10:  # Minimum question length
                    categories[current_category].append(question)
        
        return categories
    
    def get_skill_development_roadmap(self, resume_data: Dict, job_config: Dict) -> Dict[str, Any]:
        """
        Generate personalized skill development roadmap for candidate
        
        Args:
            resume_data: Parsed resume data
            job_config: Job requirements
            
        Returns:
            Skill development roadmap and recommendations
        """
        candidate_skills = set(resume_data.get('skills', []))
        required_skills = set(job_config.get('required_skills', []))
        optional_skills = set(job_config.get('optional_skills', []))
        
        missing_required = required_skills - candidate_skills
        missing_optional = optional_skills - candidate_skills
        
        prompt = f"""You are a career development coach. Create a skill development roadmap for a candidate.

**CANDIDATE CURRENT SKILLS:** {', '.join(candidate_skills) if candidate_skills else 'Limited skills listed'}

**TARGET ROLE:** {job_config.get('job_title', 'Unknown')}

**MISSING REQUIRED SKILLS:** {', '.join(missing_required) if missing_required else 'None'}

**MISSING OPTIONAL SKILLS:** {', '.join(missing_optional) if missing_optional else 'None'}

Create a development roadmap with:

1. **Priority Skills** (Top 5 skills to learn first)
   - Skill name
   - Why it's important
   - Estimated learning time
   - Resources (courses, books, certifications)

2. **Learning Path** (3-6 month plan)
   - Month-by-month breakdown
   - Milestones and goals

3. **Recommended Certifications**
   - Most valuable certifications for this role
   - Preparation time and difficulty

4. **Project Ideas**
   - 3-5 hands-on projects to build these skills
   - Portfolio-worthy projects

5. **Quick Wins**
   - Skills that can be learned quickly (1-2 weeks)
   - High-impact, low-effort improvements

Be specific and actionable. Focus on practical learning."""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            return {
                'success': True,
                'roadmap': response.text,
                'missing_skills': {
                    'required': list(missing_required),
                    'optional': list(missing_optional)
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def assess_culture_fit(self, resume_data: Dict, company_culture: str, job_config: Dict) -> Dict[str, Any]:
        """
        Assess potential culture fit based on resume indicators
        
        Args:
            resume_data: Parsed resume data
            company_culture: Description of company culture
            job_config: Job requirements
            
        Returns:
            Culture fit assessment
        """
        prompt = f"""Assess the potential culture fit for this candidate.

**COMPANY CULTURE:** {company_culture}

**CANDIDATE BACKGROUND:**
- Experience: {len(resume_data.get('experience', []))} positions
- Skills: {', '.join(resume_data.get('skills', [])[:15])}
- Domain: {resume_data.get('domain', 'Unknown')}

**INDICATORS FROM RESUME:**
- Job tenure (average stay at companies)
- Types of companies worked for
- Project descriptions and work style indicators
- Skills that suggest certain work preferences

Provide:
1. **Culture Fit Score** (0-100)
2. **Fit Assessment** (Strong Fit / Good Fit / Moderate Fit / Poor Fit)
3. **Positive Indicators** (3-5 points suggesting good fit)
4. **Potential Concerns** (2-3 points that might indicate misalignment)
5. **Questions to Assess Fit** (3-5 interview questions to validate culture fit)
6. **Onboarding Recommendations** (How to help this person succeed in your culture)

Be thoughtful and nuanced in your assessment."""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            return {
                'success': True,
                'assessment': response.text
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


# Utility function for quick analysis
def quick_analyze(resume_data: Dict, job_config: Dict, api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Quick resume analysis using Gemini AI
    
    Args:
        resume_data: Parsed resume data
        job_config: Job requirements
        api_key: Optional Gemini API key
        
    Returns:
        Analysis results
    """
    try:
        analyzer = GeminiResumeAnalyzer(api_key=api_key)
        return analyzer.analyze_resume_quality(resume_data, job_config)
    except Exception as e:
        return {
            'success': False,
            'error': f"Failed to initialize Gemini analyzer: {str(e)}"
        }


if __name__ == "__main__":
    # Test the Gemini analyzer
    print("Testing Gemini Resume Analyzer...")
    
    # Sample data for testing
    sample_resume = {
        'name': 'John Doe',
        'email': 'john.doe@email.com',
        'phone': '555-1234',
        'skills': ['Python', 'JavaScript', 'SQL', 'React', 'Node.js', 'Git'],
        'education': [
            {'degree': 'Bachelor of Science', 'field': 'Computer Science', 'year': '2018'}
        ],
        'experience': [
            {
                'job_title': 'Software Engineer',
                'company': 'Tech Corp',
                'duration': '2018-Present',
                'description': 'Developed web applications using React and Node.js'
            }
        ],
        'domain': 'IT',
        'language_quality': {'score': 85}
    }
    
    sample_job = {
        'job_title': 'Senior Full Stack Developer',
        'required_skills': ['Python', 'JavaScript', 'React', 'SQL', 'Docker'],
        'optional_skills': ['AWS', 'TypeScript', 'GraphQL'],
        'education_level': 'Bachelor',
        'experience_years': 3,
        'domain': 'IT'
    }
    
    try:
        analyzer = GeminiResumeAnalyzer()
        print("✓ Analyzer initialized")
        
        # Test analysis
        print("\nAnalyzing sample resume...")
        result = analyzer.analyze_resume_quality(sample_resume, sample_job)
        
        if result['success']:
            print("✓ Analysis successful!")
            print(f"\nAnalysis: {result['analysis'].get('overall_assessment', 'N/A')}")
        else:
            print(f"✗ Analysis failed: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"✗ Error: {str(e)}")
