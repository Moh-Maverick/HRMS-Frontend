"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, MapPin, Users, Search, ExternalLink, CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetAllInterviews, fsMarkInterviewCreated, fsUpdateApplicationDecision } from '@/lib/firestoreApi'
import { onSnapshot, query, collection, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function HRInterviewsPage() {
    const [interviews, setInterviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        // Subscribe to real-time updates for interviews
        const q = query(collection(db, 'interviews'))
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const interviewsData = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
            
            // Filter out invalid/placeholder entries - only show interviews with valid candidate data
            const validInterviews = interviewsData.filter(interview => 
                interview.candidateName && 
                interview.candidateName.trim() !== '' && 
                interview.jobTitle && 
                interview.jobTitle.trim() !== '' &&
                interview.createdAt && 
                !isNaN(interview.createdAt)
            )
            
            // Fetch application data to get finalDecision status
            const interviewsWithDecisions = await Promise.all(
                validInterviews.map(async (interview) => {
                    if (interview.applicationId) {
                        try {
                            const appDocRef = doc(db, 'applications', interview.applicationId)
                            const appDoc = await getDoc(appDocRef)
                            if (appDoc.exists()) {
                                const appData = appDoc.data() as any
                                return {
                                    ...interview,
                                    finalDecision: appData.finalDecision,
                                    decisionDate: appData.decisionDate
                                }
                            }
                        } catch (error) {
                            console.error('Error fetching application data:', error)
                        }
                    }
                    return interview
                })
            )
            
            setInterviews(interviewsWithDecisions)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const handleMarkInterviewCreated = async (interview: any) => {
        try {
            const result = await fsMarkInterviewCreated(interview.applicationId, '')
            
            if (result.success) {
                // Update local state
                setInterviews(prev => prev.map(int => 
                    int.id === interview.id 
                        ? { ...int, status: 'created' }
                        : int
                ))
                
                alert('Interview marked as created successfully!')
            } else {
                alert('Failed to mark interview as created: ' + result.error)
            }
        } catch (error) {
            console.error('Error marking interview as created:', error)
            alert('Failed to mark interview as created. Please try again.')
        }
    }

    const handleViewInterviewResults = (interview: any) => {
        // Always redirect to the interview bot website
        window.open('https://ai-interview-bot-seven.vercel.app/sign-in', '_blank')
    }

    const handleAcceptCandidate = async (interview: any) => {
        if (!confirm(`Are you sure you want to accept ${interview.candidateName} for ${interview.jobTitle}?`)) {
            return
        }

        try {
            const result = await fsUpdateApplicationDecision(interview.applicationId, 'accepted')
            
            if (result.success) {
                // Update local state to reflect the decision
                setInterviews(prev => prev.map(int => 
                    int.id === interview.id 
                        ? { ...int, finalDecision: 'accepted', status: 'completed' }
                        : int
                ))
                alert('✅ Candidate accepted successfully! The candidate will be notified.')
            } else {
                alert('Failed to accept candidate: ' + result.error)
            }
        } catch (error) {
            console.error('Error accepting candidate:', error)
            alert('Failed to accept candidate. Please try again.')
        }
    }

    const handleRejectCandidate = async (interview: any) => {
        if (!confirm(`Are you sure you want to reject ${interview.candidateName} for ${interview.jobTitle}?`)) {
            return
        }

        try {
            const result = await fsUpdateApplicationDecision(interview.applicationId, 'rejected')
            
            if (result.success) {
                // Update local state to reflect the decision
                setInterviews(prev => prev.map(int => 
                    int.id === interview.id 
                        ? { ...int, finalDecision: 'rejected', status: 'completed' }
                        : int
                ))
                alert('❌ Candidate rejected successfully! The candidate will be notified.')
            } else {
                alert('Failed to reject candidate: ' + result.error)
            }
        } catch (error) {
            console.error('Error rejecting candidate:', error)
            alert('Failed to reject candidate. Please try again.')
        }
    }

    const filteredInterviews = interviews.filter(interview => {
        const matchesSearch = 
            (interview.candidateName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (interview.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || interview.status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_creation':
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
            case 'created':
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Video className="h-3 w-3 mr-1" />Created</Badge>
            case 'completed':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
            default:
                return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading interviews...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Interview Management</h2>
                    <p className="text-muted-foreground">Manage and track all candidate interviews</p>
                </div>
                <Button className="gap-2" onClick={() => window.open('https://ai-interview-bot-seven.vercel.app/sign-in', '_blank')}>
                    <Calendar className="h-4 w-4" />
                    Create Interview
                </Button>
            </div>

            {/* Search and Filter */}
            <GlassCard delay={0.1}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search candidates by name or job title..."
                            className="pl-10 bg-background border-glass-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-background border border-glass-border rounded-md"
                        >
                            <option value="all">All Status</option>
                            <option value="pending_creation">Pending Creation</option>
                            <option value="created">Created</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Interviews</p>
                        <p className="text-3xl font-bold text-accent">{interviews.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Pending Creation</p>
                        <p className="text-3xl font-bold text-yellow-400">{interviews.filter(i => i.status === 'pending_creation').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Created</p>
                        <p className="text-3xl font-bold text-blue-400">{interviews.filter(i => i.status === 'created').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-400">{interviews.filter(i => i.status === 'completed').length}</p>
                    </div>
                </GlassCard>
            </div>

            {/* Interview List */}
            <GlassCard delay={0.3}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Interview Management</h3>
                <div className="space-y-4">
                    {filteredInterviews.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No Interviews Found</h3>
                            <p className="text-muted-foreground">
                                {interviews.length === 0 
                                    ? "No candidates have been pushed to interview yet."
                                    : "No interviews match your search criteria."
                                }
                            </p>
                        </div>
                    ) : (
                        filteredInterviews.map((interview, index) => (
                            <div key={interview.id} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-accent/50 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-foreground text-lg">{interview.candidateName}</h4>
                                                <p className="text-sm text-muted-foreground">{interview.jobTitle}</p>
                                            </div>
                                            {getStatusBadge(interview.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4 text-accent" />
                                                <span>Created: {new Date(interview.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="h-4 w-4 text-accent" />
                                                <span>Scheduled by HR</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {/* Show decision status if already decided */}
                                        {interview.finalDecision === 'accepted' && (
                                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Accepted
                                            </Badge>
                                        )}
                                        
                                        {interview.finalDecision === 'rejected' && (
                                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-2">
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Rejected
                                            </Badge>
                                        )}

                                        {/* Show action buttons if no decision made yet */}
                                        {!interview.finalDecision && (
                                            <>
                                                {interview.status === 'pending_creation' && (
                                                    <>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                                                            onClick={() => handleMarkInterviewCreated(interview)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            <span className="hidden sm:inline">Mark Created</span>
                                                            <span className="sm:hidden">Mark</span>
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="border-glass-border"
                                                            onClick={() => window.open('https://ai-interview-bot-seven.vercel.app/sign-in', '_blank')}
                                                        >
                                                            <Video className="h-4 w-4 mr-1" />
                                                            <span className="hidden sm:inline">Create Interview</span>
                                                            <span className="sm:hidden">Create</span>
                                                        </Button>
                                                    </>
                                                )}
                                                
                                                {interview.status === 'created' && (
                                                    <>
                                                        <Button 
                                                            size="sm" 
                                                            className="bg-green-500 hover:bg-green-600 text-white"
                                                            onClick={() => handleAcceptCandidate(interview)}
                                                        >
                                                            <UserCheck className="h-4 w-4 mr-1" />
                                                            Accept
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                                                            onClick={() => handleRejectCandidate(interview)}
                                                        >
                                                            <UserX className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            className="gap-2"
                                                            onClick={() => handleViewInterviewResults(interview)}
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                            <span className="hidden sm:inline">View Results</span>
                                                            <span className="sm:hidden">Results</span>
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>
        </div>
    )
}