import re
import pdfplumber
from typing import Dict, List, Tuple, Optional
import spacy
from collections import Counter

# Disable language_tool_python completely to avoid slow initialization and hanging
# Set to False to use fast fallback grammar scoring instead
LANGUAGE_TOOL_AVAILABLE = False

class EnhancedResumeParser:
    """
    Enhanced resume parser with comprehensive extraction capabilities
    """
    
    def __init__(self):
        # Load spaCy model for NLP tasks
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            print("Downloading spaCy model...")
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")
        
        # Skills database (extensible)
        self.default_skills = {
            'programming': ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'Scala', 'R'],
            'web': ['HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind'],
            'database': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'MS SQL Server', 'SQLite', 'Cassandra', 'DynamoDB'],
            'cloud': ['AWS', 'Azure', 'Google Cloud', 'GCP', 'Heroku', 'DigitalOcean', 'Firebase', 'Kubernetes', 'Docker', 'Jenkins'],
            'data_science': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision'],
            'tools': ['Git', 'GitHub', 'GitLab', 'Jira', 'Agile', 'Scrum', 'CI/CD', 'REST API', 'GraphQL', 'Microservices'],
            'marketing': ['SEO', 'SEM', 'Google Analytics', 'Content Marketing', 'Social Media Marketing', 'Email Marketing', 'PPC', 'Facebook Ads', 'Google Ads'],
            'design': ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD', 'UI/UX', 'InDesign', 'CorelDRAW'],
            'business': ['Project Management', 'Business Analysis', 'Financial Analysis', 'Strategic Planning', 'Budgeting', 'Forecasting', 'Leadership']
        }
        
        # Education levels (ranked)
        self.education_levels = {
            'phd': 5,
            'doctorate': 5,
            'ph.d': 5,
            'master': 4,
            'mba': 4,
            'msc': 4,
            'ma': 4,
            'bachelor': 3,
            'bsc': 3,
            'ba': 3,
            'btech': 3,
            'be': 3,
            'associate': 2,
            'diploma': 2,
            'high school': 1,
            'secondary': 1
        }
        
        # Domain keywords
        self.domain_keywords = {
            'IT': ['software', 'developer', 'programmer', 'engineer', 'coding', 'technology', 'systems', 'database', 'cloud', 'devops', 'frontend', 'backend', 'fullstack'],
            'Data Science': ['data scientist', 'machine learning', 'ai', 'artificial intelligence', 'analytics', 'statistics', 'data mining', 'deep learning'],
            'Marketing': ['marketing', 'advertising', 'branding', 'campaigns', 'social media', 'content', 'seo', 'sem', 'digital marketing'],
            'Finance': ['finance', 'accounting', 'investment', 'banking', 'financial analysis', 'auditing', 'taxation', 'economics'],
            'HR': ['human resources', 'recruitment', 'talent acquisition', 'hr management', 'employee relations', 'payroll', 'compensation'],
            'Sales': ['sales', 'business development', 'account management', 'client relations', 'revenue', 'lead generation', 'crm'],
            'Design': ['designer', 'ui/ux', 'graphic design', 'visual design', 'creative', 'illustration', 'branding', 'typography'],
            'Management': ['manager', 'director', 'executive', 'leadership', 'strategy', 'planning', 'operations', 'team lead']
        }
        
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
        return text
    
    def extract_basic_info(self, text: str) -> Dict:
        """Extract name, email, phone"""
        lines = text.strip().split('\n')
        
        # Extract name (usually first line)
        name = lines[0].strip() if lines else ""
        
        # Extract email
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        email_match = re.search(email_pattern, text)
        email = email_match.group() if email_match else ""
        
        # Extract phone
        phone_pattern = r'(\+\d{1,3}[-.]?)?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phone_match = re.search(phone_pattern, text)
        phone = phone_match.group() if phone_match else ""
        
        return {
            'name': name,
            'email': email,
            'phone': phone
        }
    
    def extract_skills(self, text: str, custom_skills: Optional[List[str]] = None) -> Dict:
        """Extract skills from resume with categorization"""
        text_lower = text.lower()
        
        # Use custom skills if provided, otherwise use default
        skills_to_check = custom_skills if custom_skills else []
        if not custom_skills:
            for category, skills in self.default_skills.items():
                skills_to_check.extend(skills)
        
        found_skills = []
        skill_categories = {}
        
        for skill in skills_to_check:
            skill_lower = skill.lower().strip()
            
            # Generate all possible variations for bidirectional matching
            variations = set([skill_lower])
            
            # Handle dots: node.js <-> nodejs, node js, node
            if '.' in skill_lower:
                variations.add(skill_lower.replace('.', ''))  # node.js -> nodejs
                variations.add(skill_lower.replace('.', ' '))  # node.js -> node js
                base = skill_lower.split('.')[0]
                variations.add(base)  # node.js -> node
            else:
                # Reverse: nodejs -> node.js, node js
                if skill_lower.endswith('js') and len(skill_lower) > 2:
                    base = skill_lower[:-2]
                    variations.add(base + '.js')  # nodejs -> node.js
                    variations.add(base + ' js')  # nodejs -> node js
                    variations.add(base)  # nodejs -> node
            
            # Handle "js" suffix: expressjs <-> express.js, express js, express
            if 'js' in skill_lower:
                if skill_lower.endswith('js') and len(skill_lower) > 2:
                    base = skill_lower[:-2]
                    variations.add(base + '.js')  # expressjs -> express.js
                    variations.add(base + ' js')  # expressjs -> express js
                    variations.add(base)  # expressjs -> express
                    
            # Handle C/C++ special cases
            if skill_lower in ['c', 'c++', 'c#', 'r']:
                # For single-letter languages, be more strict
                variations = {skill_lower}
            
            # Check all variations
            found = False
            for variant in variations:
                if skill_lower in ['c', 'c++', 'c#', 'r']:
                    # Strict matching for single-letter/special languages
                    pattern = r'\b' + re.escape(variant) + r'\b'
                else:
                    # Flexible pattern for other skills
                    pattern = r'(?:^|[^a-zA-Z])' + re.escape(variant) + r'(?:[^a-zA-Z]|$)'
                
                if re.search(pattern, text_lower):
                    found = True
                    break
            
            if found:
                found_skills.append(skill)
                
                # Categorize if using default skills
                if not custom_skills:
                    for category, cat_skills in self.default_skills.items():
                        if skill in cat_skills:
                            if category not in skill_categories:
                                skill_categories[category] = []
                            skill_categories[category].append(skill)
        
        return {
            'skills': found_skills,
            'skill_count': len(found_skills),
            'categories': skill_categories
        }
    
    def extract_education(self, text: str) -> Dict:
        """Extract education information and level"""
        text_lower = text.lower()
        
        # Find education level
        max_level = 0
        degree_found = ""
        
        for degree, level in self.education_levels.items():
            if degree in text_lower:
                if level > max_level:
                    max_level = level
                    degree_found = degree
        
        # Extract years/graduation dates
        year_pattern = r'20[0-2]\d'
        years = re.findall(year_pattern, text)
        
        # Extract institutions (using common patterns)
        institution_keywords = ['university', 'college', 'institute', 'school']
        institutions = []
        for line in text.split('\n'):
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in institution_keywords):
                institutions.append(line.strip())
        
        return {
            'education_level': max_level,
            'degree': degree_found.upper() if degree_found else "Not specified",
            'graduation_years': years,
            'institutions': institutions[:3]  # Top 3
        }
    
    def extract_experience(self, text: str) -> Dict:
        """Extract work experience details"""
        # Method 1: Extract explicit years mentioned
        exp_patterns = [
            r'(\d+)[\+]?\s*(?:years?|yrs?)\s*(?:of)?\s*experience',
            r'experience[:\s]+(\d+)[\+]?\s*(?:years?|yrs?)',
            r'(\d+)[\+]?\s*(?:years?|yrs?)'
        ]
        
        total_years = 0
        for pattern in exp_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                total_years = max([int(m) for m in matches])
                break
        
        # Method 2: Calculate from date ranges if not found
        if total_years == 0:
            # Find date patterns like "2020 - 2023", "2020 - Present", "Jan 2020 - Dec 2023"
            date_ranges = re.findall(r'(20\d{2})\s*[-–]\s*(?:(20\d{2})|present|current)', text, re.IGNORECASE)
            
            if date_ranges:
                current_year = 2025  # Current year
                calculated_years = 0
                
                for start_year, end_year in date_ranges:
                    start = int(start_year)
                    end = int(end_year) if end_year else current_year
                    duration = max(0, end - start)
                    calculated_years += duration
                
                # Use calculated years if we found date ranges
                if calculated_years > 0:
                    total_years = calculated_years
        
        # Extract job titles using NLP
        doc = self.nlp(text)
        job_titles = []
        
        # Common job title indicators
        title_keywords = ['developer', 'engineer', 'manager', 'analyst', 'designer', 
                         'specialist', 'consultant', 'director', 'lead', 'architect',
                         'intern', 'associate', 'senior', 'junior', 'trainee']
        
        for sent in doc.sents:
            sent_text = sent.text.lower()
            if any(keyword in sent_text for keyword in title_keywords):
                # Extract potential job title
                for chunk in sent.noun_chunks:
                    if any(keyword in chunk.text.lower() for keyword in title_keywords):
                        job_titles.append(chunk.text)
        
        # Extract companies (capitalize proper nouns that might be company names)
        companies = []
        for ent in doc.ents:
            if ent.label_ == "ORG":
                companies.append(ent.text)
        
        return {
            'total_years': total_years,
            'job_titles': list(set(job_titles))[:5],  # Top 5 unique
            'companies': list(set(companies))[:5],  # Top 5 unique
            'has_experience': total_years > 0 or len(job_titles) > 0
        }
    
    def detect_domain(self, text: str) -> Dict:
        """Detect primary domain/industry alignment"""
        text_lower = text.lower()
        domain_scores = {}
        
        for domain, keywords in self.domain_keywords.items():
            score = 0
            matched_keywords = []
            for keyword in keywords:
                count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', text_lower))
                if count > 0:
                    score += count
                    matched_keywords.append(keyword)
            
            domain_scores[domain] = {
                'score': score,
                'matched_keywords': matched_keywords
            }
        
        # Find primary domain
        primary_domain = max(domain_scores, key=lambda x: domain_scores[x]['score'])
        
        # Get top 3 domains
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        top_domains = [(d, s['score']) for d, s in sorted_domains[:3] if s['score'] > 0]
        
        return {
            'primary_domain': primary_domain if domain_scores[primary_domain]['score'] > 0 else "General",
            'domain_scores': domain_scores,
            'top_domains': top_domains,
            'confidence': domain_scores[primary_domain]['score'] if domain_scores[primary_domain]['score'] > 0 else 0
        }
    
    def analyze_language_quality(self, text: str) -> Dict:
        """Analyze grammar and language quality"""
        try:
            # Sample first 1000 words for performance
            words = text.split()[:1000]
            sample_text = ' '.join(words)
            
            # Calculate basic metrics
            word_count = len(words)
            sentence_count = len(re.findall(r'[.!?]+', sample_text))
            
            # Vocabulary diversity (unique words / total words)
            unique_words = len(set([w.lower() for w in words if w.isalpha()]))
            vocab_diversity = (unique_words / word_count * 100) if word_count > 0 else 0
            
            # Grammar checking - Using fast fallback method
            # Base score on vocabulary diversity and text quality indicators
            error_count = 0
            
            # Start with vocabulary-based score
            grammar_score = 70  # Base score for resumes
            
            # Adjust based on vocabulary diversity (good indicator of writing quality)
            if vocab_diversity > 60:
                grammar_score += 15  # Excellent vocabulary
            elif vocab_diversity > 50:
                grammar_score += 10  # Good vocabulary
            elif vocab_diversity > 40:
                grammar_score += 5   # Average vocabulary
            
            # Adjust based on resume length (completeness)
            if word_count >= 300:
                grammar_score += 10  # Comprehensive resume
            elif word_count >= 150:
                grammar_score += 5   # Adequate resume
            elif word_count < 50:
                grammar_score -= 15  # Too short
            
            # Check for professional language indicators
            professional_keywords = ['experience', 'developed', 'managed', 'led', 'created',
                                    'implemented', 'designed', 'analyzed', 'coordinated']
            professional_count = sum(1 for kw in professional_keywords if kw in text.lower())
            if professional_count >= 5:
                grammar_score += 5
            
            # Clamp score between 60-95 (resumes typically score in this range)
            grammar_score = max(60, min(95, grammar_score))
            
            # Average sentence length
            avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0
            
            return {
                'grammar_score': round(grammar_score, 2),
                'error_count': error_count,
                'word_count': word_count,
                'sentence_count': sentence_count,
                'vocab_diversity': round(vocab_diversity, 2),
                'avg_sentence_length': round(avg_sentence_length, 2),
                'quality_rating': 'Excellent' if grammar_score >= 90 else 'Good' if grammar_score >= 75 else 'Fair' if grammar_score >= 60 else 'Needs Improvement'
            }
        except Exception as e:
            print(f"Error in language analysis: {e}")
            return {
                'grammar_score': 0,
                'error_count': 0,
                'word_count': len(text.split()),
                'quality_rating': 'Not analyzed'
            }
    
    def parse_resume(self, pdf_path: str, custom_skills: Optional[List[str]] = None) -> Dict:
        """Complete resume parsing with all features"""
        text = self.extract_text_from_pdf(pdf_path)
        
        if not text:
            return {'error': 'Could not extract text from PDF'}
        
        # Extract all information
        basic_info = self.extract_basic_info(text)
        skills_info = self.extract_skills(text, custom_skills)
        education_info = self.extract_education(text)
        experience_info = self.extract_experience(text)
        domain_info = self.detect_domain(text)
        language_info = self.analyze_language_quality(text)
        
        return {
            'basic_info': basic_info,
            'skills': skills_info,
            'education': education_info,
            'experience': experience_info,
            'domain': domain_info,
            'language_quality': language_info,
            'raw_text': text
        }
