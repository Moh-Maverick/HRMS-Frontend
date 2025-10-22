# 🌱 Data Seeding Guide

This guide explains how to use the data seeding tool to populate your FWC HRMS database with comprehensive test data.

## Overview

The data seeding tool creates realistic sample data for all HRMS features, allowing you to test the application without manually creating hundreds of records. It's accessible through the web interface at `/tools/seed`.

## Accessing the Seeding Tool

### Prerequisites

1. **Application Running**: Ensure both frontend and backend are running
2. **Firebase Connected**: Verify Firebase connection is working
3. **Authentication**: You need to be logged in (any role)

### Access Steps

1. **Start the application**:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   uvicorn app:app --reload
   ```

2. **Navigate to seeding tool**:
   - Open http://localhost:3000
   - Go to http://localhost:3000/tools/seed
   - Or click "Seed Data" from the admin dashboard

## What Gets Created

The seeding tool creates comprehensive data across all collections:

### 📊 Data Statistics

| Collection | Records Created | Description |
|------------|----------------|-------------|
| **Departments** | 5 | Engineering, Sales, HR, Support, Finance |
| **Users** | 50+ | Distributed across all roles |
| **Jobs** | 30+ | Various positions across departments |
| **Candidates** | 40+ | With detailed profiles and skills |
| **Applications** | 50+ | Job applications with realistic data |
| **Interviews** | 20+ | Scheduled interviews |
| **Profiles** | 40+ | Employee profiles with skills |
| **Attendance** | 1000+ | 30 days of attendance records |
| **Leaves** | 30+ | Various leave requests |
| **Performance** | 40+ | Quarterly performance reviews |
| **Feedbacks** | 40+ | Employee feedback records |
| **Manager Feedbacks** | 25+ | Manager evaluations |

### 🏢 Department Data

Creates 5 departments with realistic employee counts:

```json
{
  "Engineering": { "head": "Neeraj Sharma", "employees": 20 },
  "Sales": { "head": "Pooja Gupta", "employees": 10 },
  "HR": { "head": "Carol HR", "employees": 5 },
  "Support": { "head": "Ravi Iyer", "employees": 8 },
  "Finance": { "head": "Anita Menon", "employees": 5 }
}
```

### 👥 User Data

Creates users with realistic Indian names and email patterns:

- **Admin**: 1 user (system administrator)
- **HR**: 2 users (HR team)
- **Managers**: 6 users (department heads and team leads)
- **Employees**: 40+ users (distributed across departments)
- **Candidates**: 30+ users (external candidates)

**Name Generation**:
- Uses realistic Indian first names: Aarav, Vivaan, Aditya, Neha, Ananya, etc.
- Uses common Indian last names: Sharma, Verma, Gupta, Patel, etc.
- Email format: `firstname.lastname@fwc.co.in`

### 💼 Job Data

Creates job postings across all departments:

**Engineering Jobs**:
- Frontend Engineer
- Backend Engineer
- QA Analyst
- DevOps Engineer
- Data Engineer

**Sales Jobs**:
- Sales Executive
- Account Manager
- Sales Analyst

**HR Jobs**:
- Recruiter
- HR Generalist
- HR Operations

**Support Jobs**:
- Support Engineer
- Customer Success
- Technical Support

**Finance Jobs**:
- Accountant
- Payroll Specialist
- Financial Analyst

### 🎯 Candidate Data

Creates detailed candidate profiles with:

- **Skills**: JavaScript, React, Node.js, Python, Java, SQL, AWS, Docker, etc.
- **Experience**: 1-8 years (realistic distribution)
- **Education**: Bachelor's, Master's, PhD, Diploma, Certification
- **Contact Info**: Phone numbers, LinkedIn profiles, portfolios
- **Resume Files**: Simulated resume filenames

### 📋 Application Data

Creates job applications with:

- **Status Distribution**: 25% pending, 25% reviewed, 25% shortlisted, 25% rejected
- **Cover Letters**: Generated based on candidate skills and experience
- **Expected Salary**: Realistic salary expectations
- **Application Dates**: Spread over the last 15 days

### 📅 Attendance Data

Creates 30 days of attendance records:

- **Present**: 90% of records (realistic attendance rate)
- **Absent**: 10% of records
- **Timestamps**: Realistic check-in times (9:00 AM - 10:30 AM)
- **Weekend Handling**: No records for weekends

### 🏖️ Leave Data

Creates leave requests with:

- **Leave Types**: Medical, Personal, Vacation, Sick
- **Duration**: 1-5 days per request
- **Status**: 33% pending, 33% approved, 33% rejected
- **Future Dates**: All leave requests are for future dates

### 📈 Performance Data

Creates quarterly performance reviews with:

- **Metrics**: Communication, Technical Skills, Problem Solving, Teamwork, Leadership, Innovation, Productivity, Quality
- **Ratings**: 1-5 scale with realistic distribution
- **Goals**: Personalized goals for each employee
- **Achievements**: Realistic achievements
- **Areas for Improvement**: Constructive feedback areas

## Seeding Process

### Step-by-Step Process

1. **Initialization**
   - Checks existing data
   - Creates missing collections
   - Sets up basic structure

2. **Department Creation**
   - Creates 5 departments
   - Sets up department heads
   - Initializes employee counts

3. **User Generation**
   - Creates users for each department
   - Assigns appropriate roles
   - Generates realistic names and emails

4. **Job Posting Creation**
   - Creates jobs for each department
   - Sets realistic openings and requirements
   - Generates job descriptions

5. **Candidate Profile Creation**
   - Creates detailed candidate profiles
   - Assigns skills and experience
   - Generates contact information

6. **Application Generation**
   - Links candidates to jobs
   - Creates realistic application data
   - Sets application statuses

7. **Employee Profile Creation**
   - Creates profiles for employees and managers
   - Assigns skills and experience
   - Sets up contact information

8. **Feedback System**
   - Creates employee feedback
   - Generates manager feedback
   - Sets up performance reviews

9. **Attendance Records**
   - Creates 30 days of attendance
   - Generates realistic patterns
   - Handles weekends appropriately

10. **Leave Requests**
    - Creates various leave requests
    - Sets realistic statuses
    - Assigns reviewers

11. **Final Updates**
    - Updates department employee counts
    - Ensures data consistency
    - Completes seeding process

### Progress Tracking

The seeding tool provides real-time progress updates:

```
Starting seed process...
Checking existing data...
Creating departments...
Creating job postings...
Creating candidate profiles...
Creating job applications...
Creating employee profiles...
Creating feedback data...
Creating manager feedback...
Creating performance data...
Creating attendance records...
Updating existing collections...
Updating department counts...
All data has been successfully seeded!
```

## Verification Steps

### 1. Check Department Counts

Navigate to Admin Dashboard → Departments:
- Should see 5 departments
- Employee counts should be updated
- Department heads should be assigned

### 2. Verify User Distribution

Check Users section:
- Total users should be 50+
- Role distribution should be realistic
- All users should have proper email format

### 3. Test Job Postings

Go to HR Dashboard → Jobs:
- Should see 30+ job postings
- Jobs should be distributed across departments
- All jobs should have proper descriptions

### 4. Check Candidate Data

Navigate to HR Dashboard → Candidates:
- Should see 40+ candidates
- Candidates should have realistic scores
- Status distribution should be balanced

### 5. Verify Applications

Check Applications section:
- Should see 50+ applications
- Applications should link to jobs and candidates
- Status distribution should be realistic

### 6. Test Employee Features

Login as Employee:
- Should see attendance records
- Leave requests should be visible
- Performance data should be available

### 7. Check Manager Features

Login as Manager:
- Should see team members
- Pending leave requests should be visible
- Performance review data should be available

## Re-seeding Considerations

### When to Re-seed

- **Fresh Installation**: After initial setup
- **Data Corruption**: If data becomes inconsistent
- **Testing New Features**: To ensure clean test data
- **Demo Preparation**: Before important demonstrations

### Re-seeding Process

The seeding tool is **idempotent** - it can be run multiple times safely:

1. **Existing Data Check**: Tool checks for existing data
2. **Skip Existing**: Won't overwrite existing records
3. **Create Missing**: Only creates missing data
4. **Update Counts**: Updates department employee counts

### Data Preservation

- **User Accounts**: Existing user accounts are preserved
- **Custom Data**: Any manually created data is maintained
- **Settings**: Application settings are not affected

## Troubleshooting

### Common Issues

#### 1. Seeding Fails to Start

**Error**: "No existing users found"

**Solution**:
- Ensure Firebase connection is working
- Check that authentication is properly configured
- Verify Firestore rules allow writes

#### 2. Partial Seeding

**Error**: Seeding stops partway through

**Solution**:
- Check Firebase quota limits
- Verify API keys are valid
- Check network connectivity
- Review browser console for errors

#### 3. Data Inconsistency

**Error**: Department counts don't match user counts

**Solution**:
- Re-run the seeding tool
- The tool will update department counts
- Check for any manual data modifications

#### 4. Performance Issues

**Error**: Seeding takes too long

**Solution**:
- Check Firebase performance
- Ensure good network connection
- Consider running during off-peak hours
- Monitor Firebase console for errors

### Debugging Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls are successful
3. **Check Firebase Console**: Monitor database writes
4. **Check Backend Logs**: Look for server-side errors

## Best Practices

### Before Seeding

1. **Backup Data**: If you have important data, export it first
2. **Check Quotas**: Ensure Firebase quotas are sufficient
3. **Test Connection**: Verify all connections are working
4. **Clear Browser Cache**: Ensure fresh start

### During Seeding

1. **Don't Interrupt**: Let the process complete
2. **Monitor Progress**: Watch for any error messages
3. **Check Network**: Ensure stable internet connection
4. **Avoid Other Operations**: Don't perform other database operations

### After Seeding

1. **Verify Data**: Check all major sections
2. **Test Features**: Try key functionality
3. **Check Performance**: Ensure good response times
4. **Document Issues**: Note any problems for future reference

## Customization

### Modifying Seed Data

To customize the seed data, edit the seeding file:

```typescript
// File: src/app/tools/seed/page.tsx

// Modify departments
const departments = [
  { name: 'Your Department', head: 'Your Head' },
  // ... other departments
];

// Modify skills
const skills = [
  'Your Skill 1',
  'Your Skill 2',
  // ... other skills
];

// Modify data counts
const desired: Record<string, number> = { 
  'Your Department': 10, 
  // ... other counts
};
```

### Adding New Data Types

To add new data types:

1. **Create Collection**: Add new collection to Firestore
2. **Update Seeding Logic**: Add creation logic in seeding tool
3. **Update Verification**: Add verification steps
4. **Test Thoroughly**: Ensure new data works correctly

This seeding system provides a robust foundation for testing and demonstrating the FWC HRMS application with realistic, comprehensive data.
