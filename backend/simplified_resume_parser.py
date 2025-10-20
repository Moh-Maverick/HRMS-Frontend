"""
Simplified Resume Parser
Lightweight version without spaCy dependency
"""

import os
import re
import json
from typing import Dict, List, Any, Optional
import pdfplumber
import PyPDF2
from textblob import TextBlob


class SimplifiedResumeParser:
    """
    Lightweight resume parser using TextBlob instead of spaCy
    """
    
    def __init__(self):
        self.textblob = TextBlob("")
        print("✓ Simplified Resume Parser initialized")
    
    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Parse resume PDF and extract key information
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Dictionary with parsed resume data
        """
        try:
            # Extract text from PDF
            text = self._extract_text_from_pdf(file_path)
            
            if not text.strip():
                return self._create_empty_result("No text found in PDF")
            
            # Parse different sections
            parsed_data = {
                'name': self._extract_name(text),
                'email': self._extract_email(text),
                'phone': self._extract_phone(text),
                'skills': self._extract_skills(text),
                'education': self._extract_education(text),
                'experience': self._extract_experience(text),
                'domain': self._detect_domain(text),
                'language_quality': self._assess_language_quality(text),
                'raw_text': text
            }
            
            print(f"✓ Resume parsed successfully: {parsed_data.get('name', 'Unknown')}")
            return parsed_data
            
        except Exception as e:
            print(f"✗ Error parsing resume: {e}")
            return self._create_empty_result(f"Error parsing resume: {str(e)}")
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using pdfplumber"""
        try:
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            print(f"Error extracting text: {e}")
            return ""
    
    def _extract_name(self, text: str) -> str:
        """Extract candidate name from resume text"""
        lines = text.split('\n')
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            if len(line) > 2 and len(line) < 50:
                # Simple heuristic: first line that looks like a name
                if re.match(r'^[A-Za-z\s\.]+$', line) and not any(word in line.lower() for word in ['email', 'phone', 'address', 'objective', 'summary']):
                    return line
        return "Unknown"
    
    def _extract_email(self, text: str) -> str:
        """Extract email address"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else ""
    
    def _extract_phone(self, text: str) -> str:
        """Extract phone number"""
        phone_patterns = [
            r'\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}',
            r'\+?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}'
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                return phones[0]
        return ""
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        # Common technical skills
        skill_keywords = [
            'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'Angular', 'Vue.js',
            'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Azure', 'Docker',
            'Kubernetes', 'Git', 'Jenkins', 'CI/CD', 'REST API', 'GraphQL', 'TypeScript',
            'HTML', 'CSS', 'Bootstrap', 'jQuery', 'Express.js', 'Django', 'Flask',
            'Spring Boot', 'Hibernate', 'Maven', 'Gradle', 'Linux', 'Windows',
            'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
            'Data Analysis', 'Business Intelligence', 'Tableau', 'Power BI', 'Excel',
            'Project Management', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skill_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    def _extract_education(self, text: str) -> List[Dict[str, str]]:
        """Extract education information"""
        education = []
        
        # Look for degree patterns
        degree_patterns = [
            r'(Bachelor|Master|PhD|Doctorate|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Tech|M\.Tech)[\s\w]*',
            r'(Computer Science|Engineering|Business|Management|Information Technology)[\s\w]*'
        ]
        
        for pattern in degree_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                education.append({
                    'degree': match,
                    'field': 'Not specified',
                    'institution': 'Not specified'
                })
        
        return education[:3]  # Return max 3 education entries
    
    def _extract_experience(self, text: str) -> List[Dict[str, str]]:
        """Extract work experience"""
        experience = []
        
        # Look for job title patterns
        job_patterns = [
            r'(Software Engineer|Developer|Manager|Analyst|Consultant|Specialist)[\s\w]*',
            r'(Senior|Junior|Lead|Principal)[\s\w]*'
        ]
        
        for pattern in job_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                experience.append({
                    'title': match,
                    'company': 'Not specified',
                    'duration': 'Not specified',
                    'description': 'Not specified'
                })
        
        return experience[:5]  # Return max 5 experience entries
    
    def _detect_domain(self, text: str) -> str:
        """Detect primary domain/industry"""
        domains = {
            'IT': ['software', 'programming', 'development', 'coding', 'python', 'java', 'javascript'],
            'Finance': ['finance', 'banking', 'investment', 'accounting', 'financial'],
            'Marketing': ['marketing', 'advertising', 'brand', 'campaign', 'social media'],
            'Healthcare': ['healthcare', 'medical', 'hospital', 'patient', 'clinical'],
            'Education': ['education', 'teaching', 'academic', 'university', 'school']
        }
        
        text_lower = text.lower()
        domain_scores = {}
        
        for domain, keywords in domains.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            domain_scores[domain] = score
        
        if domain_scores:
            return max(domain_scores, key=domain_scores.get)
        return 'General'
    
    def _assess_language_quality(self, text: str) -> Dict[str, Any]:
        """Assess language quality using TextBlob"""
        try:
            blob = TextBlob(text)
            
            # Basic metrics
            sentences = blob.sentences
            words = blob.words
            
            avg_sentence_length = len(words) / len(sentences) if sentences else 0
            
            # Simple quality score (0-100)
            quality_score = min(100, max(0, 
                50 + (avg_sentence_length - 10) * 2 + 
                (len(sentences) / 10) * 5
            ))
            
            return {
                'score': round(quality_score, 1),
                'sentence_count': len(sentences),
                'word_count': len(words),
                'avg_sentence_length': round(avg_sentence_length, 1)
            }
        except Exception as e:
            return {
                'score': 50.0,
                'sentence_count': 0,
                'word_count': 0,
                'avg_sentence_length': 0,
                'error': str(e)
            }
    
    def _create_empty_result(self, error_msg: str) -> Dict[str, Any]:
        """Create empty result with error message"""
        return {
            'name': 'Unknown',
            'email': '',
            'phone': '',
            'skills': [],
            'education': [],
            'experience': [],
            'domain': 'Unknown',
            'language_quality': {'score': 0, 'error': error_msg},
            'raw_text': '',
            'error': error_msg
        }