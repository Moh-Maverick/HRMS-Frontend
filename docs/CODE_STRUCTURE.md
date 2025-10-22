# 🏗️ Code Structure

This document explains the project organization, key files, and coding conventions used in the FWC HRMS application.

## Project Overview

The FWC HRMS is built using a modern full-stack architecture with Next.js frontend and FastAPI backend, integrated with Firebase for authentication and data storage.

## Frontend Structure

### Root Directory Structure

```
hrms-frontend/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/                        # Source code
│   ├── app/                    # Next.js App Router
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities and configurations
│   └── hooks/                  # Custom React hooks
├── backend/                    # Python FastAPI backend
├── docs/                       # Documentation
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # TailwindCSS configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

### Source Code Organization (`src/`)

#### App Router (`src/app/`)

```
src/app/
├── auth/                       # Authentication pages
│   ├── layout.tsx             # Auth layout wrapper
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── signup/
│       └── page.tsx           # Signup page
├── dashboard/                  # Role-based dashboards
│   ├── [role]/                # Dynamic role routing
│   │   └── layout.tsx         # Dashboard layout
│   ├── admin/                 # Admin dashboard
│   │   ├── page.tsx           # Admin home
│   │   ├── departments/
│   │   │   └── page.tsx       # Department management
│   │   ├── users/
│   │   │   └── page.tsx       # User management
│   │   ├── analytics/
│   │   │   └── page.tsx       # Analytics dashboard
│   │   ├── ai-monitor/
│   │   │   └── page.tsx       # AI monitoring
│   │   └── settings/
│   │       └── page.tsx       # System settings
│   ├── hr/                    # HR dashboard
│   │   ├── page.tsx           # HR home
│   │   ├── jobs/
│   │   │   ├── page.tsx       # Job management
│   │   │   └── new/
│   │   │       └── page.tsx   # Create new job
│   │   ├── candidates/
│   │   │   └── page.tsx       # Candidate management
│   │   ├── interviews/
│   │   │   └── page.tsx       # Interview scheduling
│   │   ├── applications/
│   │   │   └── page.tsx       # Application tracking
│   │   ├── offers/
│   │   │   └── page.tsx       # Job offers
│   │   └── reports/
│   │       └── page.tsx       # HR reports
│   ├── manager/               # Manager dashboard
│   │   ├── page.tsx           # Manager home
│   │   ├── team/
│   │   │   └── page.tsx       # Team management
│   │   ├── attendance/
│   │   │   └── page.tsx       # Team attendance
│   │   ├── leave-requests/
│   │   │   └── page.tsx       # Leave approvals
│   │   ├── performance/
│   │   │   └── page.tsx       # Performance reviews
│   │   └── feedback/
│   │       └── page.tsx       # Feedback management
│   ├── employee/              # Employee dashboard
│   │   ├── layout.tsx         # Employee layout
│   │   ├── page.tsx           # Employee home
│   │   ├── profile/
│   │   │   └── page.tsx       # Profile management
│   │   ├── attendance/
│   │   │   └── page.tsx       # Attendance tracking
│   │   ├── leave/
│   │   │   └── page.tsx       # Leave management
│   │   ├── leave-request/
│   │   │   └── page.tsx       # Leave request form
│   │   ├── payroll/
│   │   │   └── page.tsx       # Payroll information
│   │   └── feedback/
│   │       └── page.tsx       # Feedback submission
│   ├── candidate/             # Candidate dashboard
│   │   ├── page.tsx           # Candidate home
│   │   ├── jobs/
│   │   │   └── page.tsx       # Job applications
│   │   ├── applications/
│   │   │   └── page.tsx       # Application status
│   │   ├── interview/
│   │   │   └── page.tsx       # AI voice interview
│   │   ├── interviews/
│   │   │   └── page.tsx       # Interview schedule
│   │   ├── profile/
│   │   │   └── page.tsx       # Profile management
│   │   └── result/
│   │       └── page.tsx       # Interview results
│   └── layout.tsx             # Main dashboard layout
├── ai-services/                # AI features showcase
│   └── page.tsx               # AI services overview
├── tools/                      # Admin tools
│   └── seed/
│       └── page.tsx           # Data seeding tool
├── globals.css                 # Global styles
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── page.module.css            # Home page styles
└── providers.tsx              # Context providers
```

#### Components (`src/components/`)

```
src/components/
├── ui/                         # Base UI components
│   ├── badge.tsx              # Badge component
│   ├── button.tsx             # Button component
│   ├── input.tsx              # Input component
│   ├── label.tsx              # Label component
│   ├── select.tsx             # Select component
│   ├── textarea.tsx           # Textarea component
│   ├── switch.tsx             # Switch component
│   ├── custom-select.tsx      # Custom select component
│   ├── ChatWidget.tsx         # HR chatbot widget
│   ├── glass-card.tsx         # Glass morphism card
│   └── stats-card.tsx         # Statistics card
├── dashboard/                  # Dashboard-specific components
│   ├── GlassCard.tsx          # Glass effect card
│   └── StatsCard.tsx          # Statistics display
├── layout/                     # Layout components
│   └── DashboardLayout.tsx    # Dashboard layout wrapper
├── AIHighlights.tsx           # AI features showcase
├── Features.tsx               # Features overview
├── Footer.tsx                 # Footer component
├── Hero.tsx                   # Hero section
├── JDModal.tsx                # Job description modal
├── Starfield.tsx              # Animated background
└── ui.tsx                     # UI component exports
```

#### Utilities (`src/lib/`)

```
src/lib/
├── firebase.ts                 # Firebase configuration
├── auth.tsx                   # Authentication context
├── api.ts                     # API client functions
├── firestoreApi.ts            # Firestore operations
└── utils.ts                   # Utility functions
```

#### Hooks (`src/hooks/`)

```
src/hooks/
├── useAuth.ts                 # Authentication hook
└── useFirestore.ts            # Firestore operations hook
```

### Key Frontend Files

#### Authentication (`src/lib/auth.tsx`)

```typescript
// Authentication context and provider
export type UserRole = 'admin' | 'hr' | 'manager' | 'employee' | 'candidate'

type AuthContextValue = {
  user: User | null
  role: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, role: UserRole, name?: string, department?: string) => Promise<void>
  logout: () => Promise<void>
}

export function AuthProvider({ children }: { children: React.ReactNode })
export const useAuth = () => useContext(AuthContext)
```

#### Firebase Configuration (`src/lib/firebase.ts`)

```typescript
// Firebase app initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

#### API Client (`src/lib/api.ts`)

```typescript
// API client with Firestore integration
export const Api = {
  // Admin functions
  getUsers: async () => fsGetUsers(),
  createUser: async (payload) => fsCreateUserWithAuth(payload),
  updateUser: async (id, payload) => fsUpdateUser(id, payload),
  deleteUser: async (id) => fsDeleteUser(id),
  
  // HR functions
  getJobs: async () => fsGetJobs(),
  createJob: async (payload) => fsCreateJob(payload),
  getCandidates: async () => fsGetCandidates(),
  
  // Manager functions
  getTeam: async () => getTeamData(),
  getPendingLeaves: async () => fsGetPendingLeaves(),
  decideLeave: async (id, decision) => fsDecideLeave(id, decision),
  
  // Employee functions
  getLeaves: async () => fsGetMyLeaves(),
  submitLeave: async (payload) => fsSubmitLeave(payload),
  saveProfile: async (payload) => fsSaveProfile(payload),
}
```

## Backend Structure

### Backend Directory Structure

```
backend/
├── app.py                      # Main FastAPI application
├── auth.py                     # Authentication utilities
├── chatbot_core.py             # HR chatbot service
├── data/                       # Static data files
│   ├── employees.json          # Employee data
│   └── policies.json           # Policy data
├── data_loader.py              # Data loading utilities
├── enhanced_resume_parser.py   # Resume parsing service
├── firebase_client.py          # Firebase admin SDK client
├── gemini_analyzer.py          # Gemini AI integration
├── gemini_skill_matcher.py     # Skill matching service
├── hrms_adapter.py             # HRMS data adapter
├── jd_llm_service.py           # Job description LLM service
├── jd_service.py               # Job description service
├── llm_handler.py              # LLM integration handler
├── onboarding_flow.py         # Onboarding flow manager
├── prompts.py                  # AI prompt templates
├── render-build.sh             # Railway build script
├── requirements.txt            # Python dependencies
├── resume_scorer.py            # Resume scoring service
├── resume_screening_service.py # Resume screening service
├── runtime.txt                 # Python runtime version
├── session_manager.py          # Chat session management
├── simplified_resume_parser.py # Simplified resume parser
└── skill_matcher.py            # Skill matching utilities
```

### Key Backend Files

#### Main Application (`backend/app.py`)

```python
# FastAPI application with all endpoints
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HRMS Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
session_manager = SessionManager()
chatbot = HRChatbot(session_manager=session_manager)
jds = JDService()
resume_screening_service = ResumeScreeningService()

# API endpoints
@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    result = await chatbot.process_query(
        user_id=payload.user_id, 
        query=payload.query, 
        session_id=payload.session_id
    )
    return ChatResponse(**result)

@app.post("/jd/generate", response_model=JDGenerateResponse)
async def generate_jd(payload: JDGenerateRequest) -> JDGenerateResponse:
    # Job description generation logic
    pass

@app.post("/resume/screen", response_model=ResumeScreeningResponse)
def screen_resume(request: ResumeScreeningRequest) -> ResumeScreeningResponse:
    return resume_screening_service.screen_resume(request)
```

#### HR Chatbot (`backend/chatbot_core.py`)

```python
# HR chatbot with intent classification
class IntentClassifier:
    def __init__(self):
        self.intent_patterns = {
            "leave_balance": [r"leave\s+balance", r"how\s+many\s+leaves?"],
            "policy_query": [r"policy", r"policies", r"rule"],
            "onboarding_help": [r"onboarding", r"new\s+hire"],
            "salary_benefits": [r"salary", r"compensation", r"benefits?"],
            "attendance": [r"attendance", r"check.in", r"check.out"],
            "performance": [r"performance", r"review"],
            "general_hr": [r"hr", r"human\s+resources"],
        }

class HRChatbot:
    def __init__(self, session_manager: SessionManager):
        self.session_manager = session_manager
        self.intent_classifier = IntentClassifier()
        self.llm_handler = LLMHandler()
        self.data_loader = DataLoader()
        self.hrms_adapter = HRMSAdapter(self.data_loader)
        self.prompt_template = PromptTemplate()
        self.onboarding_manager = OnboardingFlowManager()

    async def process_query(self, user_id: str, query: str, session_id: Optional[str] = None):
        # Process user query with AI
        pass
```

#### Resume Screening (`backend/resume_screening_service.py`)

```python
# AI-powered resume screening service
class ResumeScreeningService:
    def __init__(self):
        self.parser = EnhancedResumeParser()
        self.matcher = SkillMatcher(use_ai=False)
        self.scorer = ResumeScorer()
        
        # Initialize Gemini analyzer
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                self.gemini_analyzer = GeminiResumeAnalyzer()
            else:
                self.gemini_analyzer = None
        except Exception as e:
            self.gemini_analyzer = None
        
        self.firebase = FirebaseClient()

    def screen_resume(self, request: ResumeScreeningRequest) -> ResumeScreeningResponse:
        # Resume screening logic
        pass
```

#### Firebase Client (`backend/firebase_client.py`)

```python
# Firebase admin SDK client
class FirebaseClient:
    def __init__(self, service_account_path: Optional[str] = None, bucket_name: Optional[str] = None):
        self._initialized = False
        self.bucket_name = bucket_name or os.getenv("FIREBASE_STORAGE_BUCKET")
        self._init(service_account_path)

    def _init_from_env(self) -> bool:
        # Initialize Firebase using environment variables
        pass

    @property
    def bucket(self):
        return storage.bucket(self.bucket_name)

    @property
    def db(self):
        return firestore.client()

    def upload_bytes(self, data: bytes, path: str, content_type: str) -> str:
        # Upload file to Firebase Storage
        pass

    def save_metadata(self, collection: str, doc_id: str, data: Dict[str, Any]) -> None:
        # Save metadata to Firestore
        pass
```

## Configuration Files

### Package Configuration (`package.json`)

```json
{
  "name": "hrms-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-switch": "^1.2.6",
    "axios": "^1.7.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^10.14.1",
    "framer-motion": "^12.23.24",
    "jspdf": "^3.0.3",
    "lucide-react": "^0.546.0",
    "next": "15.5.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "recharts": "^3.3.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.20",
    "eslint": "^9",
    "eslint-config-next": "15.5.6",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5"
  }
}
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### TailwindCSS Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // FWC brand colors
        fwc: {
          blue: "#1e40af",
          orange: "#ea580c",
          green: "#16a34a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
}

export default config
```

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
}

export default nextConfig
```

## Coding Conventions

### TypeScript Conventions

1. **Type Definitions**
   ```typescript
   // Use interfaces for object shapes
   interface User {
     id: string;
     name: string;
     email: string;
     role: UserRole;
   }

   // Use types for unions and primitives
   type UserRole = 'admin' | 'hr' | 'manager' | 'employee' | 'candidate';
   type Status = 'pending' | 'approved' | 'rejected';
   ```

2. **Component Props**
   ```typescript
   // Define props interface
   interface ButtonProps {
     children: React.ReactNode;
     onClick?: () => void;
     variant?: 'primary' | 'secondary';
     disabled?: boolean;
   }

   // Use React.FC for functional components
   const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled = false }) => {
     return (
       <button 
         className={`btn btn-${variant}`}
         onClick={onClick}
         disabled={disabled}
       >
         {children}
       </button>
     );
   };
   ```

3. **API Response Types**
   ```typescript
   // Define API response types
   interface ApiResponse<T> {
     success: boolean;
     data: T;
     error?: string;
   }

   interface UserResponse extends ApiResponse<User> {}
   interface UsersResponse extends ApiResponse<User[]> {}
   ```

### React Conventions

1. **Component Structure**
   ```typescript
   // Use functional components with hooks
   const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
     const [isEditing, setIsEditing] = useState(false);
     const [formData, setFormData] = useState(user);

     const handleSave = async () => {
       try {
         await Api.updateUser(user.id, formData);
         setIsEditing(false);
       } catch (error) {
         console.error('Failed to update user:', error);
       }
     };

     return (
       <div className="user-profile">
         {/* Component JSX */}
       </div>
     );
   };
   ```

2. **Custom Hooks**
   ```typescript
   // Create custom hooks for reusable logic
   const useAuth = () => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (user) => {
         setUser(user);
         setLoading(false);
       });

       return unsubscribe;
     }, []);

     return { user, loading };
   };
   ```

3. **Error Handling**
   ```typescript
   // Use error boundaries and try-catch
   const handleApiCall = async () => {
     try {
       setLoading(true);
       const result = await Api.getUsers();
       setUsers(result);
     } catch (error) {
       console.error('API Error:', error);
       setError('Failed to fetch users');
     } finally {
       setLoading(false);
     }
   };
   ```

### Python Conventions

1. **Type Hints**
   ```python
   from typing import Dict, List, Optional, Any

   def process_user_data(user_id: str, data: Dict[str, Any]) -> Optional[User]:
       """Process user data with type hints."""
       pass

   class UserService:
       def __init__(self, db_client: FirebaseClient) -> None:
           self.db = db_client
   ```

2. **Error Handling**
   ```python
   import logging
   from fastapi import HTTPException

   logger = logging.getLogger(__name__)

   async def get_user(user_id: str) -> User:
       try:
           user_data = await db.collection('users').document(user_id).get()
           if not user_data.exists:
               raise HTTPException(status_code=404, detail="User not found")
           return User(**user_data.to_dict())
       except Exception as e:
           logger.error(f"Error fetching user {user_id}: {e}")
           raise HTTPException(status_code=500, detail="Internal server error")
   ```

3. **Async/Await**
   ```python
   async def process_resume(resume_data: bytes) -> Dict[str, Any]:
       """Process resume asynchronously."""
       try:
           # Parse resume
           parsed_data = await parser.parse_resume(resume_data)
           
           # AI analysis
           ai_analysis = await gemini_analyzer.analyze(parsed_data)
           
           # Calculate scores
           scores = await scorer.calculate_scores(parsed_data, ai_analysis)
           
           return {
               'parsed_data': parsed_data,
               'ai_analysis': ai_analysis,
               'scores': scores
           }
       except Exception as e:
           logger.error(f"Resume processing failed: {e}")
           raise
   ```

## File Naming Conventions

### Frontend Files

- **Components**: PascalCase (e.g., `UserProfile.tsx`, `DashboardLayout.tsx`)
- **Pages**: lowercase with hyphens (e.g., `page.tsx`, `user-profile.tsx`)
- **Utilities**: camelCase (e.g., `api.ts`, `firebase.ts`)
- **Types**: PascalCase (e.g., `User.ts`, `ApiResponse.ts`)

### Backend Files

- **Modules**: snake_case (e.g., `chatbot_core.py`, `resume_screening_service.py`)
- **Classes**: PascalCase (e.g., `UserService`, `ResumeScreeningService`)
- **Functions**: snake_case (e.g., `process_resume`, `generate_jd`)
- **Constants**: UPPER_CASE (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)

## Import/Export Conventions

### Frontend Imports

```typescript
// External libraries first
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

// Internal imports
import { useAuth } from '@/lib/auth';
import { Api } from '@/lib/api';
import { Button } from '@/components/ui/button';

// Type imports
import type { User, UserRole } from '@/types/User';
```

### Backend Imports

```python
# Standard library imports
import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime

# Third-party imports
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import firebase_admin
from firebase_admin import credentials, firestore

# Local imports
from chatbot_core import HRChatbot
from firebase_client import FirebaseClient
from llm_handler import LLMHandler
```

This code structure documentation provides a comprehensive overview of the FWC HRMS project organization and coding conventions.
