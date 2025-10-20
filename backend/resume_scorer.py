from typing import Dict, List
import re

class ResumeScorer:
    """
    Comprehensive scoring system for resume evaluation
    """
    
    def __init__(self):
        # Education level weights
        self.education_weights = {
            5: 100,  # PhD/Doctorate
            4: 85,   # Master's
            3: 70,   # Bachelor's
            2: 50,   # Associate/Diploma
            1: 30,   # High School
            0: 0     # Not specified
        }
        
        # Experience level scoring
        self.experience_ranges = [
            (0, 0, 0),      # No experience
            (1, 2, 30),     # 0-2 years: Junior
            (3, 5, 60),     # 3-5 years: Mid-level
            (6, 10, 85),    # 6-10 years: Senior
            (11, float('inf'), 100)  # 10+ years: Expert
        ]
    
    def score_education(self, education_data: Dict, required_level: int = 3) -> Dict:
        """
        Score education based on level and requirements
        
        Args:
            education_data: Education information from resume
            required_level: Minimum required education level (default: 3 = Bachelor's)
        """
        candidate_level = education_data.get('education_level', 0)
        
        # Base score from education level
        base_score = self.education_weights.get(candidate_level, 0)
        
        # Bonus for exceeding requirements
        exceeds_requirement = candidate_level > required_level
        requirement_bonus = 15 if exceeds_requirement else 0
        
        # Penalty for not meeting requirements
        below_requirement = candidate_level < required_level
        requirement_penalty = -20 if below_requirement else 0
        
        # Bonus for multiple degrees/institutions
        institution_count = len(education_data.get('institutions', []))
        institution_bonus = min(institution_count * 5, 10)  # Max 10 bonus
        
        # Calculate final score
        final_score = base_score + requirement_bonus + requirement_penalty + institution_bonus
        final_score = max(0, min(100, final_score))  # Clamp between 0-100
        
        return {
            'education_score': round(final_score, 2),
            'base_score': base_score,
            'candidate_level': candidate_level,
            'required_level': required_level,
            'meets_requirement': candidate_level >= required_level,
            'exceeds_requirement': exceeds_requirement,
            'degree': education_data.get('degree', 'Not specified'),
            'bonus_points': requirement_bonus + institution_bonus,
            'penalty_points': requirement_penalty,
            'rating': self._get_education_rating(final_score)
        }
    
    def score_experience(self, experience_data: Dict, required_years: int = 3, 
                        domain: str = None) -> Dict:
        """
        Score experience based on years and relevance
        
        Args:
            experience_data: Experience information from resume
            required_years: Minimum required years of experience
            domain: Required domain/industry for relevance check
        """
        total_years = experience_data.get('total_years', 0)
        has_titles = len(experience_data.get('job_titles', [])) > 0
        has_companies = len(experience_data.get('companies', [])) > 0
        
        # Base score from years of experience
        base_score = self._calculate_experience_base_score(total_years)
        
        # Requirement check
        meets_requirement = total_years >= required_years
        exceeds_requirement = total_years > (required_years * 1.5)
        
        # Bonus for exceeding requirements
        requirement_bonus = 15 if exceeds_requirement else 0
        
        # Penalty for not meeting requirements
        requirement_penalty = -25 if not meets_requirement else 0
        
        # Bonus for having documented job titles
        title_bonus = 10 if has_titles else 0
        
        # Bonus for having company names (shows structured experience)
        company_bonus = 5 if has_companies else 0
        
        # Calculate experience relevance if domain provided
        domain_relevance = 0
        if domain:
            # Check if job titles contain domain-related keywords
            job_titles_text = ' '.join(experience_data.get('job_titles', [])).lower()
            domain_keywords = self._get_domain_keywords(domain)
            
            matches = sum(1 for keyword in domain_keywords if keyword in job_titles_text)
            domain_relevance = min((matches / len(domain_keywords)) * 30, 30) if domain_keywords else 0
        
        # Calculate final score
        final_score = (base_score + requirement_bonus + requirement_penalty + 
                      title_bonus + company_bonus + domain_relevance)
        final_score = max(0, min(100, final_score))  # Clamp between 0-100
        
        return {
            'experience_score': round(final_score, 2),
            'base_score': base_score,
            'total_years': total_years,
            'required_years': required_years,
            'meets_requirement': meets_requirement,
            'exceeds_requirement': exceeds_requirement,
            'domain_relevance_score': round(domain_relevance, 2),
            'has_structured_experience': has_titles and has_companies,
            'job_title_count': len(experience_data.get('job_titles', [])),
            'company_count': len(experience_data.get('companies', [])),
            'bonus_points': requirement_bonus + title_bonus + company_bonus,
            'penalty_points': requirement_penalty,
            'rating': self._get_experience_rating(final_score, total_years)
        }
    
    def score_domain_alignment(self, domain_data: Dict, target_domain: str) -> Dict:
        """
        Score how well the resume aligns with target domain
        
        Args:
            domain_data: Domain information from resume
            target_domain: Target domain for the position
        """
        primary_domain = domain_data.get('primary_domain', 'General')
        domain_scores = domain_data.get('domain_scores', {})
        
        # Check if primary domain matches target
        exact_match = primary_domain.lower() == target_domain.lower()
        
        # Get score for target domain
        target_score = domain_scores.get(target_domain, {}).get('score', 0)
        
        # Get confidence for primary domain
        primary_confidence = domain_data.get('confidence', 0)
        
        # Calculate alignment score
        if exact_match:
            alignment_score = 100
        elif target_score > 0:
            # Partial match - score based on keyword matches
            max_score = max([s.get('score', 0) for s in domain_scores.values()])
            alignment_score = (target_score / max_score) * 100 if max_score > 0 else 0
        else:
            alignment_score = 0
        
        # Apply confidence factor
        confidence_factor = min(primary_confidence / 10, 1.0)  # Normalize to 0-1
        final_score = alignment_score * (0.7 + (0.3 * confidence_factor))
        final_score = max(0, min(100, final_score))
        
        return {
            'domain_alignment_score': round(final_score, 2),
            'primary_domain': primary_domain,
            'target_domain': target_domain,
            'exact_match': exact_match,
            'confidence': primary_confidence,
            'target_keyword_count': target_score,
            'all_domain_scores': {d: s['score'] for d, s in domain_scores.items()},
            'rating': self._get_domain_rating(final_score, exact_match)
        }
    
    def calculate_overall_score(self, resume_data: Dict, requirements: Dict) -> Dict:
        """
        Calculate comprehensive overall score for a resume
        
        Args:
            resume_data: Complete parsed resume data
            requirements: Dictionary with job requirements
                {
                    'required_education_level': int,
                    'required_experience_years': int,
                    'target_domain': str,
                    'required_skills': List[str],
                    'optional_skills': List[str]
                }
        """
        # Individual component scores
        education_score_data = self.score_education(
            resume_data.get('education', {}),
            requirements.get('required_education_level', 3)
        )
        
        experience_score_data = self.score_experience(
            resume_data.get('experience', {}),
            requirements.get('required_experience_years', 3),
            requirements.get('target_domain')
        )
        
        domain_score_data = self.score_domain_alignment(
            resume_data.get('domain', {}),
            requirements.get('target_domain', 'IT')
        )
        
        # Language quality score (already 0-100)
        language_score = resume_data.get('language_quality', {}).get('grammar_score', 70)
        
        # Weighted overall score
        weights = {
            'education': 0.20,      # 20%
            'experience': 0.30,     # 30%
            'domain': 0.20,         # 20%
            'language': 0.10,       # 10%
            'skills': 0.20          # 20% (will be added from skill matching)
        }
        
        base_overall_score = (
            education_score_data['education_score'] * weights['education'] +
            experience_score_data['experience_score'] * weights['experience'] +
            domain_score_data['domain_alignment_score'] * weights['domain'] +
            language_score * weights['language']
        )
        
        return {
            'overall_score': round(base_overall_score, 2),  # Without skills (add later)
            'education_component': education_score_data,
            'experience_component': experience_score_data,
            'domain_component': domain_score_data,
            'language_component': {
                'score': language_score,
                'rating': resume_data.get('language_quality', {}).get('quality_rating', 'Not analyzed')
            },
            'weights': weights,
            'final_rating': self._get_overall_rating(base_overall_score),
            'breakdown': {
                'education': round(education_score_data['education_score'] * weights['education'], 2),
                'experience': round(experience_score_data['experience_score'] * weights['experience'], 2),
                'domain': round(domain_score_data['domain_alignment_score'] * weights['domain'], 2),
                'language': round(language_score * weights['language'], 2)
            }
        }
    
    def _calculate_experience_base_score(self, years: int) -> float:
        """Calculate base score for years of experience"""
        for min_years, max_years, score in self.experience_ranges:
            if min_years <= years <= max_years:
                return score
        return 0
    
    def _get_domain_keywords(self, domain: str) -> List[str]:
        """Get relevant keywords for domain matching"""
        domain_keywords_map = {
            'IT': ['developer', 'engineer', 'software', 'programmer', 'technical'],
            'Data Science': ['data', 'analytics', 'machine learning', 'ai', 'scientist'],
            'Marketing': ['marketing', 'campaign', 'branding', 'advertising', 'digital'],
            'Finance': ['finance', 'accounting', 'financial', 'investment', 'analyst'],
            'HR': ['hr', 'recruitment', 'talent', 'human resources'],
            'Sales': ['sales', 'business development', 'account', 'revenue'],
            'Design': ['design', 'designer', 'creative', 'ui', 'ux'],
            'Management': ['manager', 'director', 'lead', 'management']
        }
        return domain_keywords_map.get(domain, [])
    
    def _get_education_rating(self, score: float) -> str:
        """Get qualitative rating for education score"""
        if score >= 90:
            return "Excellent"
        elif score >= 75:
            return "Very Good"
        elif score >= 60:
            return "Good"
        elif score >= 45:
            return "Acceptable"
        else:
            return "Below Requirement"
    
    def _get_experience_rating(self, score: float, years: int) -> str:
        """Get qualitative rating for experience score"""
        if score >= 85:
            return f"Excellent ({years}+ years)"
        elif score >= 70:
            return f"Very Good ({years}+ years)"
        elif score >= 55:
            return f"Good ({years}+ years)"
        elif score >= 40:
            return f"Adequate ({years}+ years)"
        else:
            return f"Limited ({years} years)"
    
    def _get_domain_rating(self, score: float, exact_match: bool) -> str:
        """Get qualitative rating for domain alignment"""
        if exact_match and score >= 80:
            return "Perfect Match"
        elif score >= 70:
            return "Strong Alignment"
        elif score >= 50:
            return "Good Alignment"
        elif score >= 30:
            return "Partial Alignment"
        else:
            return "Poor Alignment"
    
    def _get_overall_rating(self, score: float) -> str:
        """Get overall qualitative rating"""
        if score >= 85:
            return "Excellent Candidate"
        elif score >= 70:
            return "Strong Candidate"
        elif score >= 55:
            return "Good Candidate"
        elif score >= 40:
            return "Average Candidate"
        else:
            return "Below Average Candidate"
