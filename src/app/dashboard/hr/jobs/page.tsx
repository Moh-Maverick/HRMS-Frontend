"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Briefcase, Plus, MapPin, Clock, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetJobs } from '@/lib/firestoreApi'

export default function HRJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobsData = await fsGetJobs()
                setJobs(jobsData)
            } catch (error) {
                console.error('Error fetching jobs:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchJobs()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading jobs...</p>
                </div>
            </div>
        )
  }

  return (
        <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Job Postings</h2>
                    <p className="text-muted-foreground">Create and manage job listings</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Job
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Active Jobs</p>
                        <p className="text-3xl font-bold text-accent">{jobs.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Applicants</p>
                        <p className="text-3xl font-bold text-foreground">145</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">This Week</p>
                        <p className="text-3xl font-bold text-secondary">38</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Avg Time to Fill</p>
                        <p className="text-3xl font-bold text-green-400">18d</p>
                    </div>
                </GlassCard>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
                {jobs.map((job, index) => (
                    <GlassCard key={index} delay={0.3 + index * 0.05}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                                    <Briefcase className="h-6 w-6 text-accent" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            {job.department || 'General'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {job.location || 'Remote'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {job.type || 'Full-time'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {job.applicants || 0} applicants
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Posted {job.posted || 'Recently'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="border-glass-border">
                                    View Applicants
                                </Button>
                                <Button>Edit Job</Button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
          </div>
    </div>
  )
}