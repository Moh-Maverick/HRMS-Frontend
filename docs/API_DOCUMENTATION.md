# 🔌 API Documentation

This document describes the FastAPI backend endpoints for the FWC HRMS application.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://hrms-backend-lv6f.onrender.com`

## Authentication

The API uses Firebase Authentication for user verification. Include the Firebase ID token in the Authorization header:

```http
Authorization: Bearer <firebase_id_token>
```

## Endpoints Overview

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/health` | Health check | None |
| `POST` | `/chat` | HR Chatbot | Required |
| `POST` | `/jd/generate` | Generate Job Description | Required |
| `GET` | `/jd/{jd_id}` | Get Job Description | Required |
| `POST` | `/resume/screen` | Screen Resume | Required |

---

## Health Check

### `GET /health`

Check if the API is running and healthy.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

## HR Chatbot

### `POST /chat`

Process HR-related queries using AI-powered chatbot.

**Request Body:**
```json
{
  "user_id": "string",
  "query": "string",
  "session_id": "string" // optional
}
```

**Request Schema:**
```typescript
interface ChatRequest {
  user_id: string;           // Employee/user unique ID
  query: string;             // User message
  session_id?: string;      // Existing chat session ID (optional)
}
```

**Response:**
```json
{
  "session_id": "string",
  "response": "string",
  "intent": "string",
  "context": {
    "user_id": "string",
    "intent": "string",
    "conversation_history": "string",
    "employee_exists": boolean,
    "employee_name": "string"
  }
}
```

**Response Schema:**
```typescript
interface ChatResponse {
  session_id: string;        // Session ID for conversation continuity
  response: string;          // AI-generated response
  intent: string;            // Detected intent (leave_balance, policy_query, etc.)
  context: {                // Additional context data
    user_id: string;
    intent: string;
    conversation_history: string;
    employee_exists: boolean;
    employee_name?: string;
  };
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "query": "How many leave days do I have left?",
    "session_id": "session456"
  }'
```

**Example Response:**
```json
{
  "session_id": "session456",
  "response": "You have 12 leave days remaining for this year.",
  "intent": "leave_balance",
  "context": {
    "user_id": "user123",
    "intent": "leave_balance",
    "conversation_history": "Previous conversation...",
    "employee_exists": true,
    "employee_name": "John Doe"
  }
}
```

**Supported Intents:**
- `leave_balance` - Leave balance queries
- `policy_query` - Company policy questions
- `onboarding_help` - New employee guidance
- `salary_benefits` - Compensation and benefits
- `attendance` - Attendance and timesheet queries
- `performance` - Performance review questions
- `general_hr` - General HR assistance

**Status Codes:**
- `200 OK` - Query processed successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server error

---

## Job Description Generation

### `POST /jd/generate`

Generate AI-powered job descriptions using Google Gemini.

**Request Body:**
```json
{
  "role": "string",
  "department": "string",           // optional
  "experience": "string",           // optional
  "skills": ["string"],             // optional
  "location": "string",             // optional
  "employment_type": "string",       // optional
  "responsibilities": ["string"],    // optional
  "company": "string",              // optional
  "additional_notes": "string"      // optional
}
```

**Request Schema:**
```typescript
interface JDGenerateRequest {
  role: string;                     // Job role/title
  department?: string;              // Department name
  experience?: string;               // Required experience
  skills?: string[];                 // Required skills
  location?: string;                 // Job location
  employment_type?: string;          // Full-time, Part-time, etc.
  responsibilities?: string[];       // Key responsibilities
  company?: string;                  // Company name
  additional_notes?: string;        // Additional requirements
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "text_url": "string",
  "pdf_url": "string",
  "metadata": {
    "role": "string",
    "department": "string",
    "title": "string",
    "jd_text": "string"
  }
}
```

**Response Schema:**
```typescript
interface JDGenerateResponse {
  id: string;                       // Unique JD ID
  title: string;                    // Generated job title
  text_url: string;                 // URL to text version
  pdf_url: string;                  // URL to PDF version
  metadata: {                       // Generation metadata
    role: string;
    department?: string;
    title: string;
    jd_text: string;
  };
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/jd/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Senior Frontend Developer",
    "department": "Engineering",
    "experience": "3-5 years",
    "skills": ["React", "TypeScript", "Next.js"],
    "location": "Mumbai, India",
    "employment_type": "Full-time"
  }'
```

**Example Response:**
```json
{
  "id": "jd_abc123",
  "title": "Job Description - Senior Frontend Developer",
  "text_url": "",
  "pdf_url": "",
  "metadata": {
    "role": "Senior Frontend Developer",
    "department": "Engineering",
    "title": "Job Description - Senior Frontend Developer",
    "jd_text": "We are seeking a Senior Frontend Developer..."
  }
}
```

**Status Codes:**
- `200 OK` - JD generated successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Generation failed

---

## Get Job Description

### `GET /jd/{jd_id}`

Retrieve a previously generated job description.

**Path Parameters:**
- `jd_id` (string) - Job description ID

**Request:**
```http
GET /jd/jd_abc123
```

**Response:**
```json
{
  "id": "jd_abc123",
  "role": "Senior Frontend Developer",
  "department": "Engineering",
  "title": "Job Description - Senior Frontend Developer",
  "jd_text": "We are seeking a Senior Frontend Developer...",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - JD retrieved successfully
- `404 Not Found` - JD not found
- `401 Unauthorized` - Authentication required

---

## Resume Screening

### `POST /resume/screen`

Screen a resume against job requirements using AI analysis.

**Request Body:**
```json
{
  "resume_base64": "string",
  "resume_filename": "string",
  "job_id": "string",
  "candidate_name": "string",
  "enable_ai": boolean
}
```

**Request Schema:**
```typescript
interface ResumeScreeningRequest {
  resume_base64: string;           // Base64 encoded resume PDF
  resume_filename: string;         // Original filename
  job_id: string;                  // Job ID to match against
  candidate_name: string;          // Candidate name
  enable_ai: boolean;              // Enable AI analysis
}
```

**Response:**
```json
{
  "success": true,
  "ai_score": 85.5,
  "analysis": {
    "overall_assessment": "Resume analysis completed with 85.5% overall score",
    "strengths": ["Strong technical skills", "Relevant experience"],
    "weaknesses": ["Limited leadership experience"],
    "recommendation": "Recommended - Good fit with minor gaps",
    "component_scores": {
      "education": 90,
      "experience": 85,
      "domain": 80,
      "language": 75,
      "skill_match": 88
    },
    "skill_analysis": {
      "matched_required": ["React", "JavaScript", "Node.js"],
      "missing_required": ["TypeScript", "AWS"],
      "matched_optional": ["Docker", "Git"],
      "all_candidate_skills": ["React", "JavaScript", "Node.js", "Docker", "Git"]
    },
    "keyword_analysis": {
      "coverage_percentage": 88,
      "overall_density": 61.6,
      "keywords_found": 3,
      "keywords_missing": 2
    }
  },
  "parsed_data": {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1234567890",
    "skills": {
      "skills": ["React", "JavaScript", "Node.js"]
    },
    "experience": {
      "total_years": 3
    },
    "education": {
      "degree": "Bachelor of Technology"
    }
  },
  "component_scores": {
    "education": 90,
    "experience": 85,
    "domain": 80,
    "language": 75,
    "skill_match": 88
  },
  "skill_analysis": {
    "matched_required": ["React", "JavaScript", "Node.js"],
    "missing_required": ["TypeScript", "AWS"],
    "matched_optional": ["Docker", "Git"],
    "all_candidate_skills": ["React", "JavaScript", "Node.js", "Docker", "Git"]
  },
  "keyword_analysis": {
    "coverage_percentage": 88,
    "overall_density": 61.6,
    "keywords_found": 3,
    "keywords_missing": 2
  }
}
```

**Response Schema:**
```typescript
interface ResumeScreeningResponse {
  success: boolean;                // Operation success status
  ai_score?: number;              // Overall AI score (0-100)
  analysis?: {                    // Detailed AI analysis
    overall_assessment: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    component_scores: {
      education: number;
      experience: number;
      domain: number;
      language: number;
      skill_match: number;
    };
    skill_analysis: {
      matched_required: string[];
      missing_required: string[];
      matched_optional: string[];
      all_candidate_skills: string[];
    };
    keyword_analysis: {
      coverage_percentage: number;
      overall_density: number;
      keywords_found: number;
      keywords_missing: number;
    };
  };
  parsed_data?: {                 // Extracted resume data
    name: string;
    email: string;
    phone: string;
    skills: {
      skills: string[];
    };
    experience: {
      total_years: number;
    };
    education: {
      degree: string;
    };
  };
  component_scores?: {            // Individual component scores
    education: number;
    experience: number;
    domain: number;
    language: number;
    skill_match: number;
  };
  skill_analysis?: {              // Skill matching analysis
    matched_required: string[];
    missing_required: string[];
    matched_optional: string[];
    all_candidate_skills: string[];
  };
  keyword_analysis?: {           // Keyword analysis
    coverage_percentage: number;
    overall_density: number;
    keywords_found: number;
    keywords_missing: number;
  };
  error?: string;                 // Error message if failed
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8000/resume/screen" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_base64": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoK...",
    "resume_filename": "john_doe_resume.pdf",
    "job_id": "job_123",
    "candidate_name": "John Doe",
    "enable_ai": true
  }'
```

**Scoring Components:**

1. **Education Score (15%)**: Based on degree level and requirement match
2. **Experience Score (20%)**: Years of experience vs. requirement
3. **Domain Alignment (10%)**: Industry/domain fit
4. **Language Quality (10%)**: Grammar and communication skills
5. **Skill Match (45%)**: Required and optional skills matching

**Recommendation Levels:**
- `85-100`: "Highly recommended - Strong match for the position"
- `65-84`: "Recommended - Good fit with minor gaps"
- `50-64`: "Consider with reservations - Significant skill gaps"
- `35-49`: "Not recommended - Major skill mismatch"
- `0-34`: "Strongly not recommended - Poor fit for the role"

**Status Codes:**
- `200 OK` - Resume screened successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Screening failed

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "detail": "Error message description",
  "status_code": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `400 Bad Request` | Invalid request data | Missing required fields, invalid format |
| `401 Unauthorized` | Authentication required | Missing or invalid Firebase token |
| `404 Not Found` | Resource not found | Invalid job ID, non-existent JD |
| `422 Unprocessable Entity` | Validation error | Invalid data types, constraint violations |
| `500 Internal Server Error` | Server error | AI service failure, database error |

### Error Examples

**Invalid Request:**
```json
{
  "detail": "Field 'user_id' is required",
  "status_code": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Authentication Error:**
```json
{
  "detail": "Authentication required",
  "status_code": 401,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**AI Service Error:**
```json
{
  "detail": "AI service temporarily unavailable",
  "status_code": 500,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Rate Limiting

### Current Limits

- **Chat Endpoint**: 100 requests per minute per user
- **JD Generation**: 20 requests per minute per user
- **Resume Screening**: 10 requests per minute per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

### Rate Limit Exceeded Response

```json
{
  "detail": "Rate limit exceeded. Try again in 60 seconds.",
  "status_code": 429,
  "retry_after": 60
}
```

---

## Testing the API

### Interactive Documentation

Visit the API documentation at:
- **Development**: http://localhost:8000/docs
- **Production**: https://your-railway-app.railway.app/docs

### Using curl

**Test Health Check:**
```bash
curl http://localhost:8000/health
```

**Test Chatbot:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test123", "query": "Hello"}'
```

**Test JD Generation:**
```bash
curl -X POST "http://localhost:8000/jd/generate" \
  -H "Content-Type: application/json" \
  -d '{"role": "Software Engineer"}'
```

### Using Postman

1. Import the API collection
2. Set base URL to your API endpoint
3. Add Firebase token to Authorization header
4. Test each endpoint with sample data

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Chat API
const chatResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    user_id: userId,
    query: userQuery,
    session_id: sessionId
  })
});

const chatData = await chatResponse.json();
```

### Python

```python
import requests

# Resume Screening
response = requests.post(
    'http://localhost:8000/resume/screen',
    headers={'Authorization': f'Bearer {firebase_token}'},
    json={
        'resume_base64': resume_base64,
        'resume_filename': 'resume.pdf',
        'job_id': job_id,
        'candidate_name': candidate_name,
        'enable_ai': True
    }
)

result = response.json()
```

This API documentation provides comprehensive information for integrating with the FWC HRMS backend services.
