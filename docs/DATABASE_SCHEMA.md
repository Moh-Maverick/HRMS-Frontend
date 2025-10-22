# 🗄️ Database Schema

This document describes the Firebase Firestore database schema used in the FWC HRMS application.

## Overview

The database uses Firebase Firestore, a NoSQL document database that stores data in collections and documents. Each collection contains multiple documents, and each document contains fields with data.

## Collections Overview

| Collection | Purpose | Document Count (Seeded) | Key Fields |
|------------|---------|------------------------|------------|
| `users` | User authentication and roles | 50+ | `email`, `role`, `name`, `department` |
| `departments` | Department management | 5 | `name`, `head`, `employees` |
| `jobs` | Job postings | 30+ | `title`, `openings`, `status`, `department` |
| `candidates` | Candidate profiles | 40+ | `name`, `email`, `status`, `score` |
| `candidateProfiles` | Detailed candidate data | 30+ | `skills`, `experience`, `education` |
| `applications` | Job applications | 50+ | `jobId`, `status`, `appliedAt` |
| `interviews` | Interview scheduling | 20+ | `candidate`, `interviewer`, `date` |
| `profiles` | Employee profiles | 40+ | `skills`, `experience`, `position` |
| `attendance` | Attendance records | 1000+ | `uid`, `date`, `status` |
| `leaves` | Leave requests | 30+ | `uid`, `from`, `to`, `type` |
| `performance` | Performance reviews | 40+ | `uid`, `period`, `metrics` |
| `feedbacks` | Employee feedback | 40+ | `uid`, `type`, `rating` |
| `managerFeedbacks` | Manager feedback | 25+ | `managerId`, `employeeId`, `rating` |
| `job_descriptions` | Generated JDs | Variable | `role`, `title`, `jd_text` |

## Detailed Schema

### 1. Users Collection (`users`)

**Purpose**: Stores user authentication data and role assignments

```typescript
interface User {
  id: string;                    // Document ID (Firebase Auth UID)
  email: string;                 // User email
  role: 'admin' | 'hr' | 'manager' | 'employee' | 'candidate';
  name: string;                  // User's full name
  department?: string;           // Department assignment
  createdAt?: number;           // Timestamp
  updatedAt?: number;          // Timestamp
}
```

**Indexes**:
- `email` (unique)
- `role`
- `department`

**Example Document**:
```json
{
  "email": "john.doe@fwc.co.in",
  "role": "employee",
  "name": "John Doe",
  "department": "Engineering",
  "createdAt": 1703123456789
}
```

### 2. Departments Collection (`departments`)

**Purpose**: Manages organizational departments

```typescript
interface Department {
  id: string;                    // Document ID
  name: string;                  // Department name
  head?: string;                 // Department head name
  employees: number;             // Employee count
  createdAt?: number;           // Timestamp
  updatedAt?: number;          // Timestamp
}
```

**Indexes**:
- `name` (unique)

**Example Document**:
```json
{
  "name": "Engineering",
  "head": "Neeraj Sharma",
  "employees": 24,
  "createdAt": 1703123456789
}
```

### 3. Jobs Collection (`jobs`)

**Purpose**: Stores job postings and requirements

```typescript
interface Job {
  id: string;                    // Document ID
  title: string;                 // Job title
  openings: number;              // Number of openings
  status: 'Open' | 'Closed' | 'On Hold';
  department: string;             // Department name
  description: string;           // Job description
  requirements: string[];         // Required skills/qualifications
  salary: string;                // Salary range
  location: string;               // Job location
  createdAt?: number;           // Timestamp
  updatedAt?: number;          // Timestamp
}
```

**Indexes**:
- `status`
- `department`
- `title`

**Example Document**:
```json
{
  "title": "Frontend Engineer",
  "openings": 2,
  "status": "Open",
  "department": "Engineering",
  "description": "Join our Engineering team as a Frontend Engineer",
  "requirements": ["Bachelor's degree", "2+ years experience", "React knowledge"],
  "salary": "8L - 15L",
  "location": "Mumbai, India"
}
```

### 4. Candidates Collection (`candidates`)

**Purpose**: Basic candidate information for HR management

```typescript
interface Candidate {
  id: string;                    // Document ID
  name: string;                  // Candidate name
  email: string;                  // Candidate email
  phone: string;                  // Phone number
  jobId: string;                 // Applied job ID
  status: 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  score: number;                 // AI screening score (0-1)
  experience: number;            // Years of experience
  skills: string[];              // Candidate skills
  appliedAt: number;            // Application timestamp
  notes?: string;               // HR notes
}
```

**Indexes**:
- `status`
- `jobId`
- `score`

**Example Document**:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@email.com",
  "phone": "+91 9876543210",
  "jobId": "job_123",
  "status": "Screening",
  "score": 0.82,
  "experience": 3,
  "skills": ["React", "JavaScript", "Node.js"],
  "appliedAt": 1703123456789
}
```

### 5. Candidate Profiles Collection (`candidateProfiles`)

**Purpose**: Detailed candidate profiles with comprehensive data

```typescript
interface CandidateProfile {
  id: string;                    // Document ID
  uid: string;                   // Unique identifier
  name: string;                   // Full name
  email: string;                  // Email address
  phone: string;                  // Phone number
  skills: string[];               // Technical skills
  experience: number;            // Years of experience
  education: string;              // Education level
  location: string;               // Current location
  resume: string;                 // Resume filename/path
  portfolio?: string;             // Portfolio URL
  linkedin?: string;              // LinkedIn profile
  createdAt: number;             // Profile creation timestamp
}
```

**Indexes**:
- `email`
- `skills`
- `experience`

### 6. Applications Collection (`applications`)

**Purpose**: Job application records linking candidates to jobs

```typescript
interface Application {
  id: string;                    // Document ID
  uid: string;                   // Candidate UID
  jobId: string;                 // Job ID
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedAt: number;             // Application timestamp
  coverLetter: string;           // Cover letter text
  expectedSalary: string;        // Expected salary
  availability: string;           // Availability status
  notes?: string;                // Application notes
}
```

**Indexes**:
- `uid`
- `jobId`
- `status`
- `appliedAt`

### 7. Interviews Collection (`interviews`)

**Purpose**: Interview scheduling and management

```typescript
interface Interview {
  id: string;                    // Document ID
  candidate: string;             // Candidate ID
  interviewer: string;           // Interviewer UID
  interviewerName: string;        // Interviewer name
  date: string;                  // Interview date (ISO string)
  type: 'Technical' | 'HR' | 'Final';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  location: string;              // Interview location
  notes?: string;                // Interview notes
  duration: number;              // Duration in minutes
}
```

**Indexes**:
- `candidate`
- `interviewer`
- `date`
- `status`

### 8. Profiles Collection (`profiles`)

**Purpose**: Employee profile information

```typescript
interface Profile {
  id: string;                    // Document ID (matches user ID)
  uid: string;                   // User UID
  name: string;                  // Full name
  email: string;                  // Email address
  phone: string;                  // Phone number
  department: string;             // Department
  position: string;               // Job position
  skills: string[];               // Skills array
  experience: number;             // Years of experience
  education: string;              // Education level
  address: string;                // Address
  emergencyContact: string;       // Emergency contact name
  emergencyPhone: string;         // Emergency contact phone
  joiningDate: string;            // Joining date (ISO string)
  updatedAt: number;              // Last update timestamp
}
```

**Indexes**:
- `uid` (unique)
- `department`
- `position`

### 9. Attendance Collection (`attendance`)

**Purpose**: Employee attendance tracking

```typescript
interface Attendance {
  id: string;                    // Document ID
  uid: string;                   // Employee UID
  date: string;                  // Date (YYYY-MM-DD)
  status: 'present' | 'absent' | 'late' | 'half-day';
  timestamp: string;              // Check-in timestamp
  createdAt: number;             // Record creation timestamp
}
```

**Indexes**:
- `uid`
- `date`
- `status`

### 10. Leaves Collection (`leaves`)

**Purpose**: Leave request management

```typescript
interface Leave {
  id: string;                    // Document ID
  uid: string;                   // Employee UID
  employee: string;              // Employee name
  from: string;                  // Start date (YYYY-MM-DD)
  to: string;                    // End date (YYYY-MM-DD)
  days: number;                  // Number of days
  type: 'Medical' | 'Personal' | 'Vacation' | 'Sick';
  reason: string;                // Leave reason
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: number;             // Application timestamp
  reviewedBy?: string;           // Reviewer UID
}
```

**Indexes**:
- `uid`
- `status`
- `from`
- `to`

### 11. Performance Collection (`performance`)

**Purpose**: Employee performance reviews

```typescript
interface Performance {
  id: string;                    // Document ID
  uid: string;                   // Employee UID
  period: string;                 // Review period (e.g., "Q4 2024")
  metrics: {                     // Performance metrics
    [key: string]: number;       // Metric name -> score (1-5)
  };
  overallRating: number;          // Overall rating (1-5)
  goals: string[];                // Goals for next period
  achievements: string[];         // Achievements
  areasForImprovement: string[];  // Areas for improvement
  createdAt: number;             // Review timestamp
}
```

**Indexes**:
- `uid`
- `period`
- `overallRating`

### 12. Feedbacks Collection (`feedbacks`)

**Purpose**: Employee feedback system

```typescript
interface Feedback {
  id: string;                    // Document ID
  uid: string;                   // Employee UID
  type: 'Performance Review' | 'Peer Feedback' | 'Manager Feedback' | 'Self Assessment' | '360 Review';
  rating: number;                 // Rating (1-5)
  text: string;                  // Feedback text
  category: string;              // Feedback category
  createdAt: number;             // Feedback timestamp
  reviewedBy: string;            // Reviewer UID
}
```

**Indexes**:
- `uid`
- `type`
- `rating`
- `createdAt`

### 13. Manager Feedbacks Collection (`managerFeedbacks`)

**Purpose**: Manager-specific feedback

```typescript
interface ManagerFeedback {
  id: string;                    // Document ID
  managerId: string;             // Manager UID
  employeeId: string;             // Employee UID
  rating: number;                // Rating (1-5)
  feedback: string;              // Feedback text
  category: string;              // Feedback category
  goals: string[];               // Goals for employee
  createdAt: number;             // Feedback timestamp
}
```

**Indexes**:
- `managerId`
- `employeeId`
- `rating`

### 14. Job Descriptions Collection (`job_descriptions`)

**Purpose**: AI-generated job descriptions

```typescript
interface JobDescription {
  id: string;                    // Document ID
  role: string;                  // Job role
  title: string;                 // Job title
  jd_text: string;               // Generated JD text
  metadata: {                    // Generation metadata
    role: string;
    department?: string;
    experience?: string;
    skills?: string[];
    location?: string;
    employment_type?: string;
    responsibilities?: string[];
    company?: string;
    additional_notes?: string;
  };
  updated_at: string;            // Last update timestamp
}
```

**Indexes**:
- `role`
- `title`

## Collection Relationships

### Primary Relationships

1. **Users ↔ Profiles**: One-to-one relationship
   - `users.id` = `profiles.uid`

2. **Jobs ↔ Applications**: One-to-many relationship
   - `jobs.id` = `applications.jobId`

3. **Candidates ↔ Applications**: One-to-many relationship
   - `candidates.id` = `applications.uid`

4. **Departments ↔ Users**: One-to-many relationship
   - `departments.name` = `users.department`

5. **Users ↔ Attendance**: One-to-many relationship
   - `users.id` = `attendance.uid`

6. **Users ↔ Leaves**: One-to-many relationship
   - `users.id` = `leaves.uid`

7. **Users ↔ Performance**: One-to-many relationship
   - `users.id` = `performance.uid`

### Hierarchical Relationships

1. **Manager ↔ Employee**: Self-referencing relationship
   - `profiles.managerId` = `profiles.uid` (for managers)

2. **Interviewer ↔ Candidate**: Through interviews collection
   - `interviews.interviewer` = `users.id`
   - `interviews.candidate` = `candidates.id`

## Query Patterns

### Common Queries

1. **Get users by role**:
   ```javascript
   query(collection(db, 'users'), where('role', '==', 'employee'))
   ```

2. **Get candidates by status**:
   ```javascript
   query(collection(db, 'candidates'), where('status', '==', 'Screening'))
   ```

3. **Get applications for a job**:
   ```javascript
   query(collection(db, 'applications'), where('jobId', '==', jobId))
   ```

4. **Get attendance for user**:
   ```javascript
   query(collection(db, 'attendance'), where('uid', '==', userId))
   ```

5. **Get leaves by status**:
   ```javascript
   query(collection(db, 'leaves'), where('status', '==', 'pending'))
   ```

### Composite Queries

1. **Get employees in department**:
   ```javascript
   query(collection(db, 'users'), 
         where('department', '==', 'Engineering'),
         where('role', '==', 'employee'))
   ```

2. **Get recent applications**:
   ```javascript
   query(collection(db, 'applications'),
         where('appliedAt', '>=', timestamp),
         orderBy('appliedAt', 'desc'))
   ```

## Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for jobs
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'hr'];
    }
    
    // HR and Admin can manage candidates
    match /candidates/{candidateId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'hr'];
    }
    
    // Employees can read their own attendance
    match /attendance/{attendanceId} {
      allow read: if request.auth != null && 
        resource.data.uid == request.auth.uid;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'hr'];
    }
  }
}
```

## Data Seeding

The application includes a comprehensive data seeding system accessible at `/tools/seed` that creates:

- **5 Departments**: Engineering, Sales, HR, Support, Finance
- **50+ Users**: Distributed across all roles
- **30+ Jobs**: Various positions across departments
- **40+ Candidates**: With detailed profiles
- **50+ Applications**: Job applications
- **20+ Interviews**: Scheduled interviews
- **1000+ Attendance Records**: 30 days of attendance data
- **30+ Leave Requests**: Various leave types
- **40+ Performance Reviews**: Quarterly reviews
- **40+ Feedback Records**: Employee feedback
- **25+ Manager Feedbacks**: Manager evaluations

## Performance Considerations

### Indexing Strategy

1. **Single Field Indexes**: Created automatically for frequently queried fields
2. **Composite Indexes**: Required for complex queries with multiple where clauses
3. **Array Indexes**: For array fields like skills and requirements

### Query Optimization

1. **Limit Results**: Use `limit()` to prevent large result sets
2. **Pagination**: Implement cursor-based pagination for large collections
3. **Caching**: Cache frequently accessed data on the client side
4. **Real-time Listeners**: Use efficiently to avoid unnecessary updates

### Storage Optimization

1. **Document Size**: Keep documents under 1MB limit
2. **Field Naming**: Use short field names to reduce storage
3. **Data Types**: Use appropriate data types (numbers vs strings)
4. **Nested Objects**: Balance between normalization and denormalization

This schema provides a robust foundation for enterprise-level HR management with support for all core HRMS functionalities and AI-powered features.
