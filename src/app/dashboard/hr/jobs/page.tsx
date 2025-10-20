"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Briefcase, Plus, MapPin, Clock, Users } from 'lucide-react'
import JDModal from '@/components/JDModal'

export default function HRJobsPage() {
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedJob, setSelectedJob] = useState<any | null>(null)
    const [showJDModal, setShowJDModal] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const snap = await getDocs(collection(db, 'jobs'))
                setJobs(snap.docs.map(d => d.data()))
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const handleViewJD = (job: any) => {
        setSelectedJob(job)
        setShowJDModal(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading jobs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl p-6 text-slate-100">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Job Postings</h2>
                    <p className="text-slate-400">Create and manage job listings</p>
                </div>
                <Link href="/dashboard/hr/jobs/new">
                    <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4" />
                        Add Job
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">Active Jobs</p>
                        <p className="text-3xl font-bold text-orange-400">{jobs.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">Total Applicants</p>
                        <p className="text-3xl font-bold">145</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">This Week</p>
                        <p className="text-3xl font-bold">38</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">Avg Time to Fill</p>
                        <p className="text-3xl font-bold text-green-400">18d</p>
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-4">
                {jobs.map((j, index) => (
                    <GlassCard key={j.id || index} delay={0.3 + index * 0.05}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <Briefcase className="h-6 w-6 text-orange-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-1">{j.title}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            {j.department || 'General'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {j.location || 'Remote'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {j.type || 'Full-time'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {j.openings || 1} openings
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{j.status || 'Open'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {j.jdText && (
                                    <Button
                                        onClick={() => handleViewJD(j)}
                                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white"
                                    >
                                        View JD
                                    </Button>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <JDModal
                job={selectedJob}
                isOpen={showJDModal}
                onClose={() => setShowJDModal(false)}
            />
        </div>
    )
}
