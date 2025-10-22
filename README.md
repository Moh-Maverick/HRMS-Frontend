# 🚀 FWC HRMS - AI-Powered Human Resource Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.14-orange?style=for-the-badge&logo=firebase)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-yellow?style=for-the-badge&logo=python)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?style=for-the-badge&logo=tailwindcss)

**🏆 FWC Hackathon 2025 - AI/ML with Fullstack Challenge**  
**Theme**: Build the Future of HR Management with AI-Powered Solutions

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-00C7B7?style=for-the-badge)](https://hrms-skm.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-0A0E27?style=for-the-badge)](https://hrms-backend-lv6f.onrender.com/)

</div>

---

## 🎯 Project Overview

FWC HRMS is a next-generation Human Resource Management System that leverages cutting-edge AI technology to streamline and automate HR operations for modern workplaces. Built for the FWC Hackathon 2025, this system demonstrates the power of AI in transforming traditional HR processes.

### 🌟 Key Highlights

- **🤖 4 AI-Powered Features** - Resume Screening, JD Generation, HR Chatbot, Voice Interviews
- **👥 Multi-Role System** - 5 distinct user roles with tailored dashboards
- **📈 Enterprise Scale** - Supports 5000+ employee logins with real-time processing
- **⚡ Modern Stack** - Next.js 15, TypeScript, Firebase, FastAPI, Google Gemini AI
- **📱 Responsive Design** - Mobile-optimized UI/UX with TailwindCSS
- **🚀 Production Ready** - Deployed on Vercel + Railway

---

## 🔐 Testing Accounts

**Recruiters can test all features using these pre-configured accounts:**

| Role | Email | Password | Dashboard Access |
|------|-------|----------|------------------|
| **Admin** | `admin@test.com` | `Test@1234` | [Admin Dashboard](https://hrms-skm.vercel.app/dashboard/admin) |
| **HR** | `hr@test.com` | `Test@1234` | [HR Dashboard](https://hrms-skm.vercel.app/dashboard/hr) |
| **Manager** | `manager@test.com` | `Test@1234` | [Manager Dashboard](https://hrms-skm.vercel.app/dashboard/manager) |
| **Employee** | `employee@test.com` | `Test@1234` | [Employee Dashboard](https://hrms-skm.vercel.app/dashboard/employee) |
| **Candidate** | `candidate@test.com` | `Test@1234` | [Candidate Dashboard](https://hrms-skm.vercel.app/dashboard/candidate) |

**For ai-interview bot use the below credentials to use:**
| Role | Email | Password | Dashboard Access |
|------|-------|----------|------------------|
|**HR** | `test@gmail.com` | `test1234` | [HR Login](https://ai-interview-bot-seven.vercel.app/sign-in) |
|**Admin** | `admin@interviewai.com` | `admin123456` | [Admin Login](https://ai-interview-bot-seven.vercel.app/admin/login) |

> **Candidate Login**:For candidate login, when hr creates an interview a session id generated and is sent to given email id of the candidate id, for logging in use email and session id and logout from the hr account if signup page for candidate is not accessible.
> 💡 **Quick Test**: Login with any account above to explore role-specific features and AI capabilities.

---

## 🤖 AI Features Showcase

### 1. 📄 AI Resume Screening
- **Technology**: Google Gemini 2.0 Flash
- **Features**: 
  - Single resume analysis with detailed scoring
  - Bulk resume screening for multiple candidates
  - Skill matching, experience evaluation, education assessment
  - AI-powered hiring recommendations
- **Location**: HR Dashboard → Candidates → Resume Screening

### 2. 📝 AI Job Description Generator
- **Technology**: Google Gemini 2.5 Flash
- **Features**:
  - Automatic JD generation from minimal inputs
  - Structured output with responsibilities, skills, qualifications
  - PDF export functionality
  - Customizable templates
- **Location**: HR Dashboard → Jobs → Create New Job

### 3. 💬 Employee HR Chatbot
- **Technology**: Google Gemini + FastAPI
- **Features**:
  - 24/7 HR assistance for employees
  - Intent classification for leave, policies, benefits queries
  - Personalized responses based on employee data
  - Session management and conversation history
- **Location**: Employee Dashboard → Chat Widget (bottom-right)

### 4. 🎤 AI Voice Interview Bot
- **Technology**: VAPI (Voice AI Platform)
- **Features**:
  - Automated voice interviews for candidates
  - Token-based access system
  - Real-time interview assessment
  - Results tracking and analytics
  - Email session codes - Receive unique session codes via email after interview creation
- **Location**: HR Dashboard → Interviews → Schedule AI Interview

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Firebase SDK** - Authentication and Firestore

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.10+** - Core backend language
- **Firebase Admin SDK** - Server-side Firebase integration
- **Google Gemini AI** - LLM for AI features
- **VAPI** - Voice AI platform integration

### Database & Storage
- **Firebase Firestore** - NoSQL document database
- **Firebase Authentication** - User management
- **Firebase Storage** - File storage (resumes, documents)

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Firebase** - Database and authentication

---

## 🚀 Quick Start

### For Recruiters/Evaluators
**Ready to test?** Use the [Testing Accounts](#-testing-accounts) above to explore all features immediately!

### For Developers

#### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Firebase account
- Google Gemini API key
- Vapi workflow id and web token
- Gmail: user mail and app password for sending candidates session id through mail

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hrms-frontend.git
   cd hrms-frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Firebase and API keys
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   uvicorn app:app --reload
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## 📊 Hackathon Compliance

✅ **Core HRMS Functionalities** - Employee management, attendance, payroll, performance tracking  
✅ **AI-Driven Resume Screening** - Automated evaluation without human intervention  
✅ **AI-Powered Conversation Models** - Voice interaction for recruitment  
✅ **Multi-Role Login System** - Admin, Manager, HR, Employee, Candidate  
✅ **Personalized Dashboards** - Role-specific activity dashboards  
✅ **Scalability** - Supports 5000+ employee logins  
✅ **Responsive Design** - Mobile-optimized UI/UX  
✅ **4+ AI Features** - Resume screening, JD generation, chatbot, voice interviews  

---

## 👥 Team

| Member | Role | Contributions |
|--------|------|---------------|
| **Mohit R** | Full-Stack Developer | Frontend development, UI/UX design, Firebase integration |
| **Shreyas L** | Backend Developer + AI/ML services | [AI Voice Interview Bot](https://github.com/Shreyas-077/AIinterviewBot), [Resume screening algorithms](https://github.com/Shreyas-077/HR-resume_screening), FastAPI backend services |
| **N V Karan** | AI/ML Engineer | [HR Chatbot development](https://github.com/nvkaran17/AI-powered-HR-Chatbot.git), [AI Job Description generation](https://github.com/nvkaran17/AI-Job-Description-Generator), Backend Integration |

---

## 📚 Documentation

- [📖 Complete Setup Guide](docs/SETUP.md)
- [🏗️ System Architecture](docs/ARCHITECTURE.md)
- [🗄️ Database Schema](docs/DATABASE_SCHEMA.md)
- [🔧 API Documentation](docs/API_DOCUMENTATION.md)
- [🧪 Testing Guide](docs/TESTING.md)
- [🚀 Deployment Guide](docs/DEPLOYMENT.md)
- [👤 User Guide](docs/USER_GUIDE.md)
- [🤖 AI Features Documentation](docs/AI_FEATURES.md)

---

## 🎥 Demo & Screenshots

> 📸 **Screenshots coming soon** - Will showcase all dashboards and AI features

---

## 📞 Contact

**Development Team**  
- **Mohit R**: mohit.radkrishnan@gmail.com - +91 9019776340
- **N V Karan**: nvkaran33@gmail.com - +91 8310676596  
- **Shreyas L**: shreyas4144@gmail.com - +91 8971246596

---

<div align="center">

**Built with ❤️ for FWC Hackathon 2025**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Moh-Maverick/HRMS-Frontend)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>
