"use client"
import { GlassCard } from '@/components/ui/glass-card'
import { StatsCard } from '@/components/ui/stats-card'
import { Button } from '@/components/ui/button'
import { Video, Clock, Calendar, Users, Award, Play, Key } from 'lucide-react'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function CandidateInterviewPage() {
    const [tokens, setTokens] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [interviewData, setInterviewData] = useState<any>(null)

    useEffect(() => { 
        setTokens([{ id: 'tk1', value: 'ABC-123', expires: '2025-10-31' }])
        setInterviewData({
            scheduled: true,
            date: 'Jan 20, 2025',
            time: '2:00 PM',
            duration: '45 minutes',
            type: 'AI-Powered Technical Interview',
            company: 'TechCorp Inc.',
            position: 'Senior Developer'
        })
        setLoading(false)
    }, [])

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
                <h2 className="text-3xl font-bold text-foreground mb-2">AI Interview</h2>
                <p className="text-muted-foreground">Join your AI-powered interview session</p>
            </div>

            {/* Interview Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Calendar}
                    title="Interview Date"
                    value={interviewData?.date || 'TBD'}
                    subtitle="Scheduled date"
                    delay={0}
                />
                <StatsCard
                    icon={Clock}
                    title="Duration"
                    value={interviewData?.duration || '45 min'}
                    subtitle="Expected length"
                    delay={0.1}
                />
                <StatsCard
                    icon={Video}
                    title="Interview Type"
                    value="AI-Powered"
                    subtitle="Technical assessment"
                    delay={0.2}
                />
                <StatsCard
                    icon={Award}
                    title="Status"
                    value="Ready"
                    subtitle="Ready to join"
                    delay={0.3}
                />
            </div>

            {/* Interview Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.4}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                            <Video className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Interview Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-card/50 border border-glass-border">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-foreground">{interviewData?.position}</h4>
                                    <p className="text-sm text-muted-foreground">{interviewData?.company}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                                    Scheduled
                                </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-accent" />
                                    <span>{interviewData?.date} at {interviewData?.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-accent" />
                                    <span>Duration: {interviewData?.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-accent" />
                                    <span>Type: {interviewData?.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                            <h4 className="font-semibold text-accent mb-2">What to Expect</h4>
                            <ul className="text-sm text-accent/80 space-y-1">
                                <li>• AI will ask technical questions based on your role</li>
                                <li>• Questions will adapt based on your responses</li>
                                <li>• You'll have time to think and respond</li>
                                <li>• Session will be recorded for review</li>
                            </ul>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.5}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                            <Key className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Interview Tokens</h3>
                    </div>

                    <div className="space-y-4">
                        {tokens.map((token) => (
                            <div key={token.id} className="p-4 rounded-xl bg-card/50 border border-glass-border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-foreground">Token: {token.value}</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                                        Active
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">Expires: {token.expires}</p>
                            </div>
                        ))}

                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                            <h4 className="font-semibold text-accent mb-2">Before You Start</h4>
                            <ul className="text-sm text-accent/80 space-y-1">
                                <li>• Ensure stable internet connection</li>
                                <li>• Test your camera and microphone</li>
                                <li>• Find a quiet, well-lit environment</li>
                                <li>• Have your resume ready for reference</li>
                            </ul>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Join Interview */}
            <GlassCard delay={0.6}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                        <Play className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Ready to Start?</h3>
                </div>

                <div className="text-center py-8">
                    <div className="mb-6">
                        <Video className="h-16 w-16 text-accent mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-foreground mb-2">AI Interview Session</h4>
                        <p className="text-muted-foreground mb-4">
                            Your interview is scheduled for {interviewData?.date} at {interviewData?.time}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg" 
                            className="gap-2 bg-accent hover:bg-accent/90 px-8 py-3"
                            onClick={() => window.open('https://ai-interview-bot-seven.vercel.app/sign-in', '_blank')}
                        >
                            <Play className="h-5 w-5" />
                            Join Interview Now
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-glass-border hover:bg-accent hover:text-white hover:border-accent px-8 py-3"
                            onClick={() => {
                                // Handle test connection logic
                                alert('Testing your connection...')
                            }}
                        >
                            Test Connection
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4">
                        Make sure you're ready before joining. The interview will begin immediately.
                    </p>
                </div>
            </GlassCard>

            {/* Interview Tips */}
            <GlassCard delay={0.7}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                        <Award className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Interview Tips</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <h4 className="font-semibold text-accent mb-3">Technical Preparation</h4>
                        <ul className="text-sm text-accent/80 space-y-2">
                            <li>• Review common technical concepts for your role</li>
                            <li>• Practice explaining your thought process</li>
                            <li>• Be ready to discuss your past projects</li>
                            <li>• Prepare questions about the role and company</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <h4 className="font-semibold text-accent mb-3">Communication Tips</h4>
                        <ul className="text-sm text-accent/80 space-y-2">
                            <li>• Speak clearly and at a moderate pace</li>
                            <li>• Take time to think before answering</li>
                            <li>• Ask for clarification if needed</li>
                            <li>• Show enthusiasm and confidence</li>
                        </ul>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}


