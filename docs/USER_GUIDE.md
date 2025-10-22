# 👤 User Guide

This comprehensive guide covers workflows for all user roles in the FWC HRMS application.

## User Roles Overview

| Role | Access Level | Primary Functions |
|------|-------------|-------------------|
| **Admin** | Full System | User management, system configuration, analytics |
| **HR** | Recruitment | Job posting, candidate screening, interview scheduling |
| **Manager** | Team Management | Team oversight, leave approvals, performance reviews |
| **Employee** | Self-Service | Profile management, leave requests, chatbot assistance |
| **Candidate** | Application | Job applications, interview participation |

---

## 🔧 Admin Workflows

### User Management

#### Creating New Users

1. **Navigate to User Management**
   - Go to Admin Dashboard
   - Click "Users" in the sidebar
   - Click "Add New User" button

2. **Fill User Details**
   ```
   Name: John Doe
   Email: john.doe@fwc.co.in
   Password: TempPassword123
   Role: [Select from dropdown]
   Department: [Select from dropdown]
   ```

3. **Role Assignment**
   - **HR**: Can manage recruitment and candidates
   - **Manager**: Can manage team and approve leaves
   - **Employee**: Can access self-service features
   - **Candidate**: Can apply for jobs and attend interviews

4. **Save and Notify**
   - Click "Create User"
   - System sends welcome email with login credentials
   - User appears in the users list

#### Managing Existing Users

1. **View User List**
   - See all users with their roles and departments
   - Use filters to find specific users
   - Search by name, email, or department

2. **Edit User Information**
   - Click on any user row
   - Update name, email, role, or department
   - Click "Save Changes"

3. **Deactivate Users**
   - Click "Deactivate" button
   - User loses access but data is preserved
   - Can be reactivated later

### Department Management

#### Creating Departments

1. **Navigate to Departments**
   - Go to Admin Dashboard
   - Click "Departments" in the sidebar
   - Click "Add Department" button

2. **Department Details**
   ```
   Department Name: Marketing
   Department Head: Jane Smith
   Description: Handles marketing and communications
   ```

3. **Save Department**
   - Click "Create Department"
   - Department appears in the list
   - Employee count starts at 0

#### Managing Departments

1. **View Department List**
   - See all departments with employee counts
   - View department heads
   - Check department status

2. **Edit Department**
   - Click on department name
   - Update name or department head
   - Click "Save Changes"

3. **Assign Users to Department**
   - Go to Users section
   - Select users to move
   - Change their department
   - Employee count updates automatically

### System Analytics

#### Dashboard Overview

1. **Key Metrics**
   - Total users by role
   - Department distribution
   - Active vs inactive users
   - Recent activity

2. **Charts and Graphs**
   - User growth over time
   - Department size comparison
   - Role distribution pie chart
   - Activity trends

3. **Recent Activity**
   - New user registrations
   - Department changes
   - System events
   - Error logs

#### AI Monitoring

1. **AI Service Status**
   - Resume screening usage
   - JD generation requests
   - Chatbot interactions
   - Voice interview sessions

2. **Performance Metrics**
   - Response times
   - Success rates
   - Error rates
   - Usage statistics

---

## 👥 HR Workflows

### Job Management

#### Creating Job Postings

1. **Navigate to Jobs**
   - Go to HR Dashboard
   - Click "Jobs" in the sidebar
   - Click "Create New Job" button

2. **Basic Job Information**
   ```
   Job Title: Senior Frontend Developer
   Department: Engineering
   Number of Openings: 2
   Employment Type: Full-time
   Location: Mumbai, India
   ```

3. **AI Job Description Generation**
   - Click "Generate with AI" button
   - Fill in additional details:
     ```
     Required Skills: React, TypeScript, Next.js
     Experience Level: 3-5 years
     Responsibilities: [Add specific responsibilities]
     Company: FWC IT Services
     ```
   - Click "Generate JD"
   - Review and edit generated content
   - Click "Save Job"

4. **Manual Job Description**
   - Alternatively, write job description manually
   - Include responsibilities, requirements, benefits
   - Save the job posting

#### Managing Job Postings

1. **View Job List**
   - See all active job postings
   - Check application counts
   - View job status

2. **Edit Job Details**
   - Click on job title
   - Update any information
   - Save changes

3. **Close Job Postings**
   - Click "Close Job" button
   - Job status changes to "Closed"
   - No new applications accepted

### Candidate Management

#### Resume Screening

1. **Single Resume Screening**
   - Go to HR Dashboard → Candidates
   - Click "Upload Resume" button
   - Select PDF file
   - Fill candidate details:
     ```
     Candidate Name: Rahul Sharma
     Email: rahul.sharma@email.com
     Phone: +91 9876543210
     ```
   - Select job to match against
   - Click "Screen Resume"
   - Review AI analysis results

2. **Bulk Resume Screening**
   - Click "Bulk Upload" button
   - Select multiple PDF files
   - Choose job for matching
   - Click "Start Bulk Screening"
   - Monitor progress
   - Review comparative results

#### Candidate Evaluation

1. **Review Screening Results**
   - See AI scores and analysis
   - Check skill matching
   - Review strengths and weaknesses
   - Read hiring recommendations

2. **Update Candidate Status**
   - Select candidate
   - Change status:
     - **Screening**: Initial review
     - **Interview**: Schedule interview
     - **Offer**: Make job offer
     - **Rejected**: Not selected

3. **Add Notes**
   - Click "Add Notes" button
   - Add HR observations
   - Save for future reference

### Interview Management

#### Scheduling Interviews

1. **Create Interview**
   - Go to HR Dashboard → Interviews
   - Click "Schedule Interview" button
   - Fill interview details:
     ```
     Candidate: [Select from dropdown]
     Interviewer: [Select HR team member]
     Date: [Select date and time]
     Type: Technical/HR/Final
     Location: Office/Online
     ```

2. **AI Voice Interview Setup**
   - Click "Schedule AI Interview" button
   - Generate interview token
   - Send token to candidate
   - Candidate uses token to access voice interview

3. **Interview Management**
   - View scheduled interviews
   - Update interview status
   - Add interview notes
   - Record interview results

---

## 👨‍💼 Manager Workflows

### Team Management

#### Viewing Team Information

1. **Team Overview**
   - Go to Manager Dashboard
   - Click "Team" in the sidebar
   - See all team members
   - View team performance metrics

2. **Team Member Details**
   - Click on team member name
   - View detailed profile
   - Check skills and experience
   - Review performance history

3. **Team Performance**
   - See overall team metrics
   - View individual performance
   - Check attendance patterns
   - Review feedback trends

### Leave Management

#### Approving Leave Requests

1. **View Pending Requests**
   - Go to Manager Dashboard
   - Click "Leave Requests" in the sidebar
   - See all pending requests
   - Review request details

2. **Review Leave Request**
   ```
   Employee: John Doe
   Leave Type: Medical
   Duration: 2 days
   Dates: Jan 15-16, 2024
   Reason: Doctor appointment
   ```

3. **Approve or Reject**
   - Click "Approve" or "Reject" button
   - Add comments if needed
   - Submit decision
   - Employee receives notification

#### Leave History

1. **View Team Leave History**
   - See all approved/rejected leaves
   - Check leave patterns
   - Monitor leave balances
   - Export leave reports

### Performance Management

#### Performance Reviews

1. **Submit Performance Review**
   - Go to Manager Dashboard → Performance
   - Select team member
   - Rate performance metrics:
     ```
     Communication: 4/5
     Technical Skills: 5/5
     Problem Solving: 4/5
     Teamwork: 5/5
     Leadership: 3/5
     ```

2. **Add Feedback**
   - Write detailed feedback
   - Set goals for next period
   - Identify areas for improvement
   - Submit review

3. **Performance Tracking**
   - View performance trends
   - Compare team members
   - Track goal completion
   - Generate performance reports

### Feedback Management

#### Providing Feedback

1. **Submit Feedback**
   - Go to Manager Dashboard → Feedback
   - Select team member
   - Choose feedback type:
     - Performance Review
     - Peer Feedback
     - Manager Feedback
   - Write feedback content
   - Submit feedback

2. **Feedback History**
   - View all feedback given
   - Track feedback trends
   - Monitor improvement areas
   - Export feedback reports

---

## 👤 Employee Workflows

### Profile Management

#### Updating Personal Information

1. **Access Profile**
   - Go to Employee Dashboard
   - Click "Profile" in the sidebar
   - View current information

2. **Edit Profile**
   - Click "Edit Profile" button
   - Update information:
     ```
     Name: John Doe
     Phone: +91 9876543210
     Address: 123 Main Street, Mumbai
     Emergency Contact: Jane Doe
     Emergency Phone: +91 9876543211
     ```
   - Click "Save Changes"

#### Skills and Experience

1. **Update Skills**
   - Go to Profile → Skills section
   - Add new skills
   - Remove outdated skills
   - Update skill levels

2. **Experience Information**
   - Add work experience
   - Update current position
   - Add certifications
   - Update education

### Leave Management

#### Requesting Leave

1. **Submit Leave Request**
   - Go to Employee Dashboard → Leave
   - Click "Request Leave" button
   - Fill leave details:
     ```
     Leave Type: Medical/Personal/Vacation/Sick
     Start Date: [Select date]
     End Date: [Select date]
     Reason: [Enter reason]
     ```

2. **Leave Balance**
   - View current leave balance
   - Check leave history
   - See approved/pending requests
   - Monitor leave usage

3. **Leave Status**
   - Track request status
   - Receive notifications
   - View manager comments
   - Check approval/rejection reasons

### Attendance Tracking

#### Viewing Attendance

1. **Attendance Records**
   - Go to Employee Dashboard → Attendance
   - See attendance calendar
   - View daily attendance
   - Check attendance statistics

2. **Attendance History**
   - View past attendance
   - Check attendance patterns
   - Export attendance reports
   - Monitor attendance trends

### Payroll Information

#### Viewing Payroll

1. **Current Payroll**
   - Go to Employee Dashboard → Payroll
   - View current month's payroll
   - Check salary details
   - See deductions and benefits

2. **Payroll History**
   - View past payroll records
   - Download payslips
   - Check salary changes
   - Monitor bonus payments

### HR Chatbot

#### Using the Chatbot

1. **Access Chatbot**
   - Look for chat widget (bottom-right corner)
   - Click to open chat interface
   - Start typing your question

2. **Common Queries**
   ```
   "How many leave days do I have left?"
   "What is the work from home policy?"
   "How do I update my profile?"
   "What are the office hours?"
   "I'm new, what should I do first?"
   ```

3. **Getting Help**
   - Ask about company policies
   - Get help with procedures
   - Request information
   - Get step-by-step guidance

---

## 🎯 Candidate Workflows

### Job Applications

#### Applying for Jobs

1. **Browse Available Jobs**
   - Go to Candidate Dashboard → Jobs
   - See all open positions
   - Filter by department or location
   - Read job descriptions

2. **Apply for Position**
   - Click on job title
   - Read full job description
   - Click "Apply Now" button
   - Fill application form:
     ```
     Cover Letter: [Write cover letter]
     Expected Salary: [Enter amount]
     Availability: [Select date]
     Additional Notes: [Any additional info]
     ```

3. **Application Status**
   - Track application status
   - Receive notifications
   - Check application history
   - View application details

### Profile Management

#### Updating Candidate Profile

1. **Profile Information**
   - Go to Candidate Dashboard → Profile
   - Update personal information
   - Add skills and experience
   - Upload resume

2. **Skills and Experience**
   - Add technical skills
   - Update work experience
   - Add education details
   - Include certifications

### Interview Management

#### Interview Preparation

1. **Scheduled Interviews**
   - Go to Candidate Dashboard → Interviews
   - See upcoming interviews
   - View interview details
   - Prepare for interview

2. **Interview Details**
   ```
   Interview Type: Technical/HR/Final
   Date: January 20, 2024
   Time: 2:00 PM - 3:00 PM
   Location: Office/Online
   Interviewer: HR Team
   ```

### AI Voice Interview

#### Participating in AI Interview

1. **Access AI Interview**
   - Go to Candidate Dashboard → Interview
   - Enter interview token (provided by HR)
   - Click "Start Interview"

2. **Interview Process**
   - Follow voice prompts
   - Answer questions clearly
   - Complete all interview sections
   - Submit interview when complete

3. **Interview Results**
   - View interview assessment
   - Check performance feedback
   - See next steps
   - Track application progress

---

## Best Practices

### For All Users

1. **Regular Updates**
   - Keep profile information current
   - Update skills and experience
   - Check notifications regularly

2. **Data Accuracy**
   - Provide accurate information
   - Update changes promptly
   - Verify contact details

3. **Communication**
   - Use professional language
   - Respond to requests promptly
   - Ask questions when needed

### For Managers

1. **Timely Approvals**
   - Review requests promptly
   - Provide clear feedback
   - Maintain team communication

2. **Performance Management**
   - Regular check-ins
   - Constructive feedback
   - Goal setting and tracking

### For HR

1. **Candidate Management**
   - Prompt screening
   - Clear communication
   - Fair evaluation process

2. **Job Management**
   - Accurate job descriptions
   - Regular updates
   - Proper candidate matching

This user guide provides comprehensive workflows for all user roles, ensuring efficient use of the FWC HRMS system.
