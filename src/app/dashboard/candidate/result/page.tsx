"use client"
import { GlassCard } from '@/components/ui/glass-card'
import { StatsCard } from '@/components/ui/stats-card'
import { CheckCircle, XCircle, Clock, Star, MessageSquare, Award } from 'lucide-react'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function CandidateResultPage() {
    const [status, setStatus] = useState<string>('Loading...')
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState<any>(null)

    useEffect(() => {
        Api.getApplicationStatus().then((s: any) => {
            setStatus(s.status)
            setFeedback(s.feedback || null)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'accepted':
                return 'text-accent'
            case 'rejected':
                return 'text-red-500'
            case 'pending':
            case 'under review':
                return 'text-yellow-500'
            default:
                return 'text-muted-foreground'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'accepted':
                return <CheckCircle className="h-6 w-6 text-accent" />
            case 'rejected':
                return <XCircle className="h-6 w-6 text-red-500" />
            case 'pending':
            case 'under review':
                return <Clock className="h-6 w-6 text-yellow-500" />
            default:
                return <Clock className="h-6 w-6 text-muted-foreground" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Application Results</h2>
                <p className="text-muted-foreground">View your application status and feedback</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={CheckCircle}
                    title="Application Status"
                    value={status}
                    subtitle="Current status"
                    delay={0}
                />
                <StatsCard
                    icon={Star}
                    title="Overall Rating"
                    value="4.2/5"
                    subtitle="Based on interviews"
                    trend={{ value: 8, isPositive: true }}
                    delay={0.1}
                />
                <StatsCard
                    icon={MessageSquare}
                    title="Feedback Received"
                    value={feedback ? "Yes" : "No"}
                    subtitle="From interviewers"
                    delay={0.2}
                />
                <StatsCard
                    icon={Award}
                    title="Next Steps"
                    value="HR Review"
                    subtitle="In progress"
                    delay={0.3}
                />
            </div>

            {/* Application Status Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.4}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                            {getStatusIcon(status)}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Application Status</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-card/50 border border-glass-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Current Status</span>
                                <span className={`text-lg font-semibold ${getStatusColor(status)}`}>
                                    {status}
                                </span>
                            </div>
                            <div className="text-sm text-foreground">
                                {status.toLowerCase() === 'approved' &&
                                    "Congratulations! Your application has been approved. You will receive further instructions via email."
                                }
                                {status.toLowerCase() === 'rejected' &&
                                    "Thank you for your interest. Unfortunately, we cannot proceed with your application at this time."
                                }
                                {status.toLowerCase() === 'pending' &&
                                    "Your application is currently under review. We will update you as soon as possible."
                                }
                                {!['approved', 'rejected', 'pending'].includes(status.toLowerCase()) &&
                                    "Your application is being processed. Please check back for updates."
                                }
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground">Application Timeline</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                                    <span className="text-sm text-muted-foreground">Application Submitted</span>
                                    <span className="text-xs text-muted-foreground ml-auto">Jan 10, 2025</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                                    <span className="text-sm text-muted-foreground">Initial Review</span>
                                    <span className="text-xs text-muted-foreground ml-auto">Jan 12, 2025</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                                    <span className="text-sm text-muted-foreground">Interview Scheduled</span>
                                    <span className="text-xs text-muted-foreground ml-auto">Jan 15, 2025</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`h-2 w-2 rounded-full ${status.toLowerCase() === 'approved' ? 'bg-accent' : 'bg-yellow-500'}`}></div>
                                    <span className="text-sm text-muted-foreground">Final Decision</span>
                                    <span className="text-xs text-muted-foreground ml-auto">Jan 18, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.5}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                            <MessageSquare className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Interview Feedback</h3>
                    </div>

                    <div className="space-y-4">
                        {feedback ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                                    <h4 className="font-semibold text-accent mb-2">Technical Skills</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= 4 ? 'text-accent fill-current' : 'text-muted-foreground'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-accent/80">4/5</span>
                                    </div>
                                    <p className="text-sm text-accent/80">
                                        Strong technical foundation with good problem-solving skills.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                                    <h4 className="font-semibold text-accent mb-2">Communication</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= 5 ? 'text-accent fill-current' : 'text-muted-foreground'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-accent/80">5/5</span>
                                    </div>
                                    <p className="text-sm text-accent/80">
                                        Excellent communication skills and team collaboration.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                                    <h4 className="font-semibold text-accent mb-2">Overall Assessment</h4>
                                    <p className="text-sm text-accent/80">
                                        {feedback.overall || "Strong candidate with good potential. Recommended for the next round."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No feedback available yet</p>
                                <p className="text-sm text-muted-foreground">Feedback will be provided after interview completion</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Next Steps */}
            <GlassCard delay={0.6}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                        <Award className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Next Steps</h3>
                </div>

                <div className="space-y-4">
                    {status.toLowerCase() === 'approved' ? (
                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                            <h4 className="font-semibold text-accent mb-2">Congratulations! 🎉</h4>
                            <p className="text-sm text-accent/80 mb-3">
                                Your application has been approved! Here's what happens next:
                            </p>
                            <ul className="text-sm text-accent/80 space-y-1">
                                <li>• You will receive an official offer letter via email</li>
                                <li>• HR will contact you to discuss salary and benefits</li>
                                <li>• Background verification process will begin</li>
                                <li>• Onboarding schedule will be shared</li>
                            </ul>
                        </div>
                    ) : status.toLowerCase() === 'rejected' ? (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <h4 className="font-semibold text-red-500 mb-2">Application Update</h4>
                            <p className="text-sm text-red-500/80 mb-3">
                                Thank you for your interest in our company. While we cannot proceed with your application at this time, we encourage you to:
                            </p>
                            <ul className="text-sm text-red-500/80 space-y-1">
                                <li>• Apply for other open positions</li>
                                <li>• Keep your profile updated</li>
                                <li>• Consider reapplying in the future</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                            <h4 className="font-semibold text-accent mb-2">Application in Progress</h4>
                            <p className="text-sm text-accent/80 mb-3">
                                Your application is currently being reviewed. Here's what to expect:
                            </p>
                            <ul className="text-sm text-accent/80 space-y-1">
                                <li>• Final decision will be communicated within 2-3 business days</li>
                                <li>• You may be contacted for additional information</li>
                                <li>• Check your email regularly for updates</li>
                            </ul>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    )
}


