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
    const [testing, setTesting] = useState(false)
    const [testResults, setTestResults] = useState<any>(null)

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

    // Runs a simple connectivity, latency and media device check
    const runConnectionTest = async () => {
        setTesting(true)
        setTestResults(null)

        const results: any = {
            online: typeof navigator !== 'undefined' ? navigator.onLine : false,
            latencyMs: null,
            camera: 'Unknown',
            microphone: 'Unknown'
        }

        // Measure latency by fetching a lightweight URL with a timeout
        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 5000)
            const start = performance.now()
            // Use a lightweight URL that returns 204 where possible
            await fetch('https://www.google.com/generate_204', { method: 'GET', signal: controller.signal })
            const end = performance.now()
            clearTimeout(timeout)
            results.latencyMs = Math.round(end - start)
        } catch (e) {
            results.latencyMs = null
        }

        // Check camera and microphone by requesting permissions / getUserMedia
        try {
            // Try Permissions API first (may not be available in all browsers)
            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const camPerm = await navigator.permissions.query({ name: 'camera' as any })
                    results.camera = camPerm.state === 'granted' ? 'Granted' : camPerm.state === 'denied' ? 'Denied' : 'Prompt'
                } catch (err) {
                    // ignore
                }
                try {
                    const micPerm = await navigator.permissions.query({ name: 'microphone' as any })
                    results.microphone = micPerm.state === 'granted' ? 'Granted' : micPerm.state === 'denied' ? 'Denied' : 'Prompt'
                } catch (err) {
                    // ignore
                }
            }

            // Then try getUserMedia to verify devices (requesting permission if necessary)
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                // If we get a stream, set granted and stop tracks
                results.camera = 'Granted'
                results.microphone = 'Granted'
                stream.getTracks().forEach(t => t.stop())
            } catch (err: any) {
                // If permission denied or not available, keep previously set values or mark Denied
                if (results.camera === 'Unknown') results.camera = 'Denied'
                if (results.microphone === 'Unknown') results.microphone = 'Denied'
            }
        } catch (err) {
            // ignore
        }

        setTestResults(results)
        setTesting(false)
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
                <h2 className="text-3xl font-bold text-white mb-2">AI Interview</h2>
                <p className="text-gray-300">Join your AI-powered interview session</p>
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
                        <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                            <Video className="h-5 w-5 text-orange-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Interview Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                            <h4 className="font-semibold text-orange-300 mb-2">What to Expect</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
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
                        <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                            <Key className="h-5 w-5 text-orange-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Interview Tokens</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-3">
                                <Key className="h-5 w-5 text-orange-300" />
                                <h4 className="font-semibold text-white">Session ID</h4>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">
                                Please check your email for your session ID. You can join the interview from the link provided in your mail or directly from this dashboard.
                            </p>
                            <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                                <p className="text-xs text-orange-300 text-center">
                                    Session details have been sent to your registered email address
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                            <h4 className="font-semibold text-orange-300 mb-2">Before You Start</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• Ensure stable internet connection</li>
                                <li>• Test your microphone</li>
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
                    <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                        <Play className="h-5 w-5 text-orange-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Ready to Start?</h3>
                </div>

                <div className="text-center py-8">
                    <div className="mb-6">
                        <Video className="h-16 w-16 text-orange-300 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">AI Interview Session</h4>
                        <p className="text-gray-300 mb-4">
                            Your interview session is ready. Use your session ID from email to join.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg" 
                            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                            onClick={() => window.open('https://ai-interview-bot-seven.vercel.app/sign-in', '_blank')}
                        >
                            <Play className="h-5 w-5" />
                            Join Interview Now
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 px-8 py-3"
                            onClick={async () => {
                                await runConnectionTest()
                            }}
                            disabled={testing}
                        >
                            {testing ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </div>

                    {/* Test Results */}
                    {testResults && (
                        <div className="mt-6 max-w-2xl mx-auto text-left">
                            <div className="p-4 rounded-lg bg-blue-600/20 border border-blue-500/30">
                                <h4 className="font-semibold text-white mb-2">Connection Test Results</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>• Online: <strong className="text-orange-300">{testResults.online ? 'Yes' : 'No'}</strong></li>
                                    <li>• Latency: <strong className="text-orange-300">{testResults.latencyMs !== null ? `${testResults.latencyMs} ms` : 'Unavailable'}</strong></li>
                                    <li>• Camera: <strong className="text-orange-300">{testResults.camera}</strong></li>
                                    <li>• Microphone: <strong className="text-orange-300">{testResults.microphone}</strong></li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <p className="text-sm text-gray-300 mt-4">
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


