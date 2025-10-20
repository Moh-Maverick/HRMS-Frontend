"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getIdToken } from 'firebase/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function NewJobPage() {
    const { user, role } = useAuth()
    const router = useRouter()
    const [form, setForm] = useState({
        title: '',
        department: '',
        experience: '',
        location: '',
        employment_type: 'Full-time',
        skills: '',
        responsibilities: '',
        openings: 1,
        additional_notes: '',
    })
    const [loading, setLoading] = useState(false)
    const isHR = role === 'hr'

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
    }

    const submit = async () => {
        if (!user || !isHR) return
        setLoading(true)
        try {
            const idToken = await getIdToken(auth.currentUser!, true)
            const backend = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8000').replace(/\/$/, '')
            const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
            const responsibilities = form.responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
            const jdPayload = {
                role: form.title,
                department: form.department || undefined,
                experience: form.experience || undefined,
                skills: skills.length ? skills : undefined,
                location: form.location || undefined,
                employment_type: form.employment_type || undefined,
                responsibilities: responsibilities.length ? responsibilities : undefined,
                company: undefined,
                additional_notes: form.additional_notes || undefined,
            }
            const res = await fetch(`${backend}/jd/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify(jdPayload),
            })
            if (!res.ok) throw new Error('JD generation failed')
            const jd = await res.json()

            // Create job record in Firestore with JD linkage
            const jobId = crypto.randomUUID()
            await setDoc(doc(db, 'jobs', jobId), {
                id: jobId,
                title: form.title,
                department: form.department,
                openings: Number(form.openings) || 1,
                status: 'Open',
                jdId: jd.id,
                jdTitle: jd.title,
                jdText: jd.metadata.jd_text,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            })

            router.push('/dashboard/hr/jobs')
        } catch (e) {
            console.error(e)
            alert('Failed to create job/JD. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!isHR) {
        return <div className="p-6 text-slate-200">Only HR can create jobs.</div>
    }

    return (
        <div className="p-6 max-w-3xl text-slate-100">
            <h1 className="text-xl font-semibold mb-4">Add Job & Generate JD</h1>

            <div className="grid gap-4">
                <div>
                    <Label className="text-slate-300">Title</Label>
                    <Input name="title" value={form.title} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-slate-300">Department</Label>
                        <Input name="department" value={form.department} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                    </div>
                    <div>
                        <Label className="text-slate-300">Experience</Label>
                        <Input name="experience" value={form.experience} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-slate-300">Location</Label>
                        <Input name="location" value={form.location} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                    </div>
                    <div>
                        <Label className="text-slate-300">Employment Type</Label>
                        <Input name="employment_type" value={form.employment_type} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                    </div>
                </div>
                <div>
                    <Label className="text-slate-300">Skills (comma separated)</Label>
                    <Input name="skills" value={form.skills} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                </div>
                <div>
                    <Label className="text-slate-300">Responsibilities (one per line)</Label>
                    <Textarea name="responsibilities" value={form.responsibilities} onChange={onChange} className="bg-slate-800 border-blue-400/20 min-h-[120px]" />
                </div>
                <div>
                    <Label className="text-slate-300">Additional Notes</Label>
                    <Textarea name="additional_notes" value={form.additional_notes} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                </div>
                <div>
                    <Label className="text-slate-300">Openings</Label>
                    <Input name="openings" type="number" value={String(form.openings)} onChange={onChange} className="bg-slate-800 border-blue-400/20" />
                </div>
                <div className="flex gap-3">
                    <Button onClick={submit} disabled={loading || !form.title} className="bg-orange-500 hover:bg-orange-600 text-white">
                        {loading ? 'Generating JD...' : 'Create Job & Generate JD'}
                    </Button>
                    <Button variant="ghost" onClick={() => router.push('/dashboard/hr/jobs')} className="text-slate-300">Cancel</Button>
                </div>
            </div>
        </div>
    )
}


