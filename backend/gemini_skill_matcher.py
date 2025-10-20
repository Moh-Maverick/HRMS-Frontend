"""
Gemini-Powered Intelligent Skill Matching
Uses LLM to understand skill equivalencies and variations
"""

import os
import json
from typing import Dict, List, Set
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

class GeminiSkillMatcher:
    """
    Uses Gemini 2.5 Flash to intelligently match skills between resume and job requirements
    Handles variations, synonyms, and related technologies
    """
    
    def __init__(self):
        """Initialize Gemini for skill matching"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def match_skills(self, resume_skills: List[str], required_skills: List[str], 
                     optional_skills: List[str] = None) -> Dict:
        """
        Use Gemini to intelligently match skills
        
        Args:
            resume_skills: Skills found in resume
            required_skills: Required skills from job description
            optional_skills: Optional skills from job description
            
        Returns:
            Dictionary with matched/missing skills and AI insights
        """
        optional_skills = optional_skills or []
        
        prompt = f"""You are an expert technical recruiter. Analyze the skill matching between a resume and job requirements.

RESUME SKILLS:
{', '.join(resume_skills)}

REQUIRED SKILLS:
{', '.join(required_skills)}

OPTIONAL SKILLS:
{', '.join(optional_skills) if optional_skills else 'None'}

TASK:
1. Match each required skill to resume skills (handle variations like Node.js/nodejs/node, Express.js/expressjs/express)
2. Match optional skills
3. Identify truly missing skills
4. Provide equivalencies (e.g., "C" in requirements matches "C Programming" in resume)

Respond in JSON format:
{{
    "matched_required": ["skill1", "skill2"],
    "matched_optional": ["skill3"],
    "missing_required": ["skill4"],
    "equivalencies": {{
        "nodejs": ["Node.js", "node"],
        "expressjs": ["Express.js", "Express", "express"],
        "c": ["C Programming", "C Language"]
    }},
    "match_explanations": {{
        "nodejs": "Matched 'Node.js' in resume to 'nodejs' in requirements",
        "c": "Matched 'C Programming' in resume to 'c' in requirements"
    }},
    "confidence_scores": {{
        "python": 1.0,
        "nodejs": 0.95,
        "c": 0.9
    }}
}}"""

        try:
            response = self.model.generate_content(prompt)
            result = self._parse_json_response(response.text)
            
            return {
                'success': True,
                'matched_required': result.get('matched_required', []),
                'matched_optional': result.get('matched_optional', []),
                'missing_required': result.get('missing_required', []),
                'equivalencies': result.get('equivalencies', {}),
                'match_explanations': result.get('match_explanations', {}),
                'confidence_scores': result.get('confidence_scores', {}),
                'ai_insights': self._generate_insights(result)
            }
        except Exception as e:
            print(f"⚠️ Gemini skill matching failed: {e}")
            # Fallback to basic matching
            return self._fallback_match(resume_skills, required_skills, optional_skills)
    
    def _parse_json_response(self, response_text: str) -> Dict:
        """Extract JSON from Gemini response"""
        # Remove markdown code blocks if present
        text = response_text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        
        return json.loads(text.strip())
    
    def _generate_insights(self, result: Dict) -> str:
        """Generate human-readable insights from matching results"""
        matched_count = len(result.get('matched_required', []))
        total_required = matched_count + len(result.get('missing_required', []))
        match_percentage = (matched_count / total_required * 100) if total_required > 0 else 0
        
        insights = f"Skill Match: {matched_count}/{total_required} ({match_percentage:.0f}%)\n"
        
        if result.get('match_explanations'):
            insights += "\nKey Matches:\n"
            for skill, explanation in list(result['match_explanations'].items())[:3]:
                insights += f"  • {explanation}\n"
        
        if result.get('missing_required'):
            insights += f"\nMissing Skills: {', '.join(result['missing_required'])}\n"
        
        return insights
    
    def _fallback_match(self, resume_skills: List[str], required_skills: List[str], 
                        optional_skills: List[str]) -> Dict:
        """Fallback to basic matching if Gemini fails"""
        resume_lower = {s.lower().strip() for s in resume_skills}
        
        matched_required = []
        missing_required = []
        
        for skill in required_skills:
            skill_lower = skill.lower().strip()
            # Basic variation matching
            variations = self._get_variations(skill_lower)
            
            if any(v in resume_lower for v in variations):
                matched_required.append(skill)
            else:
                missing_required.append(skill)
        
        matched_optional = []
        for skill in optional_skills:
            skill_lower = skill.lower().strip()
            variations = self._get_variations(skill_lower)
            
            if any(v in resume_lower for v in variations):
                matched_optional.append(skill)
        
        return {
            'success': False,
            'matched_required': matched_required,
            'matched_optional': matched_optional,
            'missing_required': missing_required,
            'equivalencies': {},
            'match_explanations': {},
            'confidence_scores': {},
            'ai_insights': 'Using fallback matching (Gemini unavailable)'
        }
    
    def _get_variations(self, skill: str) -> Set[str]:
        """Generate basic variations for a skill"""
        variations = {skill}
        
        # Handle dots
        if '.' in skill:
            variations.add(skill.replace('.', ''))
            variations.add(skill.replace('.', ' '))
            base = skill.split('.')[0]
            variations.add(base)
        else:
            if skill.endswith('js') and len(skill) > 2:
                base = skill[:-2]
                variations.add(f"{base}.js")
                variations.add(f"{base} js")
                variations.add(base)
        
        return variations
