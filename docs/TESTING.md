# 🧪 Testing Guide

This guide provides comprehensive testing scenarios for the FWC HRMS application, including test accounts, role-based testing, and feature validation.

## Test Accounts

Use these pre-configured accounts to test all features:

| Role | Email | Password | Dashboard URL |
|------|-------|----------|---------------|
| **Admin** | `admin@test.com` | `Test@1234` | `/dashboard/admin` |
| **HR** | `hr@test.com` | `Test@1234` | `/dashboard/hr` |
| **Manager** | `manager@test.com` | `Test@1234` | `/dashboard/manager` |
| **Employee** | `employee@test.com` | `Test@1234` | `/dashboard/employee` |
| **Candidate** | `candidate@test.com` | `Test@1234` | `/dashboard/candidate` |

> 💡 **Quick Access**: Click on any dashboard URL above to go directly to that role's interface.

## Role-Based Testing Scenarios

### 🔧 Admin Testing

**Purpose**: Test system administration and user management features.

#### Test Scenarios

1. **User Management**
   - Navigate to Admin Dashboard → Users
   - ✅ Verify user list displays all roles
   - ✅ Test user creation (Create new HR, Manager, Employee)
   - ✅ Test user editing (Update name, department, role)
   - ✅ Test user deletion
   - ✅ Verify role-based filtering works

2. **Department Management**
   - Navigate to Admin Dashboard → Departments
   - ✅ Verify 5 departments are displayed
   - ✅ Test creating new department
   - ✅ Test editing department (name, head)
   - ✅ Test deleting department
   - ✅ Verify employee count updates automatically

3. **System Analytics**
   - Navigate to Admin Dashboard → Analytics
   - ✅ Verify dashboard shows key metrics
   - ✅ Check user distribution charts
   - ✅ Verify department statistics
   - ✅ Test date range filtering

4. **AI Monitoring**
   - Navigate to Admin Dashboard → AI Monitor
   - ✅ Verify AI service status
   - ✅ Check usage statistics
   - ✅ Monitor performance metrics

#### Expected Results
- All CRUD operations work smoothly
- Data updates reflect immediately
- Charts and analytics display correctly
- No permission errors

---

### 👥 HR Testing

**Purpose**: Test recruitment and candidate management features.

#### Test Scenarios

1. **Job Management**
   - Navigate to HR Dashboard → Jobs
   - ✅ Verify job listings display
   - ✅ Test creating new job with AI JD generator
   - ✅ Test editing job details
   - ✅ Test closing job postings
   - ✅ Verify job status updates

2. **AI Job Description Generation**
   - Navigate to HR Dashboard → Jobs → Create New Job
   - ✅ Fill in job details (role, skills, experience)
   - ✅ Click "Generate with AI" button
   - ✅ Verify AI generates comprehensive JD
   - ✅ Test PDF export functionality
   - ✅ Verify JD is saved to database

3. **Candidate Management**
   - Navigate to HR Dashboard → Candidates
   - ✅ Verify candidate list displays
   - ✅ Test candidate status updates
   - ✅ Test candidate filtering and search
   - ✅ Verify candidate details view

4. **AI Resume Screening**
   - Navigate to HR Dashboard → Candidates
   - ✅ Upload a test resume (PDF format)
   - ✅ Select job to match against
   - ✅ Click "Screen Resume" button
   - ✅ Verify AI analysis results
   - ✅ Check scoring breakdown
   - ✅ Test bulk resume screening

5. **Interview Scheduling**
   - Navigate to HR Dashboard → Interviews
   - ✅ Test scheduling new interview
   - ✅ Test AI voice interview token generation
   - ✅ Verify interview calendar
   - ✅ Test interview status updates

#### Expected Results
- AI features work correctly
- Resume screening provides accurate scores
- JD generation creates professional content
- Interview scheduling functions properly

---

### 👨‍💼 Manager Testing

**Purpose**: Test team management and approval workflows.

#### Test Scenarios

1. **Team Management**
   - Navigate to Manager Dashboard → Team
   - ✅ Verify team member list
   - ✅ Test team member details view
   - ✅ Verify team performance metrics

2. **Leave Management**
   - Navigate to Manager Dashboard → Leave Requests
   - ✅ Verify pending leave requests
   - ✅ Test approving leave requests
   - ✅ Test rejecting leave requests
   - ✅ Verify leave history

3. **Performance Management**
   - Navigate to Manager Dashboard → Performance
   - ✅ Verify team performance overview
   - ✅ Test submitting performance reviews
   - ✅ Test feedback submission
   - ✅ Verify performance trends

4. **Attendance Tracking**
   - Navigate to Manager Dashboard → Attendance
   - ✅ Verify team attendance overview
   - ✅ Test attendance filtering by date
   - ✅ Verify attendance statistics

#### Expected Results
- All approval workflows function correctly
- Performance data displays accurately
- Attendance tracking works properly
- Team management features are accessible

---

### 👤 Employee Testing

**Purpose**: Test employee self-service features and chatbot.

#### Test Scenarios

1. **Profile Management**
   - Navigate to Employee Dashboard → Profile
   - ✅ Verify personal information display
   - ✅ Test updating profile information
   - ✅ Test skills and experience updates
   - ✅ Verify profile changes save correctly

2. **Leave Management**
   - Navigate to Employee Dashboard → Leave
   - ✅ Verify leave balance display
   - ✅ Test submitting leave request
   - ✅ Test leave history view
   - ✅ Verify leave status tracking

3. **Attendance Tracking**
   - Navigate to Employee Dashboard → Attendance
   - ✅ Verify attendance records
   - ✅ Test attendance calendar view
   - ✅ Verify attendance statistics

4. **Payroll Information**
   - Navigate to Employee Dashboard → Payroll
   - ✅ Verify payroll information display
   - ✅ Test payroll history
   - ✅ Verify salary details

5. **HR Chatbot**
   - Look for chat widget (bottom-right corner)
   - ✅ Test general HR queries
   - ✅ Test leave balance queries
   - ✅ Test policy questions
   - ✅ Test onboarding assistance
   - ✅ Verify chatbot responses are relevant

#### Expected Results
- All self-service features work correctly
- Chatbot provides helpful responses
- Data displays accurately
- Forms submit successfully

---

### 🎯 Candidate Testing

**Purpose**: Test candidate application and interview features.

#### Test Scenarios

1. **Job Applications**
   - Navigate to Candidate Dashboard → Jobs
   - ✅ Verify available job listings
   - ✅ Test job application process
   - ✅ Test application status tracking
   - ✅ Verify application history

2. **Profile Management**
   - Navigate to Candidate Dashboard → Profile
   - ✅ Verify candidate profile display
   - ✅ Test updating profile information
   - ✅ Test skills and experience updates

3. **Interview Management**
   - Navigate to Candidate Dashboard → Interviews
   - ✅ Verify scheduled interviews
   - ✅ Test interview preparation
   - ✅ Verify interview details

4. **AI Voice Interview**
   - Navigate to Candidate Dashboard → Interview
   - ✅ Test AI voice interview access
   - ✅ Verify interview token works
   - ✅ Test interview completion
   - ✅ Verify results tracking

#### Expected Results
- Application process works smoothly
- Interview features function correctly
- AI voice interview is accessible
- Profile management works properly

---

## AI Features Testing

### 🤖 AI Resume Screening

#### Single Resume Testing

1. **Upload Resume**
   - Go to HR Dashboard → Candidates
   - Click "Upload Resume" button
   - Select a PDF resume file
   - Fill in candidate details
   - Select job to match against

2. **Verify AI Analysis**
   - ✅ Resume parsing works correctly
   - ✅ Skills extraction is accurate
   - ✅ Experience calculation is correct
   - ✅ Education assessment is proper
   - ✅ Overall score is reasonable (0-100)

3. **Check Detailed Results**
   - ✅ Component scores breakdown
   - ✅ Skill matching analysis
   - ✅ Keyword analysis
   - ✅ Strengths and weaknesses
   - ✅ Hiring recommendation

#### Bulk Resume Testing

1. **Upload Multiple Resumes**
   - Select multiple PDF files
   - Choose job for matching
   - Start bulk screening process

2. **Verify Batch Processing**
   - ✅ All resumes process successfully
   - ✅ Comparative analysis works
   - ✅ Ranking is accurate
   - ✅ Results export properly

### 📝 AI Job Description Generation

#### Testing Steps

1. **Create Job Description**
   - Go to HR Dashboard → Jobs → Create New Job
   - Fill in basic job details
   - Click "Generate with AI"

2. **Verify Generation Quality**
   - ✅ JD structure is professional
   - ✅ Content is relevant to role
   - ✅ Skills and requirements are appropriate
   - ✅ Responsibilities are comprehensive
   - ✅ Benefits section is included

3. **Test Customization**
   - ✅ Modify generated content
   - ✅ Add custom requirements
   - ✅ Test different job types
   - ✅ Verify PDF export

### 💬 Employee HR Chatbot

#### Testing Scenarios

1. **General Queries**
   - Ask: "What are the company policies?"
   - Ask: "How do I apply for leave?"
   - Ask: "What are the office hours?"

2. **Personal Queries**
   - Ask: "What is my leave balance?"
   - Ask: "When is my next performance review?"
   - Ask: "How do I update my profile?"

3. **Onboarding Queries**
   - Ask: "I'm a new employee, what should I do?"
   - Ask: "How do I set up my account?"
   - Ask: "What is the onboarding process?"

#### Expected Responses
- ✅ Responses are relevant and helpful
- ✅ Personal data is accurate
- ✅ Intent classification works correctly
- ✅ Session management functions properly

### 🎤 AI Voice Interview Bot

#### Testing Steps

1. **HR Token Generation**
   - Go to HR Dashboard → Interviews
   - Click "Schedule AI Interview"
   - Generate interview token
   - Send token to candidate

2. **Candidate Interview**
   - Use candidate account
   - Navigate to interview section
   - Enter interview token
   - Complete voice interview

3. **Verify Results**
   - ✅ Interview completes successfully
   - ✅ Results are recorded
   - ✅ Assessment is generated
   - ✅ HR can view results

---

## Feature Testing Checklist

### ✅ Core HRMS Features

- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] User management (CRUD operations)
- [ ] Department management
- [ ] Job posting and management
- [ ] Candidate management
- [ ] Application tracking
- [ ] Interview scheduling
- [ ] Employee profiles
- [ ] Attendance tracking
- [ ] Leave management
- [ ] Performance reviews
- [ ] Feedback system

### ✅ AI Features

- [ ] Resume screening (single)
- [ ] Resume screening (bulk)
- [ ] Job description generation
- [ ] HR chatbot functionality
- [ ] Voice interview bot
- [ ] AI scoring accuracy
- [ ] AI response quality

### ✅ UI/UX Features

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Navigation works correctly
- [ ] Forms submit properly
- [ ] Data displays correctly
- [ ] Loading states work
- [ ] Error handling is proper
- [ ] Accessibility features

### ✅ Performance Features

- [ ] Page load times are acceptable
- [ ] API responses are fast
- [ ] Real-time updates work
- [ ] Large datasets handle properly
- [ ] Concurrent users supported

---

## Browser Compatibility Testing

### Supported Browsers

- ✅ **Chrome** 90+ (Recommended)
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

### Mobile Testing

- ✅ **iOS Safari** 14+
- ✅ **Chrome Mobile** 90+
- ✅ **Samsung Internet** 13+

### Test Scenarios

1. **Desktop Testing**
   - Test all features on desktop browsers
   - Verify responsive design works
   - Check keyboard navigation

2. **Mobile Testing**
   - Test touch interactions
   - Verify mobile-specific features
   - Check portrait/landscape modes

3. **Tablet Testing**
   - Test medium screen sizes
   - Verify touch and mouse interactions
   - Check orientation changes

---

## Performance Testing

### Load Testing

1. **Concurrent Users**
   - Test with 10+ simultaneous users
   - Verify system stability
   - Check response times

2. **Large Datasets**
   - Test with 1000+ records
   - Verify pagination works
   - Check search performance

3. **API Performance**
   - Test API response times
   - Verify rate limiting works
   - Check error handling

### Stress Testing

1. **AI Service Load**
   - Test multiple AI requests
   - Verify service stability
   - Check fallback mechanisms

2. **Database Performance**
   - Test complex queries
   - Verify indexing works
   - Check connection pooling

---

## Security Testing

### Authentication Testing

- [ ] Login/logout works correctly
- [ ] Session management is secure
- [ ] Role-based access is enforced
- [ ] Unauthorized access is blocked

### Data Security Testing

- [ ] User data is protected
- [ ] API endpoints are secured
- [ ] File uploads are validated
- [ ] SQL injection is prevented

### Privacy Testing

- [ ] Personal data is handled properly
- [ ] Data retention policies are followed
- [ ] User consent is obtained
- [ ] Data export/deletion works

---

## Bug Reporting

### When Reporting Bugs

Include the following information:

1. **Environment Details**
   - Browser and version
   - Operating system
   - Device type (desktop/mobile)

2. **Steps to Reproduce**
   - Detailed step-by-step instructions
   - Expected vs actual behavior
   - Screenshots or videos if helpful

3. **Error Information**
   - Error messages
   - Console logs
   - Network request details

4. **User Context**
   - User role
   - Test account used
   - Data state when error occurred

### Bug Severity Levels

- **Critical**: System crashes, data loss, security vulnerabilities
- **High**: Major features not working, significant UI issues
- **Medium**: Minor features not working, cosmetic issues
- **Low**: Enhancement requests, minor improvements

---

## Test Data Management

### Using Seeded Data

The application includes comprehensive test data:
- 50+ users across all roles
- 30+ job postings
- 40+ candidate profiles
- 50+ job applications
- 1000+ attendance records
- 30+ leave requests
- 40+ performance reviews

### Creating Custom Test Data

1. **Manual Creation**
   - Use admin interface to create users
   - Use HR interface to create jobs
   - Use forms to create applications

2. **API Creation**
   - Use API endpoints to create data
   - Use scripts for bulk data creation
   - Use Firebase console for direct data entry

### Data Cleanup

- **Reset Data**: Re-run seeding tool to reset data
- **Selective Cleanup**: Delete specific records manually
- **Export Data**: Export important test data before cleanup

This comprehensive testing guide ensures thorough validation of all FWC HRMS features and AI capabilities.
