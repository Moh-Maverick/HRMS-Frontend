# 🚀 Deployment Guide

This guide covers deploying the FWC HRMS application to production using Vercel (frontend) and Render (backend).

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Render        │    │   Firebase      │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│                 │    │                 │    │                 │
│ • Next.js App   │◄──►│ • FastAPI      │◄──►│ • Firestore     │
│ • Static Assets │    │ • Python        │    │ • Auth          │
│ • CDN           │    │ • Auto-scaling  │    │ • Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Required Accounts

- **Vercel Account** - [Sign up](https://vercel.com/signup)
- **Render Account** - [Sign up](https://render.com/signup)
- **Firebase Account** - [Console](https://console.firebase.google.com/)
- **GitHub Account** - For repository hosting

### Required API Keys

- **Google Gemini API** - [Get key](https://aistudio.google.com/app/apikey)
- **VAPI API** - [Get key](https://vapi.ai/) (for voice interviews)

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify Build Locally**
   ```bash
   npm run build
   npm run start
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `hrms-frontend` folder

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `hrms-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add these environment variables in Vercel dashboard:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Backend Configuration
   NEXT_PUBLIC_BACKEND_BASE=https://your-railway-app.railway.app
   NEXT_PUBLIC_BACKEND_API_BASE=https://your-railway-app.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note the deployment URL

### Step 3: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Vercel automatically provides SSL
   - Certificate will be issued automatically

---

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `backend`

2. **Configure Render Service**
   - **Name**: `hrms-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Step 2: Environment Variables

Add these environment variables in Render dashboard:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
LLM_PROVIDER=gemini

# VAPI Configuration (Optional)
VAPI_API_KEY=your_vapi_api_key_here

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

### Step 3: Deploy

1. **Deploy to Render**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait for deployment to complete

2. **Get Deployment URL**
   - Your backend will be available at: `https://hrms-backend-lv6f.onrender.com`
   - Render provides SSL automatically

### Step 4: Configure Health Check

Render will automatically create a health check endpoint at `/health`.

---

## Firebase Production Configuration

### Step 1: Update Firebase Settings

1. **Add Production Domain**
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel domain to authorized domains
   - Add your Render domain to authorized domains

2. **Update Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Production security rules
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       match /jobs/{jobId} {
         allow read: if true;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'hr'];
       }
       
       // Add more rules as needed
     }
   }
   ```

### Step 2: Configure Storage

1. **Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

## Post-Deployment Verification

### Step 1: Test Frontend

1. **Basic Functionality**
   - Visit your Vercel URL
   - Test login/logout
   - Verify all pages load correctly
   - Test responsive design

2. **API Integration**
   - Test chatbot functionality
   - Test resume screening
   - Test JD generation
   - Verify error handling

### Step 2: Test Backend

1. **Health Check**
   ```bash
   curl https://hrms-backend-lv6f.onrender.com/health
   ```

2. **API Documentation**
   - Visit `https://hrms-backend-lv6f.onrender.com/docs`
   - Test API endpoints
   - Verify authentication

### Step 3: Test AI Features

1. **Resume Screening**
   - Upload test resume
   - Verify AI analysis works
   - Check scoring accuracy

2. **JD Generation**
   - Create new job posting
   - Test AI generation
   - Verify PDF export

3. **Chatbot**
   - Test various queries
   - Verify responses are relevant
   - Check session management

4. **Voice Interview**
   - Generate interview token
   - Test voice interview flow
   - Verify results recording

---

## Monitoring and Logs

### Vercel Monitoring

1. **Analytics**
   - Go to Vercel Dashboard → Analytics
   - Monitor page views and performance
   - Check Core Web Vitals

2. **Logs**
   - Go to Vercel Dashboard → Functions
   - View function logs
   - Monitor errors and performance

### Render Monitoring

1. **Metrics**
   - Go to Render Dashboard → Service Metrics
   - Monitor CPU, memory, and network usage
   - Check response times

2. **Logs**
   - Go to Render Dashboard → Logs
   - View application logs
   - Monitor errors and warnings

### Firebase Monitoring

1. **Performance**
   - Go to Firebase Console → Performance
   - Monitor app performance
   - Check crash reports

2. **Analytics**
   - Go to Firebase Console → Analytics
   - Monitor user engagement
   - Track custom events

---

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

**Vercel Build Errors**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install --legacy-peer-deps
# Or update package.json dependencies
```

**Render Build Errors**
```bash
# Check Render logs
# Common fixes:
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

#### 2. Environment Variable Issues

**Missing Variables**
- Verify all required environment variables are set
- Check variable names match exactly
- Ensure no extra spaces or quotes

**Firebase Configuration**
- Verify Firebase project ID is correct
- Check service account permissions
- Ensure Firebase rules allow access

#### 3. API Connection Issues

**CORS Errors**
- Verify backend CORS settings
- Check frontend API base URL
- Ensure domains are authorized

**Authentication Errors**
- Verify Firebase configuration
- Check API key validity
- Ensure proper token handling

#### 4. AI Service Issues

**Gemini API Errors**
- Verify API key is valid
- Check API quota limits
- Ensure proper error handling

**VAPI Integration**
- Verify VAPI API key
- Check webhook configuration
- Ensure proper token generation

### Debugging Steps

1. **Check Logs**
   - Vercel function logs
   - Railway application logs
   - Firebase console logs

2. **Test Locally**
   - Reproduce issues locally
   - Check environment variables
   - Verify API connections

3. **Network Debugging**
   - Use browser dev tools
   - Check network requests
   - Verify API responses

---

## Performance Optimization

### Frontend Optimization

1. **Build Optimization**
   ```bash
   # Enable compression
   npm install --save-dev compression
   
   # Optimize images
   npm install --save-dev @next/bundle-analyzer
   ```

2. **Caching Strategy**
   - Enable Vercel edge caching
   - Configure CDN settings
   - Optimize static assets

### Backend Optimization

1. **Connection Pooling**
   - Configure Firebase connection limits
   - Implement request caching
   - Optimize database queries

2. **AI Service Optimization**
   - Implement response caching
   - Use connection pooling
   - Monitor API usage

---

## Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit secrets to repository
   - Use secure environment variable storage
   - Rotate API keys regularly

2. **Firebase Security**
   - Implement proper Firestore rules
   - Use Firebase App Check
   - Enable security monitoring

3. **API Security**
   - Implement rate limiting
   - Use proper authentication
   - Monitor for suspicious activity

### Data Protection

1. **User Data**
   - Implement data encryption
   - Follow privacy regulations
   - Enable audit logging

2. **File Uploads**
   - Validate file types
   - Scan for malware
   - Implement size limits

---

## Rollback Procedures

### Vercel Rollback

1. **Previous Deployment**
   - Go to Vercel Dashboard → Deployments
   - Click on previous deployment
   - Click "Promote to Production"

2. **Git Rollback**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### Railway Rollback

1. **Previous Deployment**
   - Go to Railway Dashboard → Deployments
   - Click on previous deployment
   - Click "Redeploy"

2. **Code Rollback**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

---

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check application logs
   - Monitor performance metrics
   - Review error rates

2. **Monthly**
   - Update dependencies
   - Review security settings
   - Backup important data

3. **Quarterly**
   - Performance audit
   - Security review
   - Feature updates

### Updates and Patches

1. **Dependency Updates**
   ```bash
   # Frontend
   npm update
   npm audit fix
   
   # Backend
   pip install --upgrade -r requirements.txt
   ```

2. **Security Patches**
   - Monitor security advisories
   - Apply patches promptly
   - Test thoroughly before deployment

This deployment guide ensures a smooth transition from development to production with proper monitoring and maintenance procedures.
