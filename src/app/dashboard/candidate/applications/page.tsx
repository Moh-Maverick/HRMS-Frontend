"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Clock, Calendar, CheckCircle, XCircle, Eye, Brain, Video, ExternalLink, X, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { fsSubscribeToCandidateApplications } from '@/lib/firestoreApi'

export default function CandidateApplicationsPage() {
    const { user, loading: authLoading } = useAuth()
    const [applications, setApplications] = useState<any[]>([])
    const [selectedApplication, setSelectedApplication] = useState<any>(null)
    const [showApplicationModal, setShowApplicationModal] = useState(false)
    const [showInterviewModal, setShowInterviewModal] = useState(false)

    useEffect(() => {
        console.log('🔐 Applications - Current user:', user)
        console.log('⏳ Applications - Auth loading:', authLoading)
        
        if (authLoading) {
            console.log('⏳ Applications - Still loading auth...')
            return
        }
        
        if (!user) {
            console.log('❌ Applications - No authenticated user found')
            return
        }

        console.log('✅ Applications - Subscribing to applications for user:', user.uid)
        console.log('📧 Applications - User email:', user.email)
        
        // Subscribe to real-time updates
        const unsubscribe = fsSubscribeToCandidateApplications(user.uid, (apps) => {
            console.log('📥 Applications - Received applications:', apps)
            setApplications(apps)
        })

        return () => unsubscribe()
    }, [user, authLoading])

    const handleViewDetails = (application: any) => {
        setSelectedApplication(application)
        setShowApplicationModal(true)
    }

    const handleInterviewInfo = (application: any) => {
        setSelectedApplication(application)
        setShowInterviewModal(true)
    }

    const getStatusBadge = (application: any) => {
        // Check final decision first
        if (application.finalDecision === 'accepted') {
            return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
        }
        if (application.finalDecision === 'rejected') {
            return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
        }

        // Check interview status
        if (application.interviewStatus === 'created') {
            return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30"><Video className="h-3 w-3 mr-1" />Interview Completed</Badge>
        }
        if (application.interviewStatus === 'scheduled') {
            return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><Calendar className="h-3 w-3 mr-1" />Interview Scheduled</Badge>
        }

        // Check screening status
        if (application.screeningCompleted && application.aiScore !== undefined) {
            return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Brain className="h-3 w-3 mr-1" />Screened</Badge>
        }

        // Default status
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Applied</Badge>
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (application: any) => {
        if (application.finalDecision === 'accepted') return 'bg-green-100'
        if (application.finalDecision === 'rejected') return 'bg-red-100'
        if (application.interviewStatus === 'created') return 'bg-orange-100'
        if (application.interviewStatus === 'scheduled') return 'bg-purple-100'
        if (application.screeningCompleted) return 'bg-blue-100'
        return 'bg-gray-100'
    }

    const getStatusIcon = (application: any) => {
        if (application.finalDecision === 'accepted') return <CheckCircle className="h-4 w-4 text-green-600" />
        if (application.finalDecision === 'rejected') return <XCircle className="h-4 w-4 text-red-600" />
        if (application.interviewStatus === 'created') return <Video className="h-4 w-4 text-orange-600" />
        if (application.interviewStatus === 'scheduled') return <Calendar className="h-4 w-4 text-purple-600" />
        if (application.screeningCompleted) return <Brain className="h-4 w-4 text-blue-600" />
        return <Clock className="h-4 w-4 text-gray-600" />
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading applications...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6 w-full">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">My Applications</h2>
                    <p className="text-gray-300">Track all your job applications and their status</p>
                </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-gray-300 mb-1">Total Applications</p>
                        <p className="text-3xl font-bold text-orange-500">{applications.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-300 mb-1">Screened</p>
                        <p className="text-3xl font-bold text-blue-500">{applications.filter(a => a.screeningCompleted).length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-gray-300 mb-1">Interviews</p>
                        <p className="text-3xl font-bold text-purple-500">{applications.filter(a => a.interviewStatus).length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-gray-300 mb-1">Accepted</p>
                        <p className="text-3xl font-bold text-green-500">{applications.filter(a => a.finalDecision === 'accepted').length}</p>
                    </div>
                </GlassCard>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map((app, index) => (
                        <GlassCard key={app.id || index} delay={0.3 + index * 0.05}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-orange-100 border border-orange-200">
                                        <Briefcase className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white">{app.jobTitle || 'Job Position'}</h3>
                                        <p className="text-sm text-gray-300 mb-2">{app.candidateName || 'Candidate Name'}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Applied on {formatDate(app.appliedAt)}
                                            </span>
                                            {app.aiScore && (
                                                <span className="flex items-center gap-1">
                                                    <Brain className="h-3 w-3" />
                                                    AI Score: {app.aiScore}%
                                                </span>
                                            )}
                                            {app.interviewStatus === 'scheduled' && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Interview Scheduled
                                                </span>
                                            )}
                                        </div>
                                        {app.decisionNotes && (
                                            <p className="text-sm text-gray-300 mt-2 bg-gray-800/50 p-2 rounded">
                                                {app.decisionNotes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-3">
                                    {getStatusBadge(app)}
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="outline" className="border-gray-300" onClick={() => handleViewDetails(app)}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            <span className="hidden sm:inline">View Details</span>
                                            <span className="sm:hidden">Details</span>
                                        </Button>
                                        {app.interviewStatus === 'scheduled' && (
                                            <Button size="sm" className="bg-purple-500 hover:bg-purple-600" onClick={() => handleInterviewInfo(app)}>
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">Interview Info</span>
                                                <span className="sm:hidden">Interview</span>
                                            </Button>
                                        )}
                                        {app.interviewStatus === 'created' && app.interviewBotUrl && (
                                            <Button 
                                                size="sm" 
                                                className="bg-orange-500 hover:bg-orange-600"
                                                onClick={() => window.open(app.interviewBotUrl, '_blank')}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">View Results</span>
                                                <span className="sm:hidden">Results</span>
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
                            <p className="text-gray-300 mb-2">No applications found</p>
                            <p className="text-sm text-gray-400 mb-4">Start applying to jobs to see your applications here</p>
                            <Button 
                                onClick={() => window.location.href = '/dashboard/candidate/jobs'}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                Browse Jobs
                            </Button>
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* Application Timeline */}
            {applications.length > 0 && (
                <GlassCard delay={0.4}>
                    <h3 className="text-xl font-semibold text-white mb-4">Application Timeline</h3>
                    <div className="space-y-3">
                        {applications.slice(0, 5).map((app, index) => (
                            <div key={app.id || index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(app)}`}>
                                    {getStatusIcon(app)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white">{app.jobTitle}</p>
                                    <p className="text-sm text-gray-300">{app.candidateName}</p>
                                </div>
                                {getStatusBadge(app)}
                                <span className="text-xs text-gray-400">{formatDate(app.appliedAt)}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}
            </div>
            
            {/* Modal Components */}
            <ApplicationDetailsModal 
                showModal={showApplicationModal} 
                application={selectedApplication} 
                onClose={() => setShowApplicationModal(false)} 
            />
            <InterviewDetailsModal 
                showModal={showInterviewModal} 
                application={selectedApplication} 
                onClose={() => setShowInterviewModal(false)} 
            />
        </>
    )
}

// Application Details Modal Component
function ApplicationDetailsModal({ showModal, application, onClose }: { showModal: boolean, application: any, onClose: () => void }) {
    if (!showModal || !application) return null

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">Application Details</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Job Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Job Information</h4>
                        <div className="space-y-2">
                            <p className="text-gray-300"><span className="font-medium">Position:</span> {application.jobTitle}</p>
                            <p className="text-gray-300"><span className="font-medium">Company:</span> {application.jobCompany}</p>
                            <p className="text-gray-300"><span className="font-medium">Applied:</span> {formatDate(application.appliedAt)}</p>
                        </div>
                    </div>

                    {/* Candidate Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Your Information</h4>
                        <div className="space-y-2">
                            <p className="text-gray-300"><span className="font-medium">Name:</span> {application.candidateName}</p>
                            <p className="text-gray-300"><span className="font-medium">Email:</span> {application.email}</p>
                            <p className="text-gray-300"><span className="font-medium">Phone:</span> {application.phone}</p>
                            <p className="text-gray-300"><span className="font-medium">Education:</span> {application.education}</p>
                            <p className="text-gray-300"><span className="font-medium">Experience:</span> {application.experience}</p>
                        </div>
                    </div>

                    {/* AI Screening Results */}
                    {application.aiScore && (
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-3">AI Screening Results</h4>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300"><span className="font-medium">AI Score:</span> {application.aiScore}%</p>
                                <p className="text-gray-300"><span className="font-medium">Screening Status:</span> {application.screeningCompleted ? 'Completed' : 'Pending'}</p>
                            </div>
                        </div>
                    )}

                    {/* Cover Letter */}
                    {application.coverLetter && (
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Cover Letter</h4>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300 whitespace-pre-wrap">{application.coverLetter}</p>
                            </div>
                        </div>
                    )}

                    {/* Decision Notes */}
                    {application.decisionNotes && (
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Decision Notes</h4>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300">{application.decisionNotes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Interview Details Modal Component  
function InterviewDetailsModal({ showModal, application, onClose }: { showModal: boolean, application: any, onClose: () => void }) {
    if (!showModal || !application) return null

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-lg w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">Interview Information</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-6">
                    {application.interviewStatus === 'created' ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="h-8 w-8 text-orange-500" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-2">Interview Details Sent</h4>
                                <p className="text-gray-300">
                                    Interview details have been sent to your email. Please check your inbox for instructions on how to complete the AI interview.
                                </p>
                            </div>
                            {application.interviewBotUrl && (
                                <Button 
                                    className="bg-orange-500 hover:bg-orange-600"
                                    onClick={() => window.open(application.interviewBotUrl, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Start Interview
                                </Button>
                            )}
                        </div>
                    ) : application.interviewStatus === 'scheduled' ? (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-8 w-8 text-purple-500" />
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">Interview Scheduled</h4>
                                <p className="text-gray-300">Your interview has been scheduled. You will receive further details via email.</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-gray-300"><span className="font-medium">Job:</span> {application.jobTitle}</p>
                                <p className="text-gray-300"><span className="font-medium">Company:</span> {application.jobCompany}</p>
                                <p className="text-gray-300"><span className="font-medium">Scheduled:</span> {formatDate(application.interviewCreatedAt)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-300">No interview information available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}