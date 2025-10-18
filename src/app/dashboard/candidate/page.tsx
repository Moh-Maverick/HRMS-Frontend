"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/ui/stats-card"
import { GlassCard } from "@/components/ui/glass-card"
import { User, Briefcase, Calendar, CheckCircle, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'

const applicationStatus = [
    { company: 'TechCorp Inc.', position: 'Senior Developer', status: 'Interview Scheduled', date: 'Dec 28, 2024' },
    { company: 'StartupXYZ', position: 'Full Stack Engineer', status: 'Under Review', date: 'Dec 25, 2024' },
    { company: 'BigTech Co.', position: 'Frontend Developer', status: 'Application Submitted', date: 'Dec 22, 2024' },
]

const upcomingInterviews = [
    { company: 'TechCorp Inc.', position: 'Senior Developer', time: '2:00 PM', date: 'Today', type: 'Technical Interview' },
    { company: 'StartupXYZ', position: 'Full Stack Engineer', time: '10:00 AM', date: 'Tomorrow', type: 'HR Interview' },
]

export default function CandidateDashboard() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000)
    }, [])

    if (loading) {
        return (
            <DashboardLayout userRole="candidate" userName="Candidate Name">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="candidate" userName="Candidate Name">
            <div className="space-y-6 max-w-7xl">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Candidate Dashboard</h2>
                    <p className="text-gray-600">Track your job applications and interview progress</p>
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

                {/* Application Status & Upcoming Interviews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard delay={0.4}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Application Status</h3>
                            <Button variant="outline" size="sm" className="border-gray-300">
                                View All
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {applicationStatus.map((app, index) => (
                                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">{app.company}</p>
                                            <p className="text-sm text-gray-600">{app.position}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{app.date}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard delay={0.5}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h3>
                            <Button variant="outline" size="sm" className="border-gray-300">
                                View All
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {upcomingInterviews.map((interview, index) => (
                                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{interview.company}</p>
                                            <p className="text-sm text-gray-600">{interview.position}</p>
                                            <p className="text-xs text-gray-500">{interview.type}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                            {interview.date}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">{interview.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Profile Completion */}
                <GlassCard delay={0.6}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Profile Completion</h3>
                        <Button variant="outline" className="border-gray-300">
                            Edit Profile
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Personal Information</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">100%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Work Experience</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">85%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Skills & Certifications</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">60%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Portfolio</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                                <span className="text-sm text-gray-600">30%</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Quick Actions */}
                <GlassCard delay={0.7}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="h-auto py-4 flex-col gap-2">
                            <Briefcase className="h-5 w-5" />
                            <span className="text-sm">Apply for Jobs</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300">
                            <User className="h-5 w-5" />
                            <span className="text-sm">Update Profile</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300">
                            <FileText className="h-5 w-5" />
                            <span className="text-sm">Upload Resume</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300">
                            <Calendar className="h-5 w-5" />
                            <span className="text-sm">View Schedule</span>
                        </Button>
                    </div>
                </GlassCard>
            </div>
        </DashboardLayout>
    )
}