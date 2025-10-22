# 🚀 Setup Guide

This guide will walk you through setting up the FWC HRMS application locally for development and testing.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (comes with Node.js)
- **Python** 3.10 or higher
- **Git** (for cloning the repository)

### Required Accounts

- **Firebase Account** - [Create account](https://console.firebase.google.com/)
- **Google AI Studio** - [Get Gemini API key](https://aistudio.google.com/app/apikey)
- **VAPI Account** - [Sign up for voice AI](https://vapi.ai/) (for voice interviews)

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/hrms-frontend.git
cd hrms-frontend
```

## Step 2: Firebase Project Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `fwc-hrms` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

### 2.3 Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your region)
5. Click **Done**

### 2.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Enter app nickname: `fwc-hrms-web`
5. Click **Register app**
6. Copy the Firebase configuration object

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` with your Firebase configuration:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Backend Configuration
   NEXT_PUBLIC_BACKEND_BASE=http://localhost:8000
   NEXT_PUBLIC_BACKEND_API_BASE=http://localhost:8000
   ```

### 3.3 Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Step 4: Backend Setup

### 4.1 Navigate to Backend Directory

```bash
cd backend
```

### 4.2 Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 4.3 Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4.4 Backend Environment Configuration

1. Copy the backend environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   LLM_PROVIDER=gemini

   # Firebase Service Account Configuration
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project_id.iam.gserviceaccount.com
   FIREBASE_UNIVERSE_DOMAIN=googleapis.com
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   ```

### 4.5 Firebase Service Account Setup

1. In Firebase Console, go to **Project Settings**
2. Click **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file
5. Copy the values from the JSON file to your `.env` file

### 4.6 Start Backend Server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

## Step 5: API Keys Setup

### 5.1 Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the API key
5. Add it to your backend `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 5.2 VAPI API Key (Optional - for Voice Interviews)

1. Sign up at [VAPI](https://vapi.ai/)
2. Get your API key from the dashboard
3. Add it to your backend `.env` file:
   ```env
   VAPI_API_KEY=your_vapi_api_key_here
   ```

## Step 6: Data Seeding

### 6.1 Access the Seeding Tool

1. Start both frontend and backend servers
2. Open http://localhost:3000
3. Navigate to http://localhost:3000/tools/seed
4. Click **Start Seeding Process**

### 6.2 Verify Seeded Data

After seeding, you should have:
- 5 departments (Engineering, Sales, HR, Support, Finance)
- 50+ users across different roles
- 30+ job postings
- 40+ candidate profiles
- 50+ job applications
- Sample attendance, leave, and performance data

## Step 7: Test the Application

### 7.1 Create Test Users

1. Go to http://localhost:3000/auth/signup
2. Create accounts for each role:
   - Admin: `admin@test.com` / `Test@1234`
   - HR: `hr@test.com` / `Test@1234`
   - Manager: `manager@test.com` / `Test@1234`
   - Employee: `employee@test.com` / `Test@1234`
   - Candidate: `candidate@test.com` / `Test@1234`

### 7.2 Test AI Features

1. **Resume Screening**: HR Dashboard → Candidates → Upload resume
2. **JD Generation**: HR Dashboard → Jobs → Create New Job
3. **HR Chatbot**: Employee Dashboard → Chat widget (bottom-right)
4. **Voice Interview**: HR Dashboard → Interviews → Schedule AI Interview

## Troubleshooting

### Common Issues

#### 1. Firebase Connection Issues

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**:
- Verify your Firebase configuration in `.env.local`
- Ensure the API key is correct and not truncated
- Check that Firebase project is active

#### 2. Backend Connection Issues

**Error**: `Connection refused` or `ECONNREFUSED`

**Solution**:
- Ensure backend server is running on port 8000
- Check `NEXT_PUBLIC_BACKEND_BASE` in `.env.local`
- Verify no firewall is blocking the connection

#### 3. AI Features Not Working

**Error**: AI responses are generic or failing

**Solution**:
- Verify `GEMINI_API_KEY` is set in backend `.env`
- Check API key has proper permissions
- Ensure backend server is running

#### 4. Database Permission Issues

**Error**: `Firestore: Missing or insufficient permissions`

**Solution**:
- Check Firestore security rules
- Ensure authentication is working
- Verify user has proper role assignment

#### 5. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or use different port
npm run dev -- -p 3001
```

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use http://localhost:8000/docs for interactive API testing
3. **Firebase Console**: Monitor database changes in Firebase Console
4. **Browser DevTools**: Use Network tab to debug API calls
5. **Logs**: Check terminal output for both frontend and backend logs

### Performance Optimization

1. **Firebase Indexes**: Create composite indexes for complex queries
2. **Caching**: Implement client-side caching for frequently accessed data
3. **Lazy Loading**: Use dynamic imports for large components
4. **Bundle Analysis**: Run `npm run build` to analyze bundle size

## Next Steps

After successful setup:

1. **Read the [User Guide](USER_GUIDE.md)** to understand workflows
2. **Explore [AI Features](AI_FEATURES.md)** to test all AI capabilities
3. **Check [Testing Guide](TESTING.md)** for comprehensive testing scenarios
4. **Review [Deployment Guide](DEPLOYMENT.md)** for production deployment

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Firebase Console for database issues
3. Check backend logs for API errors
4. Verify all environment variables are set correctly

For additional help, refer to the project documentation or contact the development team.
