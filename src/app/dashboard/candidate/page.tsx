"use client"

import { StatsCard } from '@/components/dashboard/StatsCard'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { User, Briefcase, Calendar, CheckCircle, Clock, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { fsSubscribeToCandidateApplications } from '@/lib/firestoreApi'

export default function CandidateDashboard() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [applications, setApplications] = useState<any[]>([])

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
        console.log('🔐 Dashboard - Current user:', user)
        console.log('⏳ Dashboard - Auth loading:', authLoading)
        
        if (authLoading) {
            console.log('⏳ Dashboard - Still loading auth...')
            return
        }
        
        if (!user) {
            console.log('❌ Dashboard - No authenticated user found')
            return
        }

        console.log('✅ Dashboard - Subscribing to applications for user:', user.uid)
        console.log('📧 Dashboard - User email:', user.email)
        
        // Subscribe to real-time updates
        const unsubscribe = fsSubscribeToCandidateApplications(user.uid, (apps) => {
            console.log('📥 Dashboard - Received applications:', apps)
            setApplications(apps)
        })

        return () => unsubscribe()
    }, [user, authLoading])

    if (authLoading) {
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
                    value={applications.length.toString()}
                    subtitle="Total submitted"
                    trend={{ value: 8, isPositive: true }}
                    delay={0}
                />
                <StatsCard
                    icon={Calendar}
                    title="Interviews"
                    value={applications.filter(app => app.interviewStatus).length.toString()}
                    subtitle="Scheduled"
                    delay={0.1}
                />
                <StatsCard
                    icon={CheckCircle}
                    title="Offers"
                    value={applications.filter(app => app.finalDecision === 'accepted').length.toString()}
                    subtitle="Received"
                    delay={0.2}
                />
                <StatsCard
                    icon={Clock}
                    title="Pending"
                    value={applications.filter(app => !app.finalDecision && !app.interviewStatus).length.toString()}
                    subtitle="Under review"
                    delay={0.3}
                />
            </div>

            {/* Application Status */}
            <GlassCard delay={0.4}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Application Status</h3>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-glass-border"
                        onClick={() => router.push('/dashboard/candidate/applications')}
                    >
                        View All
                    </Button>
                </div>
                <div className="space-y-3">
                    {applications.length > 0 ? (
                        applications.slice(0, 3).map((app, index) => {
                            const getStatusText = (application: any) => {
                                if (application.finalDecision === 'accepted') return 'Accepted'
                                if (application.finalDecision === 'rejected') return 'Rejected'
                                if (application.interviewStatus === 'created') return 'Interview Completed'
                                if (application.interviewStatus === 'scheduled') return 'Interview Scheduled'
                                if (application.screeningCompleted) return 'Under Review'
                                return 'Application Submitted'
                            }

                            const formatDate = (timestamp: number) => {
                                return new Date(timestamp).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })
                            }

                            return (
                                <div key={app.id || index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-foreground">{app.jobTitle || 'Job Position'}</p>
                                            <p className="text-sm text-muted-foreground">{app.candidateName || 'Candidate Name'}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-600">
                                            {getStatusText(app)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Applied: {formatDate(app.appliedAt)}
                                    </p>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-4">
                            <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No applications yet</p>
                            <Button 
                                size="sm" 
                                className="mt-2 bg-orange-500 hover:bg-orange-600"
                                onClick={handleApplyForJobs}
                            >
                                Apply for Jobs
                            </Button>
                        </div>
                    )}
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