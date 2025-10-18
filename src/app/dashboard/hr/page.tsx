"use client"

import { StatsCard } from "@/components/dashboard/StatsCard"
import { GlassCard } from "@/components/dashboard/GlassCard"
import { Briefcase, Users, Calendar, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fsGetJobs, fsGetCandidates } from '@/lib/firestoreApi'

const candidateStageData = [
    { name: 'Applied', value: 45, color: '#3B82F6' },
    { name: 'Screening', value: 28, color: '#F59E0B' },
    { name: 'Interview', value: 18, color: '#10B981' },
    { name: 'Offer', value: 9, color: '#EF4444' },
]

const upcomingInterviews = [
    { candidate: 'John Doe', position: 'Senior Developer', time: '10:00 AM', date: 'Today' },
    { candidate: 'Jane Smith', position: 'UI Designer', time: '2:00 PM', date: 'Today' },
    { candidate: 'Mike Johnson', position: 'Product Manager', time: '11:00 AM', date: 'Tomorrow' },
]

export default function HRDashboard() {
    const router = useRouter()
    const [jobs, setJobs] = useState<any[]>([])
    const [candidates, setCandidates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const handleCreateJob = () => {
        router.push('/dashboard/hr/jobs')
    }

    const handleViewCandidates = () => {
        router.push('/dashboard/hr/candidates')
    }

    const handleScheduleInterview = () => {
        router.push('/dashboard/hr/interviews')
    }

    const handleSendOffer = () => {
        router.push('/dashboard/hr/offers')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsData, candidatesData] = await Promise.all([
                    fsGetJobs(),
                    fsGetCandidates()
                ])
                setJobs(jobsData)
                setCandidates(candidatesData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">HR Dashboard</h2>
                <p className="text-muted-foreground">Manage recruitment and candidate tracking</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Briefcase}
                    title="Active Jobs"
                    value={jobs.length}
                    subtitle="Open positions"
                    trend={{ value: 3, isPositive: true }}
                    delay={0}
                />
                <StatsCard
                    icon={Users}
                    title="Total Candidates"
                    value={candidates.length}
                    subtitle="In pipeline"
                    trend={{ value: 8, isPositive: true }}
                    delay={0.1}
                />
                <StatsCard
                    icon={Calendar}
                    title="Interviews Scheduled"
                    value="23"
                    subtitle="This week"
                    delay={0.2}
                />
                <StatsCard
                    icon={CheckCircle}
                    title="Offers Sent"
                    value="9"
                    subtitle="Pending acceptance"
                    delay={0.3}
                />
            </div>

            {/* Candidate Pipeline & Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.4}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Candidate Pipeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={candidateStageData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {candidateStageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                    border: '2px solid #F7A800',
                                    borderRadius: '12px',
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    padding: '12px 16px',
                                    boxShadow: '0 8px 32px rgba(247, 168, 0, 0.3)'
                                }}
                                labelStyle={{
                                    color: '#F7A800',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                                formatter={(value, name) => [value, name]}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </GlassCard>

                <GlassCard delay={0.5}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">Upcoming Interviews</h3>
                        <Button variant="outline" size="sm" className="border-glass-border">
                            View All
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {upcomingInterviews.map((interview, index) => (
                            <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-foreground">{interview.candidate}</p>
                                        <p className="text-sm text-muted-foreground">{interview.position}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold">
                                        {interview.date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{interview.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Job Listings */}
            <GlassCard delay={0.6}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Active Job Listings</h3>
                    <Button className="gap-2" onClick={handleCreateJob}>
                        <Briefcase className="h-4 w-4" />
                        Create New Job
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.slice(0, 4).map((job, index) => (
                        <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-primary/50 transition-all cursor-pointer">
                            <h4 className="font-semibold text-foreground mb-2">{job.title}</h4>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{job.department || 'General'}</span>
                                <span className="text-accent font-semibold">{job.openings} openings</span>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard delay={0.7}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleCreateJob}>
                        <Briefcase className="h-5 w-5" />
                        <span className="text-sm">Post Job</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleScheduleInterview}>
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">Schedule Interview</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleSendOffer}>
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm">Send Offer</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleViewCandidates}>
                        <Users className="h-5 w-5" />
                        <span className="text-sm">View Candidates</span>
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}


