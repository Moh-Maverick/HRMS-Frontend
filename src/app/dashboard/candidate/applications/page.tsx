"use client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Briefcase, Clock, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetCandidateApplications } from '@/lib/firestoreApi'

export default function CandidateApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const applicationsData = await fsGetCandidateApplications()
                setApplications(applicationsData)
            } catch (error) {
                console.error('Error fetching applications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchApplications()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'interview scheduled':
                return 'bg-blue-100 text-blue-800'
            case 'under review':
                return 'bg-yellow-100 text-yellow-800'
            case 'applied':
                return 'bg-gray-100 text-gray-800'
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'interview scheduled':
                return <Calendar className="h-4 w-4" />
            case 'under review':
                return <Clock className="h-4 w-4" />
            case 'applied':
                return <Briefcase className="h-4 w-4" />
            case 'approved':
                return <CheckCircle className="h-4 w-4" />
            case 'rejected':
                return <XCircle className="h-4 w-4" />
            default:
                return <Briefcase className="h-4 w-4" />
        }
    }

    if (loading) {
        return (
            <DashboardLayout userRole="candidate" userName="Candidate Name">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading applications...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="candidate" userName="Candidate Name">
            <div className="space-y-6 w-full">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h2>
                    <p className="text-gray-600">Track all your job applications and their status</p>
                </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                        <p className="text-3xl font-bold text-orange-500">{applications.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Under Review</p>
                        <p className="text-3xl font-bold text-yellow-500">{applications.filter(a => a.status === 'Under Review').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Interviews</p>
                        <p className="text-3xl font-bold text-blue-500">{applications.filter(a => a.status === 'Interview Scheduled').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Offers</p>
                        <p className="text-3xl font-bold text-green-500">{applications.filter(a => a.status === 'Approved').length}</p>
                    </div>
                </GlassCard>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map((app, index) => (
                        <GlassCard key={index} delay={0.3 + index * 0.05}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-orange-100 border border-orange-200">
                                        <Briefcase className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{app.position || 'Job Position'}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{app.company || 'Company Name'}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Applied on {app.appliedDate || 'Recently'}
                                            </span>
                                            {app.interviewDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Interview: {app.interviewDate}
                                                </span>
                                            )}
                                        </div>
                                        {app.notes && (
                                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                                                {app.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-3">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                        {getStatusIcon(app.status)}
                                        {app.status || 'Applied'}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="border-gray-300">
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Details
                                        </Button>
                                        {app.status === 'Interview Scheduled' && (
                                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                                Join Interview
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <GlassCard delay={0.3}>
                        <div className="text-center py-8">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">No applications yet</p>
                            <p className="text-sm text-gray-500">Start applying to jobs to see your applications here</p>
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* Application Timeline */}
            {applications.length > 0 && (
                <GlassCard delay={0.4}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Timeline</h3>
                    <div className="space-y-3">
                        {applications.slice(0, 5).map((app, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${app.status === 'Approved' ? 'bg-green-100' :
                                        app.status === 'Interview Scheduled' ? 'bg-blue-100' :
                                            app.status === 'Under Review' ? 'bg-yellow-100' :
                                                'bg-gray-100'
                                    }`}>
                                    {getStatusIcon(app.status)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{app.position}</p>
                                    <p className="text-sm text-gray-600">{app.company}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
                                <span className="text-xs text-gray-500">{app.appliedDate}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}
            </div>
        </DashboardLayout>
    )
}
