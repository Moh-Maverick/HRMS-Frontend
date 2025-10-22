# 🏗️ System Architecture

## Overview

The FWC HRMS follows a modern microservices architecture with a Next.js frontend and FastAPI backend, integrated with Firebase for authentication and data storage. The system is designed to handle enterprise-scale operations with 5000+ concurrent users.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js 15)  │    │   (FastAPI)     │    │   Services      │
│                 │    │                 │    │                 │
│ • Dashboard UI  │◄──►│ • AI Services  │◄──►│ • Firebase      │
│ • Auth Context  │    │ • Chatbot Core │    │ • Gemini AI     │
│ • Components    │    │ • Resume Parser │    │ • VAPI          │
│ • API Client    │    │ • JD Generator  │    │ • Firestore     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Next.js App Router Structure

```
src/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/                # Role-based dashboards
│   │   ├── admin/                # Admin dashboard
│   │   ├── hr/                   # HR dashboard
│   │   ├── manager/              # Manager dashboard
│   │   ├── employee/             # Employee dashboard
│   │   └── candidate/            # Candidate dashboard
│   ├── ai-services/              # AI features showcase
│   └── tools/                    # Admin tools (seeding)
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   ├── dashboard/                # Dashboard-specific components
│   └── layout/                   # Layout components
└── lib/                          # Utilities and configurations
    ├── firebase.ts               # Firebase configuration
    ├── auth.tsx                  # Authentication context
    ├── api.ts                    # API client
    └── firestoreApi.ts           # Firestore operations
```

### Component Architecture

- **Layout Components**: `DashboardLayout`, `AuthLayout`
- **UI Components**: `Button`, `Input`, `Modal`, `Card`, `Table`
- **Feature Components**: `ChatWidget`, `JDModal`, `StatsCard`
- **Dashboard Components**: Role-specific dashboard components

### State Management

- **Authentication**: Firebase Auth with React Context
- **Data Fetching**: Custom hooks with Firestore real-time listeners
- **UI State**: React useState and useEffect
- **Global State**: Context providers for user data and preferences

## Backend Architecture

### FastAPI Microservices

```
backend/
├── app.py                        # Main FastAPI application
├── chatbot_core.py              # HR Chatbot service
├── resume_screening_service.py   # Resume analysis service
├── jd_service.py                # Job description generation
├── llm_handler.py               # LLM integration layer
├── firebase_client.py           # Firebase admin SDK
├── session_manager.py           # Chat session management
└── data/                        # Static data files
    ├── employees.json
    └── policies.json
```

### Service Layer Architecture

1. **API Layer** (`app.py`)
   - FastAPI application with CORS middleware
   - Request/response models with Pydantic
   - Error handling and validation

2. **Business Logic Layer**
   - `HRChatbot`: Intent classification and response generation
   - `ResumeScreeningService`: AI-powered resume analysis
   - `JDService`: Job description generation
   - `SessionManager`: Conversation state management

3. **Integration Layer**
   - `LLMHandler`: Google Gemini AI integration
   - `FirebaseClient`: Database and storage operations
   - `DataLoader`: Static data and policy management

## Database Schema (Firebase Firestore)

### Collections Overview

```
Firestore Database
├── users/                        # User authentication and roles
├── departments/                  # Department management
├── jobs/                         # Job postings
├── candidates/                   # Candidate profiles
├── candidateProfiles/            # Detailed candidate data
├── applications/                 # Job applications
├── interviews/                   # Interview scheduling
├── profiles/                     # Employee profiles
├── attendance/                   # Attendance records
├── leaves/                       # Leave requests
├── performance/                  # Performance reviews
├── feedbacks/                    # Employee feedback
├── managerFeedbacks/             # Manager feedback
└── job_descriptions/             # Generated job descriptions
```

### Key Relationships

- **Users ↔ Profiles**: One-to-one relationship for employee data
- **Jobs ↔ Applications**: One-to-many for job applications
- **Candidates ↔ Applications**: One-to-many for candidate applications
- **Departments ↔ Users**: One-to-many for department employees
- **Managers ↔ Employees**: Hierarchical reporting structure

## Authentication Flow

### Firebase Authentication

1. **User Registration**
   ```
   User Input → Firebase Auth → Firestore User Document
   ```

2. **Login Process**
   ```
   Credentials → Firebase Auth → Token Validation → Role Assignment
   ```

3. **Role-Based Access Control**
   ```
   Token → User Document → Role Check → Dashboard Redirect
   ```

### Role Hierarchy

- **Admin**: Full system access, user management
- **HR**: Recruitment, candidate management, job posting
- **Manager**: Team management, leave approvals, performance
- **Employee**: Personal data, leave requests, chatbot access
- **Candidate**: Job applications, interview scheduling

## AI Integration Points

### 1. Google Gemini AI Integration

```python
# LLM Handler Architecture
class LLMHandler:
    def __init__(self):
        self.provider = os.getenv('LLM_PROVIDER', 'gemini')
        self.model = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
    
    async def generate_response(self, prompt: str) -> str:
        # Gemini API integration
        # Error handling and fallbacks
        # Response formatting
```

### 2. Resume Screening Pipeline

```
PDF Upload → Text Extraction → AI Analysis → Scoring → Results
     ↓              ↓              ↓           ↓         ↓
  Firebase      PyPDF2/      Gemini AI   Algorithm   Firestore
  Storage      pdfplumber      Analysis    Scoring     Storage
```

### 3. Chatbot Architecture

```
User Query → Intent Classification → Context Gathering → AI Response
     ↓              ↓                    ↓               ↓
  Frontend      Regex Patterns      Firebase Data    Gemini AI
  ChatWidget    + ML Models         + Session        Generation
```

### 4. Voice Interview Integration (VAPI)

```
HR Token Generation → Candidate Access → Voice Interview → Results
         ↓                  ↓               ↓              ↓
    FastAPI Endpoint    Token Validation   VAPI Platform   Firebase
    Token Creation     Candidate Portal   Voice AI        Storage
```

## Data Flow Diagrams

### User Authentication Flow

```
1. User Login Request
   ↓
2. Firebase Auth Validation
   ↓
3. User Document Retrieval
   ↓
4. Role Assignment
   ↓
5. Dashboard Redirect
```

### Resume Screening Flow

```
1. HR Uploads Resume
   ↓
2. PDF Processing
   ↓
3. Text Extraction
   ↓
4. AI Analysis (Gemini)
   ↓
5. Scoring Algorithm
   ↓
6. Results Storage
   ↓
7. HR Dashboard Update
```

### Chatbot Query Flow

```
1. Employee Query
   ↓
2. Intent Classification
   ↓
3. Context Gathering
   ↓
4. AI Response Generation
   ↓
5. Session Update
   ↓
6. Response Display
```

## Scalability Considerations

### Frontend Scalability

- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Component-level lazy loading
- **Caching**: Firebase SDK caching mechanisms
- **CDN**: Vercel's global CDN distribution

### Backend Scalability

- **Stateless Design**: FastAPI stateless services
- **Connection Pooling**: Firebase connection management
- **Caching**: Response caching for AI services
- **Rate Limiting**: API rate limiting implementation

### Database Scalability

- **Firestore**: Automatic scaling and sharding
- **Indexing**: Optimized query indexes
- **Pagination**: Large dataset pagination
- **Real-time**: Efficient real-time listeners

## Security Architecture

### Authentication Security

- **Firebase Auth**: Industry-standard authentication
- **JWT Tokens**: Secure token-based authentication
- **Role Validation**: Server-side role verification
- **Session Management**: Secure session handling

### Data Security

- **Firestore Rules**: Database-level security rules
- **API Validation**: Request/response validation
- **CORS Policy**: Cross-origin request security
- **Environment Variables**: Secure configuration management

### AI Service Security

- **API Key Management**: Secure API key storage
- **Input Validation**: AI input sanitization
- **Rate Limiting**: AI service rate limiting
- **Error Handling**: Secure error responses

## Monitoring and Logging

### Application Monitoring

- **Vercel Analytics**: Frontend performance monitoring
- **Railway Logs**: Backend application logs
- **Firebase Console**: Database and auth monitoring
- **Error Tracking**: Client and server error tracking

### Performance Metrics

- **Response Times**: API response time monitoring
- **User Metrics**: User engagement tracking
- **AI Performance**: AI service performance metrics
- **Database Performance**: Query performance monitoring

## Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   Firebase      │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│                 │    │                 │    │                 │
│ • Next.js App   │◄──►│ • FastAPI       │◄──►│ • Firestore     │
│ • Static Assets │    │ • Python        │    │ • Auth          │
│ • CDN           │    │ • Auto-scaling  │    │ • Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Configuration

- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live application with monitoring

This architecture ensures scalability, maintainability, and performance while providing a robust foundation for enterprise-level HR management operations.
