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
                        <p className="text-3xl font-bold text-blue-500">{interviews.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                        <p className="text-3xl font-bold text-purple-500">{interviews.filter(i => i.status === 'created').length}</p>
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
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-orange-100 border border-orange-200">
                                        <Calendar className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{interview.jobTitle}</h3>
                                        <p className="text-sm text-gray-600 mb-2">Our Company</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Scheduled: {formatDate(interview.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                AI Interview Bot
                                            </span>
                                        </div>
                                        {interview.status === 'pending_creation' && (
                                            <p className="text-sm text-yellow-600 mt-2 bg-yellow-50 p-2 rounded">
                                                Your interview is being prepared. You will receive details soon.
                                            </p>
                                        )}
                                        {interview.status === 'created' && (
                                            <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                Interview code has been sent to your email. Please check your inbox.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-3">
                                    {getStatusBadge(interview.status)}
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="outline" className="border-gray-300">
                                            <span className="hidden sm:inline">View Details</span>
                                            <span className="sm:hidden">Details</span>
                                        </Button>
                                    </div>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Before the Interview</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Research the company and role</li>
                            <li>• Prepare your questions</li>
                            <li>• Test your technology (for video calls)</li>
                            <li>• Dress professionally</li>
                        </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">During the Interview</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                            <li>• Be confident and authentic</li>
                            <li>• Listen carefully to questions</li>
                            <li>• Provide specific examples</li>
                            <li>• Ask thoughtful questions</li>
                        </ul>
                    </div>
                </div>
            </GlassCard>
            </div>
        </DashboardLayout>
    )
}