"use client"

import { StatsCard } from '@/components/dashboard/StatsCard'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { User, Briefcase, Calendar, CheckCircle, Clock, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const applicationStatus = [
    { company: 'TechCorp Inc.', position: 'Senior Developer', status: 'Interview Scheduled', date: 'Dec 28, 2024' },
    { company: 'StartupXYZ', position: 'Full Stack Engineer', status: 'Under Review', date: 'Dec 25, 2024' },
    { company: 'BigTech Co.', position: 'Frontend Developer', status: 'Application Submitted', date: 'Dec 22, 2024' },
]

export default function CandidateDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const handleApplyForJobs = () => {
        router.push('/dashboard/candidate/jobs')
    }

    const handleUpdateProfile = () => {
        router.push('/dashboard/candidate/profile')
    }

    const handleUploadResume = () => {
        router.push('/dashboard/candidate/profile')
    }

    const handleViewSchedule = () => {
        router.push('/dashboard/candidate/interviews')
    }

    const handleAIInterview = () => {
        router.push('/dashboard/candidate/interview')
    }

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Candidate Dashboard</h2>
                <p className="text-muted-foreground">Track your job applications and interview progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Briefcase}
                    title="Applications"
                    value="12"
                    subtitle="Total submitted"
                    trend={{ value: 8, isPositive: true }}
                    delay={0}
                />
                <StatsCard
                    icon={Calendar}
                    title="Interviews"
                    value="5"
                    subtitle="Scheduled"
                    delay={0.1}
                />
                <StatsCard
                    icon={CheckCircle}
                    title="Offers"
                    value="2"
                    subtitle="Received"
                    delay={0.2}
                />
                <StatsCard
                    icon={Clock}
                    title="Pending"
                    value="3"
                    subtitle="Under review"
                    delay={0.3}
                />
            </div>

            {/* Application Status */}
            <GlassCard delay={0.4}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Application Status</h3>
                    <Button variant="outline" size="sm" className="border-glass-border">
                        View All
                    </Button>
                </div>
                <div className="space-y-3">
                    {applicationStatus.map((app, index) => (
                        <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-foreground">{app.company}</p>
                                    <p className="text-sm text-muted-foreground">{app.position}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                                    {app.status}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{app.date}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Profile Completion & Job Recommendations */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <GlassCard delay={0.6} className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">Profile Completion</h3>
                        <Button variant="outline" className="border-glass-border">
                            Edit Profile
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Personal Information</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted/30 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <span className="text-sm text-muted-foreground">100%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Work Experience</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted/30 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <span className="text-sm text-muted-foreground">85%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Skills & Certifications</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted/30 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-sm text-muted-foreground">60%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Portfolio</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted/30 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                                <span className="text-sm text-muted-foreground">30%</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.65}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Job Recommendations</h3>
                    <div className="space-y-3">
                        {[
                            { title: 'Senior React Developer', match: '95%', salary: '₹12-18 LPA' },
                            { title: 'Full Stack Engineer', match: '88%', salary: '₹10-15 LPA' },
                            { title: 'Frontend Developer', match: '82%', salary: '₹8-12 LPA' },
                            { title: 'UI/UX Developer', match: '78%', salary: '₹9-14 LPA' },
                        ].map((job, index) => (
                            <div key={index} className="p-3 rounded-lg bg-muted/30 border border-glass-border hover:border-accent transition-all cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{job.title}</p>
                                        {/* <p className="text-xs text-muted-foreground">{job.company}</p> */}
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-400">
                                        {job.match}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{job.salary}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard delay={0.7}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleApplyForJobs}>
                        <Briefcase className="h-5 w-5" />
                        <span className="text-sm">Apply for Jobs</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleUpdateProfile}>
                        <User className="h-5 w-5" />
                        <span className="text-sm">Update Profile</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleUploadResume}>
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Upload Resume</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleViewSchedule}>
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">View Schedule</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleAIInterview}>
                        <Video className="h-5 w-5" />
                        <span className="text-sm">AI Interview</span>
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}