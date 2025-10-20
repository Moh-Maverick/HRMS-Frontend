"use client"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Video, MapPin, Users, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetCandidateInterviews } from '@/lib/firestoreApi'

const upcomingInterviews = [
    {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Developer',
        date: 'Jan 18, 2025',
        time: '2:00 PM',
        type: 'Technical Interview',
        mode: 'Video Call',
        interviewer: 'John Manager',
        status: 'scheduled',
        meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Engineer',
        date: 'Jan 20, 2025',
        time: '10:00 AM',
        type: 'HR Interview',
        mode: 'In-person',
        interviewer: 'Sarah HR',
        status: 'scheduled',
        location: '123 Main St, Bangalore'
    },
    {
        id: '3',
        company: 'Design Studio',
        position: 'UI Designer',
        date: 'Jan 15, 2025',
        time: '3:00 PM',
        type: 'Design Review',
        mode: 'Video Call',
        interviewer: 'Mike Designer',
        status: 'completed',
        meetingLink: 'https://meet.google.com/xyz-uvw-rst'
    }
]

export default function CandidateInterviewsPage() {
    const [interviews, setInterviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const interviewsData = await fsGetCandidateInterviews()
                setInterviews(interviewsData.length > 0 ? interviewsData : upcomingInterviews)
            } catch (error) {
                console.error('Error fetching interviews:', error)
                setInterviews(upcomingInterviews)
            } finally {
                setLoading(false)
            }
        }
        fetchInterviews()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return <Clock className="h-4 w-4" />
            case 'completed':
                return <CheckCircle className="h-4 w-4" />
            case 'cancelled':
                return <Calendar className="h-4 w-4" />
            default:
                return <Calendar className="h-4 w-4" />
        }
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
                        <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                        <p className="text-3xl font-bold text-blue-500">{interviews.filter(i => i.status === 'scheduled').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-500">{interviews.filter(i => i.status === 'completed').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">This Week</p>
                        <p className="text-3xl font-bold text-orange-500">2</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                        <p className="text-3xl font-bold text-purple-500">75%</p>
                    </div>
                </GlassCard>
            </div>

            {/* Upcoming Interviews */}
            <GlassCard delay={0.3}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Interviews</h3>
                <div className="space-y-4">
                    {interviews.filter(i => i.status === 'scheduled').length > 0 ? (
                        interviews.filter(i => i.status === 'scheduled').map((interview, index) => (
                            <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-lg">{interview.position}</h4>
                                                <p className="text-sm text-gray-600">{interview.company}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                                                {getStatusIcon(interview.status)}
                                                {interview.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4 text-orange-500" />
                                                <span>{interview.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="h-4 w-4 text-orange-500" />
                                                <span>{interview.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="h-4 w-4 text-orange-500" />
                                                <span>{interview.interviewer}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                {interview.mode === 'Video Call' ? (
                                                    <><Video className="h-4 w-4 text-orange-500" /><span>{interview.mode}</span></>
                                                ) : (
                                                    <><MapPin className="h-4 w-4 text-orange-500" /><span>{interview.mode}</span></>
                                                )}
                                            </div>
                                        </div>

                                        {interview.type && (
                                            <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border">
                                                <strong>Type:</strong> {interview.type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {interview.mode === 'Video Call' && interview.meetingLink && (
                                            <Button
                                                className="gap-2 bg-orange-500 hover:bg-orange-600"
                                                onClick={() => window.open(interview.meetingLink, '_blank')}
                                            >
                                                <Video className="h-4 w-4" />
                                                Join Call
                                            </Button>
                                        )}
                                        <Button variant="outline" className="border-gray-300">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No upcoming interviews</p>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Interview History */}
            <GlassCard delay={0.4}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview History</h3>
                <div className="space-y-3">
                    {interviews.filter(i => i.status === 'completed').length > 0 ? (
                        interviews.filter(i => i.status === 'completed').map((interview, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{interview.position}</p>
                                        <p className="text-sm text-gray-600">{interview.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">{interview.date}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(interview.status)}`}>
                                        {interview.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No completed interviews yet</p>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Interview Tips */}
            <GlassCard delay={0.5}>
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
