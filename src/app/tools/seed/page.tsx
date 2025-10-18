"use client"
import { addDoc, collection, getDocs, query, where, updateDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useMemo, useState } from 'react'

export default function SeedPage() {
    const [status, setStatus] = useState<string>('Idle')
    const [done, setDone] = useState(false)
    const [progress, setProgress] = useState<string>('')

    const departments = useMemo(() => [
        { name: 'Engineering', head: 'Neeraj Sharma' },
        { name: 'Sales', head: 'Pooja Gupta' },
        { name: 'HR', head: 'Carol HR' },
        { name: 'Support', head: 'Ravi Iyer' },
        { name: 'Finance', head: 'Anita Menon' },
    ], [])

    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Muhammad', 'Sai', 'Arnav', 'Ayaan', 'Ishaan', 'Kabir', 'Krishna', 'Ritvik', 'Rohan', 'Neha', 'Ananya', 'Isha', 'Aditi', 'Diya', 'Saanvi', 'Anika', 'Ira', 'Navya', 'Kiara', 'Meera', 'Sara', 'Riya', 'Myra']
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Agarwal', 'Patel', 'Shah', 'Iyer', 'Menon', 'Rao', 'Nair', 'Reddy', 'Jain', 'Kapoor', 'Khanna', 'Bose', 'Mukherjee', 'Chopra', 'Malhotra']
    const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Microservices', 'CI/CD', 'Agile']
    const educationLevels = ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Diploma', 'Certification']
    const feedbackTypes = ['Performance Review', 'Peer Feedback', 'Manager Feedback', 'Self Assessment', '360 Review']
    const performanceMetrics = ['Communication', 'Technical Skills', 'Problem Solving', 'Teamwork', 'Leadership', 'Innovation', 'Productivity', 'Quality']

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const genName = () => `${pick(firstNames)} ${pick(lastNames)}`
    const genEmail = (name: string) => `${name.toLowerCase().replace(/\s+/g, '.')}@fwc.co.in`
    const genPhone = () => `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`

    async function seed() {
        try {
            setStatus('Seeding...')
            setProgress('Starting seed process...')

            // Step 1: Check existing data and create missing collections
            setProgress('Checking existing data...')

            // Get existing users to work with
            const usersSnap = await getDocs(collection(db, 'users'))
            const existingUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any))

            if (existingUsers.length === 0) {
                setProgress('No existing users found. Creating basic data first...')

                // Create departments if they don't exist
                const deptSnap = await getDocs(collection(db, 'departments'))
                if (deptSnap.empty) {
                    for (const d of departments) {
                        await addDoc(collection(db, 'departments'), { ...d, employees: 0 })
                    }
                }

                // Create basic users
                const desired: Record<string, number> = { Engineering: 20, Sales: 10, HR: 5, Support: 8, Finance: 5 }
                for (const deptName of Object.keys(desired)) {
                    const count = desired[deptName]
                    for (let i = 0; i < count; i++) {
                        const role = deptName === 'HR' ? (i % 3 === 0 ? 'hr' : 'employee') : (i % 8 === 0 ? 'manager' : 'employee')
                        const name = genName()
                        const email = genEmail(name)
                        await addDoc(collection(db, 'users'), { name, email, role, department: deptName })
                    }
                }

                // Refresh users list
                const newUsersSnap = await getDocs(collection(db, 'users'))
                existingUsers.push(...newUsersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)))
            }

            // Step 2: Create jobs if they don't exist
            setProgress('Creating job postings...')
            const jobsSnap = await getDocs(collection(db, 'jobs'))
            if (jobsSnap.empty) {
                const jobTitles: Record<string, string[]> = {
                    Engineering: ['Frontend Engineer', 'Backend Engineer', 'QA Analyst', 'DevOps Engineer', 'Data Engineer'],
                    Sales: ['Sales Executive', 'Account Manager', 'Sales Analyst'],
                    HR: ['Recruiter', 'HR Generalist', 'HR Operations'],
                    Support: ['Support Engineer', 'Customer Success', 'Technical Support'],
                    Finance: ['Accountant', 'Payroll Specialist', 'Financial Analyst'],
                }
                for (const deptName of Object.keys(jobTitles)) {
                    for (const title of jobTitles[deptName]) {
                        await addDoc(collection(db, 'jobs'), {
                            title,
                            openings: Math.ceil(Math.random() * 3) + 1,
                            status: 'Open',
                            department: deptName,
                            description: `Join our ${deptName} team as a ${title}`,
                            requirements: ['Bachelor\'s degree', '2+ years experience', 'Strong communication skills'],
                            salary: `${Math.floor(Math.random() * 20) + 5}L - ${Math.floor(Math.random() * 20) + 15}L`,
                            location: 'Mumbai, India'
                        })
                    }
                }
            }

            // Step 3: Create candidate profiles
            setProgress('Creating candidate profiles...')
            const candidateProfilesSnap = await getDocs(collection(db, 'candidateProfiles'))
            if (candidateProfilesSnap.empty) {
                for (let i = 0; i < 30; i++) {
                    const name = genName()
                    const email = genEmail(name)
                    const phone = genPhone()
                    const userSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3)

                    await addDoc(collection(db, 'candidateProfiles'), {
                        uid: `candidate_${i}`,
                        name,
                        email,
                        phone,
                        skills: userSkills,
                        experience: Math.floor(Math.random() * 8) + 1,
                        education: pick(educationLevels),
                        location: 'Mumbai, India',
                        resume: `resume_${name.replace(/\s+/g, '_')}.pdf`,
                        portfolio: `https://portfolio.${name.toLowerCase().replace(/\s+/g, '')}.com`,
                        linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '')}`,
                        createdAt: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
                    })
                }
            }

            // Step 4: Create applications
            setProgress('Creating job applications...')
            const applicationsSnap = await getDocs(collection(db, 'applications'))
            if (applicationsSnap.empty) {
                const jobsSnap = await getDocs(collection(db, 'jobs'))
                const jobIds = jobsSnap.docs.map(d => d.id)
                const candidateProfilesSnap = await getDocs(collection(db, 'candidateProfiles'))

                for (let i = 0; i < 50; i++) {
                    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)]
                    const candidateProfile = candidateProfilesSnap.docs[Math.floor(Math.random() * candidateProfilesSnap.docs.length)]
                    const profileData = candidateProfile.data()

                    await addDoc(collection(db, 'applications'), {
                        uid: candidateProfile.id,
                        jobId,
                        status: ['pending', 'reviewed', 'shortlisted', 'rejected'][Math.floor(Math.random() * 4)],
                        appliedAt: Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000,
                        coverLetter: `I am excited to apply for this position. I have ${profileData.experience} years of experience in ${profileData.skills.slice(0, 2).join(' and ')}.`,
                        expectedSalary: `${Math.floor(Math.random() * 15) + 8}L`,
                        availability: 'Immediate',
                        notes: 'Strong technical background with excellent communication skills.'
                    })
                }
            }

            // Step 5: Create employee profiles
            setProgress('Creating employee profiles...')
            const profilesSnap = await getDocs(collection(db, 'profiles'))
            if (profilesSnap.empty) {
                for (const user of existingUsers) {
                    if (user.role === 'employee' || user.role === 'manager') {
                        const userSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 4)

                        await setDoc(doc(db, 'profiles', user.id), {
                            uid: user.id,
                            name: user.name,
                            email: user.email,
                            phone: genPhone(),
                            department: user.department,
                            position: `${user.department} Specialist`,
                            skills: userSkills,
                            experience: Math.floor(Math.random() * 10) + 1,
                            education: pick(educationLevels),
                            address: `${Math.floor(Math.random() * 100) + 1}, Mumbai, India`,
                            emergencyContact: genName(),
                            emergencyPhone: genPhone(),
                            joiningDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
                            updatedAt: Date.now()
                        })
                    }
                }
            }

            // Step 6: Create feedback data
            setProgress('Creating feedback data...')
            const feedbackSnap = await getDocs(collection(db, 'feedbacks'))
            if (feedbackSnap.empty) {
                for (let i = 0; i < 40; i++) {
                    const user = existingUsers[Math.floor(Math.random() * existingUsers.length)]
                    if (user.role === 'employee') {
                        await addDoc(collection(db, 'feedbacks'), {
                            uid: user.id,
                            type: pick(feedbackTypes),
                            rating: Math.floor(Math.random() * 5) + 1,
                            text: `This is feedback for ${user.name}. They have shown excellent performance in their role.`,
                            category: pick(['Performance', 'Skills', 'Communication', 'Teamwork']),
                            createdAt: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
                            reviewedBy: existingUsers.find(u => u.role === 'manager')?.id || user.id
                        })
                    }
                }
            }

            // Step 7: Create manager feedback
            setProgress('Creating manager feedback...')
            const managerFeedbackSnap = await getDocs(collection(db, 'managerFeedbacks'))
            if (managerFeedbackSnap.empty) {
                const managers = existingUsers.filter(u => u.role === 'manager')
                const employees = existingUsers.filter(u => u.role === 'employee')

                for (let i = 0; i < 25; i++) {
                    const manager = managers[Math.floor(Math.random() * managers.length)]
                    const employee = employees[Math.floor(Math.random() * employees.length)]

                    await addDoc(collection(db, 'managerFeedbacks'), {
                        managerId: manager.id,
                        employeeId: employee.id,
                        rating: Math.floor(Math.random() * 5) + 1,
                        feedback: `Manager feedback for ${employee.name}: Shows great potential and dedication to work.`,
                        category: pick(['Performance', 'Skills Development', 'Leadership', 'Communication']),
                        goals: ['Improve technical skills', 'Take on more responsibilities', 'Mentor junior team members'],
                        createdAt: Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000
                    })
                }
            }

            // Step 8: Create performance data
            setProgress('Creating performance data...')
            const performanceSnap = await getDocs(collection(db, 'performance'))
            if (performanceSnap.empty) {
                for (const user of existingUsers) {
                    if (user.role === 'employee' || user.role === 'manager') {
                        const metrics: { [key: string]: number } = {}
                        performanceMetrics.forEach(metric => {
                            metrics[metric] = Math.floor(Math.random() * 5) + 1
                        })

                        await addDoc(collection(db, 'performance'), {
                            uid: user.id,
                            period: 'Q4 2024',
                            metrics,
                            overallRating: Math.floor(Math.random() * 5) + 1,
                            goals: ['Complete project deliverables', 'Improve team collaboration', 'Enhance technical skills'],
                            achievements: ['Successfully delivered 3 major projects', 'Mentored 2 junior developers', 'Improved team productivity by 20%'],
                            areasForImprovement: ['Time management', 'Advanced technical skills', 'Leadership capabilities'],
                            createdAt: Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
                        })
                    }
                }
            }

            // Step 9: Create attendance data
            setProgress('Creating attendance records...')
            const attendanceSnap = await getDocs(collection(db, 'attendance'))
            if (attendanceSnap.empty) {
                for (let day = 0; day < 30; day++) {
                    const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

                    for (const user of existingUsers) {
                        if (user.role === 'employee' || user.role === 'manager') {
                            const status = Math.random() > 0.1 ? 'present' : 'absent'
                            const timestamp = new Date(Date.now() - day * 24 * 60 * 60 * 1000 + Math.random() * 2 * 60 * 60 * 1000).toISOString()

                            await addDoc(collection(db, 'attendance'), {
                                uid: user.id,
                                date,
                                status,
                                timestamp,
                                createdAt: Date.now() - day * 24 * 60 * 60 * 1000
                            })
                        }
                    }
                }
            }

            // Step 10: Update existing collections with additional data
            setProgress('Updating existing collections...')

            // Update candidates with more detailed info
            const candidatesSnap = await getDocs(collection(db, 'candidates'))
            if (candidatesSnap.empty) {
                const jobsSnap = await getDocs(collection(db, 'jobs'))
                const jobIds = jobsSnap.docs.map(d => d.id)

                for (let i = 0; i < 40; i++) {
                    const name = genName()
                    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)]
                    const status = ['Screening', 'Interview', 'Offer', 'Rejected'][Math.floor(Math.random() * 4)]
                    const score = Math.round((0.6 + Math.random() * 0.4) * 100) / 100

                    await addDoc(collection(db, 'candidates'), {
                        name,
                        email: genEmail(name),
                        phone: genPhone(),
                        jobId,
                        status,
                        score,
                        experience: Math.floor(Math.random() * 8) + 1,
                        skills: skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2),
                        appliedAt: Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000,
                        notes: 'Strong candidate with relevant experience'
                    })
                }
            }

            // Update interviews with more details
            const interviewsSnap = await getDocs(collection(db, 'interviews'))
            if (interviewsSnap.empty) {
                const candidatesSnap = await getDocs(collection(db, 'candidates'))
                const candidateIds = candidatesSnap.docs.map(d => d.id)
                const hrUsers = existingUsers.filter(u => u.role === 'hr')

                for (let i = 0; i < 20; i++) {
                    const candidateId = candidateIds[Math.floor(Math.random() * candidateIds.length)]
                    const interviewer = hrUsers[Math.floor(Math.random() * hrUsers.length)]
                    const date = new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString()

                    await addDoc(collection(db, 'interviews'), {
                        candidate: candidateId,
                        interviewer: interviewer.id,
                        interviewerName: interviewer.name,
                        date,
                        type: ['Technical', 'HR', 'Final'][Math.floor(Math.random() * 3)],
                        status: ['Scheduled', 'Completed', 'Cancelled'][Math.floor(Math.random() * 3)],
                        location: 'Office - Conference Room A',
                        notes: 'Technical interview focusing on problem-solving skills',
                        duration: 60
                    })
                }
            }

            // Update leaves with proper structure
            const leavesSnap = await getDocs(collection(db, 'leaves'))
            if (leavesSnap.empty) {
                for (let i = 0; i < 30; i++) {
                    const user = existingUsers[Math.floor(Math.random() * existingUsers.length)]
                    if (user.role === 'employee') {
                        const fromDate = new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
                        const toDate = new Date(fromDate.getTime() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000)
                        const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

                        await addDoc(collection(db, 'leaves'), {
                            uid: user.id,
                            employee: user.name,
                            from: fromDate.toISOString().split('T')[0],
                            to: toDate.toISOString().split('T')[0],
                            days,
                            type: ['Medical', 'Personal', 'Vacation', 'Sick'][Math.floor(Math.random() * 4)],
                            reason: 'Personal reasons',
                            status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
                            appliedAt: Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
                            reviewedBy: existingUsers.find(u => u.role === 'manager')?.id || null
                        })
                    }
                }
            }

            // Recalculate department employee counts
            setProgress('Updating department counts...')
            const deptSnap = await getDocs(collection(db, 'departments'))
            for (const d of deptSnap.docs) {
                const dept = d.data() as any
                const name = dept?.name
                if (!name) continue
                const usersSnap = await getDocs(query(collection(db, 'users'), where('department', '==', name)))
                await updateDoc(doc(db, 'departments', d.id), { employees: usersSnap.size })
            }

            setDone(true)
            setStatus('Completed')
            setProgress('All data has been successfully seeded!')
        } catch (e: any) {
            setStatus('Error')
            setProgress(`Error: ${e?.message || 'Unknown error occurred'}`)
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Enhanced HRMS Data Seeder</h1>
                <p className="text-sm text-gray-600 mt-2">
                    This tool will create comprehensive demo data for all HRMS features, working with your existing database.
                </p>
            </div>

            <div className="bg-white rounded-lg border p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Database Collections</h2>
                    <span className="text-sm text-gray-500">Will be created/updated</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                        <div className="font-medium text-gray-700">Existing Collections:</div>
                        <div className="text-gray-600">• users</div>
                        <div className="text-gray-600">• departments</div>
                        <div className="text-gray-600">• jobs</div>
                        <div className="text-gray-600">• candidates</div>
                        <div className="text-gray-600">• interviews</div>
                        <div className="text-gray-600">• leaves</div>
                        <div className="text-gray-600">• offers</div>
                    </div>
                    <div className="space-y-1">
                        <div className="font-medium text-gray-700">New Collections:</div>
                        <div className="text-blue-600">• applications</div>
                        <div className="text-blue-600">• candidateProfiles</div>
                        <div className="text-blue-600">• profiles</div>
                        <div className="text-blue-600">• feedbacks</div>
                        <div className="text-blue-600">• managerFeedbacks</div>
                        <div className="text-blue-600">• performance</div>
                        <div className="text-blue-600">• attendance</div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <button
                    onClick={seed}
                    disabled={status === 'Seeding...'}
                    className="w-full px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {status === 'Seeding...' ? 'Seeding Data...' : 'Start Seeding Process'}
                </button>

                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Status:</span>
                        <span className={`font-medium ${status === 'Completed' ? 'text-green-600' : status === 'Error' ? 'text-red-600' : 'text-blue-600'}`}>
                            {status}
                        </span>
                    </div>

                    {progress && (
                        <div className="text-sm text-gray-600 bg-white rounded p-2 border">
                            <span className="font-medium">Progress:</span> {progress}
                        </div>
                    )}

                    {done && (
                        <div className="text-green-600 text-sm font-medium bg-green-50 rounded p-3 border border-green-200">
                            ✅ All data has been successfully seeded! You can now browse all dashboard features.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Notes:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• This tool works with your existing data and won't overwrite existing records</li>
                    <li>• Only creates data for collections that are empty</li>
                    <li>• Ensures referential integrity between collections</li>
                    <li>• Creates realistic sample data for testing all features</li>
                </ul>
            </div>
        </main>
    )
}


