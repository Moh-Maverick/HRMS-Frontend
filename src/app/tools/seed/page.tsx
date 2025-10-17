"use client"
import { addDoc, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useMemo, useState } from 'react'

export default function SeedPage() {
    const [status, setStatus] = useState<string>('Idle')
    const [done, setDone] = useState(false)

    const departments = useMemo(() => [
        { name: 'Engineering', head: 'Neeraj Sharma' },
        { name: 'Sales', head: 'Pooja Gupta' },
        { name: 'HR', head: 'Carol HR' },
        { name: 'Support', head: 'Ravi Iyer' },
        { name: 'Finance', head: 'Anita Menon' },
    ], [])

    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Muhammad', 'Sai', 'Arnav', 'Ayaan', 'Ishaan', 'Kabir', 'Krishna', 'Ritvik', 'Rohan', 'Neha', 'Ananya', 'Isha', 'Aditi', 'Diya', 'Saanvi', 'Anika', 'Ira', 'Navya', 'Kiara', 'Meera', 'Sara', 'Riya', 'Myra']
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Agarwal', 'Patel', 'Shah', 'Iyer', 'Menon', 'Rao', 'Nair', 'Reddy', 'Jain', 'Kapoor', 'Khanna', 'Bose', 'Mukherjee', 'Chopra', 'Malhotra']
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const genName = () => `${pick(firstNames)} ${pick(lastNames)}`

    async function seed() {
        try {
            setStatus('Seeding...')
            // Create departments (employees will be recalculated below)
            for (const d of departments) await addDoc(collection(db, 'departments'), { ...d, employees: 0 })

            // Desired headcount per department (adjust freely for demo scale)
            const desired: Record<string, number> = { Engineering: 50, Sales: 25, HR: 12, Support: 18, Finance: 10 }

            // Seed users (mix of employees and some managers/hr)
            for (const deptName of Object.keys(desired)) {
                const count = desired[deptName]
                for (let i = 0; i < count; i++) {
                    const role = deptName === 'HR' ? (i % 5 === 0 ? 'hr' : 'employee') : (i % 15 === 0 ? 'manager' : 'employee')
                    const name = genName()
                    const email = `${name.toLowerCase().replace(/\s+/g, '\.')}@fwc.co.in`
                    await addDoc(collection(db, 'users'), { name, email, role, department: deptName })
                }
            }

            // Create jobs per department
            const jobTitles: Record<string, string[]> = {
                Engineering: ['Frontend Engineer', 'Backend Engineer', 'QA Analyst', 'DevOps Engineer', 'Data Engineer'],
                Sales: ['Sales Executive', 'Account Manager', 'Sales Analyst'],
                HR: ['Recruiter', 'HR Generalist', 'HR Operations'],
                Support: ['Support Engineer', 'Customer Success', 'Technical Support'],
                Finance: ['Accountant', 'Payroll Specialist', 'Financial Analyst'],
            }
            for (const deptName of Object.keys(jobTitles)) {
                for (const title of jobTitles[deptName]) {
                    await addDoc(collection(db, 'jobs'), { title, openings: Math.ceil(Math.random() * 3), status: 'Open', department: deptName })
                }
            }

            // Seed a bunch of candidates mapped to random jobs (simple, not strict referential mapping)
            const jobsSnap = await getDocs(collection(db, 'jobs'))
            const jobIds = jobsSnap.docs.map((d) => d.id)
            for (let i = 0; i < 60; i++) {
                const name = genName()
                const jobId = jobIds[Math.floor(Math.random() * jobIds.length)]
                const status = ['Screening', 'Interview', 'Offer', 'Rejected'][Math.floor(Math.random() * 4)]
                const score = Math.round((0.6 + Math.random() * 0.4) * 100) / 100
                await addDoc(collection(db, 'candidates'), { name, jobId, status, score })
            }

            // Offers, interviews, and leaves in bulk
            for (let i = 0; i < 20; i++) {
                const candName = genName()
                await addDoc(collection(db, 'offers'), { candidate: candName, role: 'Engineer', status: ['Sent', 'Accepted', 'Declined'][Math.floor(Math.random() * 3)] })
            }
            for (let i = 0; i < 30; i++) {
                await addDoc(collection(db, 'interviews'), { candidate: genName(), date: new Date(Date.now() + i * 3600_000).toISOString(), interviewer: genName() })
            }
            for (let i = 0; i < 40; i++) {
                await addDoc(collection(db, 'leaves'), { employee: genName(), days: 1 + Math.floor(Math.random() * 3), reason: ['Medical', 'Personal', 'Vacation'][Math.floor(Math.random() * 3)], status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] })
            }

            // Recalculate employees count on departments from users collection (accurate figures)
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
        } catch (e: any) {
            setStatus(e?.message || 'Error')
        }
    }

    return (
        <main className="max-w-xl mx-auto p-6 space-y-4">
            <h1 className="text-xl font-semibold">Seed Demo Data</h1>
            <p className="text-sm text-gray-600">Click to write sample documents into Firestore (requires valid Firebase config).</p>
            <button onClick={seed} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Seed Demo Data</button>
            <div className="text-sm">Status: {status}</div>
            {done && <div className="text-emerald-600 text-sm">Done. You can now browse dashboards.</div>}
        </main>
    )
}


