import { auth, db } from '@/lib/firebase'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'

async function recalcDeptCount(deptName: string) {
    if (!deptName) return
    const usersSnap = await getDocs(query(collection(db, 'users'), where('department', '==', deptName)))
    const deptSnap = await getDocs(query(collection(db, 'departments'), where('name', '==', deptName)))
    for (const d of deptSnap.docs) {
        await updateDoc(doc(db, 'departments', d.id), { employees: usersSnap.size })
    }
}

// USERS
export async function fsGetUsers() {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsCreateUser(payload: { name: string; email: string; role: string; department?: string }) {
    const ref = await addDoc(collection(db, 'users'), payload)
    if (payload.department) await recalcDeptCount(payload.department)
    return { id: ref.id, ...payload }
}
export async function fsUpdateUser(id: string, payload: Partial<{ name: string; email: string; role: string; department?: string }>) {
    const before = await getDoc(doc(db, 'users', id))
    const beforeDept = (before.data() as any)?.department as string | undefined
    await updateDoc(doc(db, 'users', id), payload as any)
    const d = await getDoc(doc(db, 'users', id))
    const afterData = d.data() as any
    const afterDept = afterData?.department as string | undefined
    if (beforeDept && beforeDept !== afterDept) await recalcDeptCount(beforeDept)
    if (afterDept) await recalcDeptCount(afterDept)
    return { id, ...afterData }
}
export async function fsDeleteUser(id: string) {
    const snap = await getDoc(doc(db, 'users', id))
    const dept = (snap.data() as any)?.department as string | undefined
    await deleteDoc(doc(db, 'users', id))
    if (dept) await recalcDeptCount(dept)
    return { success: true }
}

// DEPARTMENTS
export async function fsGetDepartments() {
    const snap = await getDocs(collection(db, 'departments'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsCreateDepartment(payload: { name: string; head?: string }) {
    const ref = await addDoc(collection(db, 'departments'), { ...payload, employees: 0 })
    return { id: ref.id, ...payload }
}
export async function fsUpdateDepartment(id: string, payload: { name?: string; head?: string }) {
    await updateDoc(doc(db, 'departments', id), payload as any)
    const d = await getDoc(doc(db, 'departments', id))
    return { id, ...(d.data() as any) }
}
export async function fsDeleteDepartment(id: string) {
    await deleteDoc(doc(db, 'departments', id))
    return { success: true }
}
export async function fsAssignUsersToDepartment(deptId: string, userIds: string[]) {
    const deptDoc = await getDoc(doc(db, 'departments', deptId))
    const dept = deptDoc.data() as any
    const deptName = dept?.name
    if (!deptName) return { success: false }
    await Promise.all(userIds.map((uid) => updateDoc(doc(db, 'users', uid), { department: deptName })))
    // recalc employees
    const qSnap = await getDocs(query(collection(db, 'users'), where('department', '==', deptName)))
    await updateDoc(doc(db, 'departments', deptId), { employees: qSnap.size })
    return { success: true }
}

// HR: JOBS
export async function fsGetJobs() {
    const snap = await getDocs(collection(db, 'jobs'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsCreateJob(payload: { title: string; openings: number }) {
    const ref = await addDoc(collection(db, 'jobs'), { ...payload, status: 'Open' })
    return { id: ref.id, ...payload, status: 'Open' }
}
export async function fsUpdateJob(id: string, payload: Partial<{ title: string; openings: number; status: string }>) {
    await updateDoc(doc(db, 'jobs', id), payload as any)
    const d = await getDoc(doc(db, 'jobs', id))
    return { id, ...(d.data() as any) }
}
export async function fsCloseJob(id: string) {
    await updateDoc(doc(db, 'jobs', id), { status: 'Closed' })
    return { id, status: 'Closed' }
}

// HR: CANDIDATES
export async function fsGetCandidates() {
    const snap = await getDocs(collection(db, 'candidates'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsUpdateCandidateStatus(id: string, status: string) {
    await updateDoc(doc(db, 'candidates', id), { status })
    return { id, status }
}

// HR: OFFERS
export async function fsGetOffers() {
    const snap = await getDocs(collection(db, 'offers'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsUpdateOfferStatus(id: string, status: string) {
    await updateDoc(doc(db, 'offers', id), { status })
    return { id, status }
}

// HR: INTERVIEWS
export async function fsScheduleInterview(payload: { candidate: string; date: string; interviewer: string }) {
    const ref = await addDoc(collection(db, 'interviews'), payload)
    return { id: ref.id, ...payload }
}

// MANAGER: LEAVES
export async function fsGetPendingLeaves() {
    const snap = await getDocs(query(collection(db, 'leaves'), where('status', '==', 'pending')))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsDecideLeave(id: string, decision: 'approved' | 'rejected') {
    await updateDoc(doc(db, 'leaves', id), { status: decision })
    return { success: true, decision }
}

// EMPLOYEE: PROFILE
export async function fsSaveProfile(payload: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    const ref = doc(db, 'profiles', uid)
    try {
        await updateDoc(ref, payload)
    } catch {
        // if doc missing, create
        await addDoc(collection(db, 'profiles'), { uid, ...payload })
    }
    return { success: true }
}

// EMPLOYEE: LEAVE REQUESTS
export async function fsSubmitLeave(payload: { from: string; to: string; type: string; reason: string }) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    const fromDate = new Date(payload.from)
    const toDate = new Date(payload.to)
    const ms = Math.max(0, toDate.getTime() - fromDate.getTime())
    const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1)
    await addDoc(collection(db, 'leaves'), { uid, from: payload.from, to: payload.to, type: payload.type, reason: payload.reason, days, status: 'pending', createdAt: Date.now() })
    return { success: true }
}

export async function fsGetMyLeaves() {
    const uid = auth.currentUser?.uid
    if (!uid) return []
    const qSnap = await getDocs(query(collection(db, 'leaves'), where('uid', '==', uid)))
    return qSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

// EMPLOYEE: FEEDBACK
export async function fsSubmitFeedback(text: string) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    await addDoc(collection(db, 'feedbacks'), { uid, text, createdAt: Date.now() })
    return { success: true }
}

// EMPLOYEE: ATTENDANCE
export async function fsGetMyAttendance() {
    const uid = auth.currentUser?.uid
    if (!uid) return []
    const qSnap = await getDocs(query(collection(db, 'attendance'), where('uid', '==', uid)))
    return qSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fsMarkAttendance(status: 'present' | 'absent') {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    const today = new Date().toISOString().split('T')[0]
    const timestamp = new Date().toISOString()

    // Check if attendance already marked for today
    const existingSnap = await getDocs(query(
        collection(db, 'attendance'),
        where('uid', '==', uid),
        where('date', '==', today)
    ))

    if (existingSnap.docs.length > 0) {
        // Update existing record
        await updateDoc(doc(db, 'attendance', existingSnap.docs[0].id), { status, timestamp })
    } else {
        // Create new record
        await addDoc(collection(db, 'attendance'), {
            uid,
            date: today,
            status,
            timestamp,
            createdAt: Date.now()
        })
    }
    return { success: true }
}

export async function fsGetTeamMembers() {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const snap = await getDocs(query(collection(db, 'users'), where('managerId', '==', user.uid)))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

// CANDIDATE SPECIFIC FUNCTIONS
export async function fsGetAvailableJobs() {
    try {
        // First try to get jobs from the 'jobs' collection
        const jobsSnap = await getDocs(query(collection(db, 'jobs'), where('status', '==', 'Open')))
        const jobs = jobsSnap.docs.map((d) => {
            const data = d.data() as any
            return {
                id: d.id,
                title: data.title || 'Job Position',
                company: data.company || 'Our Company',
                department: data.department || 'General',
                location: data.location || 'Remote',
                type: data.type || data.employment_type || 'Full-time',
                salary: data.salary || '₹8-15 LPA',
                experience: data.experience || 'Not specified',
                description: data.description || (data.jdText ? data.jdText.substring(0, 200) + '...' : 'Job description not available'),
                jdText: data.jdText,
                status: data.status || 'Open',
                openings: data.openings || 1,
                postedDate: data.postedDate || 'Recently',
                applicants: data.applicants || Math.floor(Math.random() * 50) + 10,
                requirements: data.requirements || data.skills || []
            }
        })
        
        // If we have jobs with JD data, return them
        if (jobs.length > 0) {
            console.log(`Found ${jobs.length} jobs from 'jobs' collection`)
            return jobs
        }
        
        // If no jobs found, try to get from 'job_descriptions' collection as fallback
        console.log('No jobs found in "jobs" collection, trying "job_descriptions" collection')
        const jdSnap = await getDocs(collection(db, 'job_descriptions'))
        const jobDescriptions = jdSnap.docs.map((d) => {
            const data = d.data() as any
            return {
                id: d.id,
                title: data.role || data.title || 'Job Position',
                company: 'Our Company', // Default company name
                department: data.department || 'General',
                location: data.location || 'Remote',
                type: data.employment_type || 'Full-time',
                salary: '₹8-15 LPA', // Default salary range
                experience: data.experience || 'Not specified',
                description: data.jd_text ? data.jd_text.substring(0, 200) + '...' : 'Job description not available',
                jdText: data.jd_text,
                status: 'Open',
                openings: 1,
                postedDate: 'Recently',
                applicants: Math.floor(Math.random() * 50) + 10, // Random applicant count
                requirements: data.skills || []
            }
        })
        
        console.log(`Found ${jobDescriptions.length} job descriptions from 'job_descriptions' collection`)
        return jobDescriptions
        
    } catch (error) {
        console.error('Error fetching available jobs:', error)
        return []
    }
}

export async function fsApplyForJob(jobId: string, applicationData: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }

    // Convert file to base64 if present
    let resumeBase64 = null
    if (applicationData.resume && applicationData.resume instanceof File) {
        try {
            resumeBase64 = await convertFileToBase64(applicationData.resume)
        } catch (error) {
            console.error('Error converting file to base64:', error)
            return { success: false, error: 'Failed to process resume file' }
        }
    }

    const application = {
        uid,
        jobId,
        candidateName: applicationData.candidateName,
        email: applicationData.email,
        phone: applicationData.phone,
        currentLocation: applicationData.currentLocation,
        education: applicationData.education,
        college: applicationData.college,
        marks: applicationData.marks,
        experience: applicationData.experience,
        skills: applicationData.skills,
        coverLetter: applicationData.coverLetter,
        resume: resumeBase64,
        resumeFileName: applicationData.resume?.name || null,
        resumeFileType: applicationData.resume?.type || null,
        status: 'pending',
        appliedAt: Date.now()
    }

    const ref = await addDoc(collection(db, 'applications'), application)
    return { id: ref.id, ...application }
}

// Helper function to convert file to base64
function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            // Remove the data URL prefix to get just the base64 string
            const base64 = result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export async function fsGetCandidateApplications() {
    const uid = auth.currentUser?.uid
    if (!uid) return []

    const snap = await getDocs(query(collection(db, 'applications'), where('uid', '==', uid)))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

// HR FUNCTIONS
export async function fsGetAllApplications() {
    try {
        const snap = await getDocs(collection(db, 'applications'))
        const applications = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        
        // Get job details for each application
        const applicationsWithJobDetails = await Promise.all(
            applications.map(async (app) => {
                try {
                    // Try to get job details from jobs collection first
                    const jobSnap = await getDocs(query(collection(db, 'jobs'), where('__name__', '==', app.jobId)))
                    if (!jobSnap.empty) {
                        const jobData = jobSnap.docs[0].data()
                        return {
                            ...app,
                            jobTitle: jobData.title || jobData.role || 'Unknown Position',
                            jobCompany: jobData.company || 'Unknown Company',
                            jobLocation: jobData.location || 'Unknown Location',
                            jobDepartment: jobData.department || 'Unknown Department'
                        }
                    }
                    
                    // Fallback to job_descriptions collection
                    const jdSnap = await getDocs(query(collection(db, 'job_descriptions'), where('__name__', '==', app.jobId)))
                    if (!jdSnap.empty) {
                        const jdData = jdSnap.docs[0].data()
                        return {
                            ...app,
                            jobTitle: jdData.role || jdData.title || 'Unknown Position',
                            jobCompany: 'Our Company', // Default since job_descriptions don't have company
                            jobLocation: jdData.location || 'Unknown Location',
                            jobDepartment: jdData.department || 'Unknown Department'
                        }
                    }
                    
                    return {
                        ...app,
                        jobTitle: 'Unknown Position',
                        jobCompany: 'Unknown Company',
                        jobLocation: 'Unknown Location',
                        jobDepartment: 'Unknown Department'
                    }
                } catch (error) {
                    console.error('Error fetching job details for application:', app.id, error)
                    return {
                        ...app,
                        jobTitle: 'Unknown Position',
                        jobCompany: 'Unknown Company',
                        jobLocation: 'Unknown Location',
                        jobDepartment: 'Unknown Department'
                    }
                }
            })
        )
        
        return applicationsWithJobDetails
    } catch (error) {
        console.error('Error fetching applications:', error)
        return []
    }
}

export async function fsUpdateApplicationStatus(applicationId: string, status: string, notes?: string) {
    try {
        const applicationRef = doc(db, 'applications', applicationId)
        await updateDoc(applicationRef, {
            status,
            reviewedAt: Date.now(),
            ...(notes && { reviewNotes: notes })
        })
        return { success: true }
    } catch (error) {
        console.error('Error updating application status:', error)
        return { success: false, error: 'Failed to update application status' }
    }
}

// Resume Screening API Functions
export async function screenResume(resumeBase64: string, resumeFileName: string, jobId: string, candidateName: string, enableAI: boolean = true) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://hrms-backend-lv6f.onrender.com'
        const response = await fetch(`${backendUrl}/resume/screen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_base64: resumeBase64,
                resume_filename: resumeFileName,
                job_id: jobId,
                candidate_name: candidateName,
                enable_ai: enableAI
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Error screening resume:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
    }
}

export async function fsGetCandidateInterviews() {
    const uid = auth.currentUser?.uid
    if (!uid) return []

    const snap = await getDocs(query(collection(db, 'interviews'), where('candidate', '==', uid)))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export const fsGetCandidateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as any;
    } else {
        return null;
    }
};

export async function fsUpdateCandidateProfile(profileData: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }

    const docRef = doc(db, 'candidateProfiles', uid)
    try {
        await updateDoc(docRef, profileData)
    } catch {
        // If document doesn't exist, create it
        await addDoc(collection(db, 'candidateProfiles'), { uid, ...profileData })
    }
    return { success: true }
}

// EMPLOYEE SPECIFIC FUNCTIONS
export async function fsGetUserProfile() {
    const uid = auth.currentUser?.uid
    if (!uid) return null

    const docRef = doc(db, 'profiles', uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
    }
    return null
}

export async function fsUpdateUserProfile(profileData: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }

    const docRef = doc(db, 'profiles', uid)
    try {
        await updateDoc(docRef, profileData)
    } catch {
        // If document doesn't exist, create it
        await addDoc(collection(db, 'profiles'), { uid, ...profileData })
    }
    return { success: true }
}

export async function fsGetFeedback() {
    const uid = auth.currentUser?.uid
    if (!uid) return []

    const snap = await getDocs(query(collection(db, 'feedbacks'), where('uid', '==', uid)))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fsCreateFeedback(feedbackData: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }

    const feedback = {
        uid,
        ...feedbackData,
        createdAt: Date.now()
    }

    const ref = await addDoc(collection(db, 'feedbacks'), feedback)
    return { id: ref.id, ...feedback }
}

export async function fsCreateLeaveRequest(leaveData: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }

    const fromDate = new Date(leaveData.from)
    const toDate = new Date(leaveData.to)
    const ms = Math.max(0, toDate.getTime() - fromDate.getTime())
    const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1)

    const leave = {
        uid,
        ...leaveData,
        days,
        status: 'pending',
        createdAt: Date.now()
    }

    const ref = await addDoc(collection(db, 'leaves'), leave)
    return { id: ref.id, ...leave }
}

// MANAGER SPECIFIC FUNCTIONS
export async function fsGetManagerFeedback() {
    const uid = auth.currentUser?.uid
    if (!uid) return []

    // Get feedback for team members
    const teamMembers = await fsGetTeamMembers()
    const teamMemberIds = teamMembers.map(member => member.id)

    if (teamMemberIds.length === 0) return []

    const snap = await getDocs(query(collection(db, 'feedbacks'), where('uid', 'in', teamMemberIds)))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fsCreateManagerFeedback(feedbackData: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }

    const feedback = {
        managerId: uid,
        ...feedbackData,
        createdAt: Date.now()
    }

    const ref = await addDoc(collection(db, 'managerFeedbacks'), feedback)
    return { id: ref.id, ...feedback }
}

export async function fsUpdateScreeningResults(applicationId: string, screeningData: any) {
    try {
        const applicationRef = doc(db, 'applications', applicationId)
        await updateDoc(applicationRef, {
            aiScore: screeningData.ai_score,
            screeningDetails: screeningData.analysis,
            screeningCompleted: true,
            screeningDate: new Date().toISOString()
        })
        console.log('Screening results stored successfully')
        return { success: true }
    } catch (error) {
        console.error('Error storing screening results:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}