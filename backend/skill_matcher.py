from typing import Dict, List, Set, Optional
import re
from collections import Counter
import difflib
import os

class SkillMatcher:
    """
    Advanced skill matching and keyword analysis with Gemini AI integration
    """
    
    def __init__(self, use_ai: bool = False):
        self.similarity_threshold = 0.8  # For fuzzy matching
        self.use_ai = use_ai
        self.gemini_matcher = None
        
        # Initialize Gemini if requested and available
        if use_ai:
            try:
                from gemini_skill_matcher import GeminiSkillMatcher
                self.gemini_matcher = GeminiSkillMatcher()
                print("✓ Gemini AI skill matching enabled")
            except Exception as e:
                print(f"⚠️ Gemini AI not available, using standard matching: {e}")
                self.use_ai = False
    
    def calculate_keyword_density(self, text: str, keywords: List[str]) -> Dict:
        """
        Calculate keyword density and frequency for given keywords
        """
        text_lower = text.lower()
        word_count = len(text.split())
        
        keyword_stats = {}
        total_keyword_occurrences = 0
        
        for keyword in keywords:
            keyword_lower = keyword.lower()
            
            # Count exact matches
            exact_pattern = r'\b' + re.escape(keyword_lower) + r'\b'
            occurrences = len(re.findall(exact_pattern, text_lower))
            
            if occurrences > 0:
                density = (occurrences / word_count) * 100 if word_count > 0 else 0
                
                keyword_stats[keyword] = {
                    'occurrences': occurrences,
                    'density': round(density, 2),
                    'found': True
                }
                total_keyword_occurrences += occurrences
            else:
                keyword_stats[keyword] = {
                    'occurrences': 0,
                    'density': 0.0,
                    'found': False
                }
        
        # Calculate overall keyword density
        overall_density = (total_keyword_occurrences / word_count) * 100 if word_count > 0 else 0
        
        # Find most frequent keywords
        found_keywords = {k: v['occurrences'] for k, v in keyword_stats.items() if v['found']}
        top_keywords = sorted(found_keywords.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'keyword_stats': keyword_stats,
            'overall_density': round(overall_density, 2),
            'total_keyword_count': total_keyword_occurrences,
            'keywords_found': len(found_keywords),
            'keywords_missing': len(keywords) - len(found_keywords),
            'top_keywords': top_keywords,
            'coverage_percentage': round((len(found_keywords) / len(keywords)) * 100, 2) if keywords else 0
        }
    
    def match_skills(self, resume_skills: List[str], required_skills: List[str], 
                     optional_skills: List[str] = None) -> Dict:
        """
        Match resume skills against job requirements
        Uses Gemini AI if available for intelligent matching
        """
        if optional_skills is None:
            optional_skills = []
        
        # Try Gemini AI matching first if enabled
        if self.use_ai and self.gemini_matcher:
            try:
                ai_result = self.gemini_matcher.match_skills(
                    resume_skills, required_skills, optional_skills
                )
                if ai_result.get('success'):
                    # Convert AI results to standard format
                    return self._format_ai_results(ai_result, resume_skills, 
                                                   required_skills, optional_skills)
            except Exception as e:
                print(f"⚠️ AI matching failed, falling back to standard: {e}")
        
        # Standard matching (fallback or default)
        return self._standard_match(resume_skills, required_skills, optional_skills)
    
    def _format_ai_results(self, ai_result: Dict, resume_skills: List[str],
                          required_skills: List[str], optional_skills: List[str]) -> Dict:
        """Format Gemini AI results to standard output format"""
        matched_required = set([s.lower() for s in ai_result.get('matched_required', [])])
        matched_optional = set([s.lower() for s in ai_result.get('matched_optional', [])])
        missing_required = set([s.lower() for s in ai_result.get('missing_required', [])])
        
        required_match_score = (len(matched_required) / len(required_skills)) * 100 if required_skills else 100
        optional_match_score = (len(matched_optional) / len(optional_skills)) * 100 if optional_skills else 0
        overall_score = (required_match_score * 0.7) + (optional_match_score * 0.3)
        
        return {
            'matched_required': matched_required,
            'matched_optional': matched_optional,
            'missing_required': missing_required,
            'fuzzy_matches': {},  # AI handles fuzzy matching internally
            'required_match_score': round(required_match_score, 2),
            'optional_match_score': round(optional_match_score, 2),
            'overall_match_score': round(overall_score, 2),
            'skill_gap_analysis': {
                'total_required': len(required_skills),
                'matched': len(matched_required),
                'missing': len(missing_required),
                'match_percentage': round(required_match_score, 2)
            },
            'ai_powered': True,
            'ai_insights': ai_result.get('ai_insights', ''),
            'equivalencies': ai_result.get('equivalencies', {}),
            'match_explanations': ai_result.get('match_explanations', {})
        }
    
    def _standard_match(self, resume_skills: List[str], required_skills: List[str],
                       optional_skills: List[str]) -> Dict:
        """Standard skill matching with enhanced variation handling"""
        # Convert to sets for easier comparison
        resume_skills_lower = set()
        for skill in resume_skills:
            resume_skills_lower.add(skill.lower().strip())
        
        # Match with variations
        matched_required = set()
        missing_required = set()
        
        for req_skill in required_skills:
            req_lower = req_skill.lower().strip()
            variations = self._get_skill_variations(req_lower)
            
            # Check if any variation matches
            found = False
            for resume_skill in resume_skills_lower:
                if resume_skill in variations or req_lower in self._get_skill_variations(resume_skill):
                    matched_required.add(req_lower)
                    found = True
                    break
            
            if not found:
                missing_required.add(req_lower)
        
        # Match optional skills
        matched_optional = set()
        for opt_skill in optional_skills:
            opt_lower = opt_skill.lower().strip()
            variations = self._get_skill_variations(opt_lower)
            
            for resume_skill in resume_skills_lower:
                if resume_skill in variations or opt_lower in self._get_skill_variations(resume_skill):
                    matched_optional.add(opt_lower)
                    break
        
        # Fuzzy matching for missing required skills
        fuzzy_matches = {}
        for missing_skill in list(missing_required)[:]:  # Copy to avoid modification during iteration
            best_match = None
            best_similarity = 0
            
            for resume_skill in resume_skills_lower:
                similarity = difflib.SequenceMatcher(None, missing_skill, resume_skill).ratio()
                if similarity >= self.similarity_threshold and similarity > best_similarity:
                    best_match = resume_skill
                    best_similarity = similarity
            
            if best_match:
                fuzzy_matches[missing_skill] = {
                    'matched_with': best_match,
                    'similarity': round(best_similarity * 100, 2)
                }
                missing_required.remove(missing_skill)
                matched_required.add(missing_skill)
        
        # Calculate match scores
        required_match_score = (len(matched_required) / len(required_skills)) * 100 if required_skills else 100
        optional_match_score = (len(matched_optional) / len(optional_skills)) * 100 if optional_skills else 0
        
        # Overall skill match score (70% required, 30% optional)
        overall_score = (required_match_score * 0.7) + (optional_match_score * 0.3)
        
        return {
            'matched_required': matched_required,
            'matched_optional': matched_optional,
            'missing_required': missing_required,
            'fuzzy_matches': fuzzy_matches,
            'required_match_score': round(required_match_score, 2),
            'optional_match_score': round(optional_match_score, 2),
            'overall_match_score': round(overall_score, 2),
            'skill_gap_analysis': {
                'total_required': len(required_skills),
                'matched': len(matched_required),
                'missing': len(missing_required),
                'match_percentage': round(required_match_score, 2)
            },
            'ai_powered': False
        }
    
    def _get_skill_variations(self, skill: str) -> Set[str]:
        """Generate all possible variations of a skill name"""
        variations = {skill}
        
        # Handle dots: node.js <-> nodejs
        if '.' in skill:
            variations.add(skill.replace('.', ''))  # node.js -> nodejs
            variations.add(skill.replace('.', ' '))  # node.js -> node js
            base = skill.split('.')[0]
            variations.add(base)  # node.js -> node
        else:
            # Reverse: nodejs -> node.js
            if skill.endswith('js') and len(skill) > 2:
                base = skill[:-2]
                variations.add(f"{base}.js")  # nodejs -> node.js
                variations.add(f"{base} js")  # nodejs -> node js
                variations.add(base)  # nodejs -> node
        
        # Handle spaces: express js <-> expressjs
        if ' ' in skill:
            variations.add(skill.replace(' ', ''))  # express js -> expressjs
            variations.add(skill.replace(' ', '.'))  # express js -> express.js
        
        # Handle common programming language variations
        skill_mappings = {
            'c': {'c', 'c programming', 'c language'},
            'c++': {'c++', 'cpp', 'c plus plus'},
            'c#': {'c#', 'csharp', 'c sharp'},
            'javascript': {'javascript', 'js', 'ecmascript'},
            'typescript': {'typescript', 'ts'},
            'python': {'python', 'python3', 'py'}
        }
        
        for key, values in skill_mappings.items():
            if skill in values:
                variations.update(values)
        
        return variations
        
        return {
            'matched_required_skills': list(matched_required),
            'matched_optional_skills': list(matched_optional),
            'missing_required_skills': list(missing_required - set(fuzzy_matches.keys())),
            'fuzzy_matched_skills': fuzzy_matches,
            'required_match_score': round(required_match_score, 2),
            'optional_match_score': round(optional_match_score, 2),
            'overall_skill_score': round(overall_score, 2),
            'total_matched': len(matched_required) + len(matched_optional),
            'total_required': len(required_skills_lower),
            'total_optional': len(optional_skills_lower)
        }
    
    def match_against_job_description(self, resume_data: Dict, job_description: str, 
                                     required_skills: List[str], 
                                     optional_skills: List[str] = None,
                                     custom_keywords: List[str] = None) -> Dict:
        """
        Complete matching of resume against job description
        """
        if optional_skills is None:
            optional_skills = []
        
        # Extract keywords from job description if not provided
        if custom_keywords is None:
            # Extract important words from job description (simple approach)
            words = re.findall(r'\b[a-zA-Z]{4,}\b', job_description.lower())
            word_freq = Counter(words)
            # Get top 20 most common words (excluding common stop words)
            stop_words = {'with', 'have', 'from', 'that', 'this', 'will', 'your', 'about', 
                         'their', 'been', 'would', 'there', 'could', 'which', 'were', 'when'}
            custom_keywords = [word for word, count in word_freq.most_common(30) 
                              if word not in stop_words][:20]
        
        # Get resume text
        resume_text = resume_data.get('raw_text', '')
        resume_skills = resume_data.get('skills', {}).get('skills', [])
        
        # Skill matching
        skill_match = self.match_skills(resume_skills, required_skills, optional_skills)
        
        # Keyword density analysis
        all_keywords = list(set(required_skills + optional_skills + custom_keywords))
        keyword_analysis = self.calculate_keyword_density(resume_text, all_keywords)
        
        # Calculate relevance score (use correct key name)
        overall_match = skill_match.get('overall_match_score', skill_match.get('overall_skill_score', 0))
        
        relevance_factors = {
            'skill_match': overall_match * 0.4,  # 40%
            'keyword_coverage': keyword_analysis['coverage_percentage'] * 0.3,  # 30%
            'keyword_density': min(keyword_analysis['overall_density'] * 10, 30),  # 30% (capped)
        }
        
        relevance_score = sum(relevance_factors.values())
        
        return {
            'skill_match': skill_match,
            'keyword_analysis': keyword_analysis,
            'relevance_score': round(relevance_score, 2),
            'relevance_factors': {k: round(v, 2) for k, v in relevance_factors.items()},
            'recommendation': self._get_recommendation(relevance_score)
        }
    
    def _get_recommendation(self, score: float) -> str:
        """Get hiring recommendation based on score"""
        if score >= 80:
            return "Highly Recommended - Excellent match"
        elif score >= 65:
            return "Recommended - Good match"
        elif score >= 50:
            return "Consider - Moderate match"
        elif score >= 35:
            return "Review Carefully - Below average match"
        else:
            return "Not Recommended - Poor match"
    
    def compare_resumes(self, resumes_data: List[Dict], job_description: str,
                       required_skills: List[str], optional_skills: List[str] = None) -> List[Dict]:
        """
        Compare multiple resumes and rank them
        """
        results = []
        
        for idx, resume_data in enumerate(resumes_data):
            match_result = self.match_against_job_description(
                resume_data, job_description, required_skills, optional_skills
            )
            
            results.append({
                'resume_index': idx,
                'candidate_name': resume_data.get('basic_info', {}).get('name', f'Candidate {idx+1}'),
                'relevance_score': match_result['relevance_score'],
                'skill_match_score': match_result['skill_match']['overall_skill_score'],
                'keyword_coverage': match_result['keyword_analysis']['coverage_percentage'],
                'recommendation': match_result['recommendation'],
                'full_analysis': match_result
            })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        # Add ranking
        for rank, result in enumerate(results, 1):
            result['rank'] = rank
        
        return results
