"use client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, MapPin, Users, CheckCircle, ExternalLink, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetCandidateInterviews } from '@/lib/firestoreApi'
import { auth } from '@/lib/firebase'

export default function CandidateInterviewsPage() {
    const [interviews, setInterviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const user = auth.currentUser
        if (!user) {
            setLoading(false)
            return
        }

        const fetchInterviews = async () => {
            try {
                const interviewsData = await fsGetCandidateInterviews(user.uid)
                setInterviews(interviewsData)
            } catch (error) {
                console.error('Error fetching interviews:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInterviews()
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_creation':
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
            case 'created':
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Video className="h-3 w-3 mr-1" />Scheduled</Badge>
            case 'completed':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
            default:
                return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
        }
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <DashboardLayout userRole="candidate" userName="Candidate Name">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading interviews...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="candidate" userName="Candidate Name">
            <div className="space-y-6 w-full">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Interviews</h2>
                    <p className="text-gray-600">Track your interview schedule and history</p>
                </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Interviews</p>
                        <p className="text-3xl font-bold text-orange-500">{interviews.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                        <p className="text-3xl font-bold text-blue-500">{interviews.filter(i => i.status === 'created').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-500">{interviews.filter(i => i.status === 'pending_creation').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-500">{interviews.filter(i => i.status === 'completed').length}</p>
                    </div>
                </GlassCard>
            </div>

            {/* Interview List */}
            <div className="space-y-4">
                {interviews.length > 0 ? (
                    interviews.map((interview, index) => (
                        <GlassCard key={interview.id} delay={0.3 + index * 0.05}>
                            <div className="space-y-4">
                                {/* Header Section */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-orange-100 border border-orange-200">
                                            <Calendar className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{interview.jobTitle}</h3>
                                            <p className="text-sm text-gray-600">Our Company</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(interview.status)}
                                </div>

                                {/* Details Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-16">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-orange-500" />
                                            <span>Scheduled: {formatDate(interview.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="h-4 w-4 text-orange-500" />
                                            <span>AI Interview Bot</span>
                                        </div>
                                    </div>
                                    
                                    {/* Status Messages */}
                                    <div className="md:col-span-1">
                                        {interview.status === 'pending_creation' && (
                                            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                                <p className="text-sm text-yellow-800">
                                                    Your interview is being prepared. You will receive details soon.
                                                </p>
                                            </div>
                                        )}
                                        {interview.status === 'created' && (
                                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                    <p className="text-sm text-blue-800">
                                                        Interview code sent to your email
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="flex justify-end pt-2 border-t border-gray-100">
                                    <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                                        <span className="hidden sm:inline">View Details</span>
                                        <span className="sm:hidden">Details</span>
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <GlassCard delay={0.3}>
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">No interviews scheduled</p>
                            <p className="text-sm text-gray-500">Interviews will appear here once HR schedules them</p>
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* Interview Tips */}
            <GlassCard delay={0.4}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                        <Video className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Interview Tips</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-orange-50 border border-orange-200">
                        <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Before the Interview
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-600 mt-1">•</span>
                                <span>Research the company and role thoroughly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-600 mt-1">•</span>
                                <span>Prepare thoughtful questions to ask</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-600 mt-1">•</span>
                                <span>Test your technology and internet connection</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-600 mt-1">•</span>
                                <span>Dress professionally and find a quiet space</span>
                            </li>
                        </ul>
                    </div>
                    <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            During the Interview
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Be confident, authentic, and enthusiastic</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Listen carefully and ask for clarification</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Provide specific examples from your experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Ask thoughtful questions about the role</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </GlassCard>
            </div>
        </DashboardLayout>
    )
}