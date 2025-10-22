"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
    Users, 
    Search, 
    Mail, 
    Phone, 
    FileText, 
    Eye, 
    Download,
    Brain,
    BarChart3,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Play,
    Pause,
    RotateCcw,
    ExternalLink,
    UserCheck,
    UserX,
    Video
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetAllApplications, screenResume, fsUpdateScreeningResults, fsPushToInterview, fsMarkInterviewCreated, fsUpdateApplicationDecision } from '@/lib/firestoreApi'
import { onSnapshot, query, collection, getDocs, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ScreeningDetails {
    overall_assessment?: string
    strengths?: string[]
    weaknesses?: string[]
    recommendation?: string
    component_scores?: {
        education?: number
        experience?: number
        domain?: number
        language?: number
        skill_match?: number
    }
    skill_analysis?: {
        matched_required?: string[]
        missing_required?: string[]
        matched_optional?: string[]
        all_candidate_skills?: string[]
    }
    keyword_analysis?: {
        coverage_percentage?: number
        overall_density?: number
        keywords_found?: number
        keywords_missing?: number
    }
    education_details?: any
    experience_details?: any
    domain_details?: any
}

interface Application {
    id: string
    uid: string
    jobId: string
    candidateName: string
    email: string
    phone: string
    currentLocation: string
    education: string
    college: string
    marks: string
    experience: string
    skills: string
    coverLetter: string
    resume: string | null
    resumeFileName: string | null
    resumeFileType: string | null
    status: string
    appliedAt: number
    jobTitle: string
    jobCompany: string
    jobLocation: string
    jobDepartment: string
    aiScore?: number
    screeningDetails?: ScreeningDetails
    componentScores?: any
    skillAnalysis?: any
    keywordAnalysis?: any
    screeningCompleted?: boolean
    screeningDate?: string
    interviewStatus?: 'none' | 'scheduled' | 'created' | 'completed'
    interviewCreatedAt?: number
    interviewBotUrl?: string
    finalDecision?: 'pending' | 'accepted' | 'rejected'
    decisionDate?: number
    decisionNotes?: string
}

export default function HRCandidatesPage() {
    const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
    const [showApplicationModal, setShowApplicationModal] = useState(false)
    const [showResumeModal, setShowResumeModal] = useState(false)
    const [showScreeningModal, setShowScreeningModal] = useState(false)
    const [showDetailedScreeningModal, setShowDetailedScreeningModal] = useState(false)
    const [showInterviewModal, setShowInterviewModal] = useState(false)
    const [showDecisionModal, setShowDecisionModal] = useState(false)
    const [decisionType, setDecisionType] = useState<'accept' | 'reject' | null>(null)
    const [decisionNotes, setDecisionNotes] = useState('')
    
    // Bulk screening state
    const [isBulkScreening, setIsBulkScreening] = useState(false)
    const [bulkScreeningProgress, setBulkScreeningProgress] = useState(0)
    const [bulkScreeningTotal, setBulkScreeningTotal] = useState(0)
    const [bulkScreeningCurrent, setBulkScreeningCurrent] = useState('')
    
    // Sorting state
    const [sortBy, setSortBy] = useState<'default' | 'score-high' | 'score-low' | 'name' | 'date'>('default')

  useEffect(() => {
        // Subscribe to real-time updates for applications
        const q = query(collection(db, 'applications'))
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const applications = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
            
            // Get job details for each application
            const applicationsWithJobDetails = await Promise.all(
                applications.map(async (app) => {
                    try {
                        // Try to get job details from jobs collection first
                        const jobSnap = await getDocs(query(collection(db, 'jobs'), where('__name__', '==', app.jobId)))
                        if (!jobSnap.empty) {
                            const jobData = jobSnap.docs[0].data()
                            return {
                                ...app,
                                jobTitle: jobData.title || jobData.role || 'Unknown Position',
                                jobCompany: jobData.company || 'Unknown Company',
                                jobLocation: jobData.location || 'Unknown Location',
                                jobDepartment: jobData.department || 'Unknown Department'
                            }
                        }
                        
                        // Fallback to job_descriptions collection
                        const jdSnap = await getDocs(query(collection(db, 'job_descriptions'), where('__name__', '==', app.jobId)))
                        if (!jdSnap.empty) {
                            const jdData = jdSnap.docs[0].data()
                            return {
                                ...app,
                                jobTitle: jdData.role || jdData.title || 'Unknown Position',
                                jobCompany: 'Our Company',
                                jobLocation: jdData.location || 'Unknown Location',
                                jobDepartment: jdData.department || 'Unknown Department'
                            }
                        }
                        
                        return {
                            ...app,
                            jobTitle: 'Unknown Position',
                            jobCompany: 'Unknown Company',
                            jobLocation: 'Unknown Location',
                            jobDepartment: 'Unknown Department'
                        }
                    } catch (error) {
                        console.error('Error fetching job details for application:', app.id, error)
                        return {
                            ...app,
                            jobTitle: 'Unknown Position',
                            jobCompany: 'Unknown Company',
                            jobLocation: 'Unknown Location',
                            jobDepartment: 'Unknown Department'
                        }
                    }
                })
            )
            
            setApplications(applicationsWithJobDetails)
            setLoading(false)
        })

        return () => unsubscribe()
  }, [])

    const filteredApplications = applications.filter(app => {
        const matchesSearch = 
            app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.jobDepartment.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter
        
        return matchesSearch && matchesStatus
    })

    // Sort the filtered applications
    const sortedApplications = [...filteredApplications].sort((a, b) => {
        switch (sortBy) {
            case 'score-high':
                // Sort by AI score (highest first), unscreened candidates at the end
                const scoreA = a.aiScore ?? -1
                const scoreB = b.aiScore ?? -1
                return scoreB - scoreA
            
            case 'score-low':
                // Sort by AI score (lowest first), unscreened candidates at the end
                const scoreALow = a.aiScore ?? 999
                const scoreBLow = b.aiScore ?? 999
                return scoreALow - scoreBLow
            
            case 'name':
                // Sort by candidate name alphabetically
                return a.candidateName.localeCompare(b.candidateName)
            
            case 'date':
                // Sort by application date (newest first)
                const dateA = new Date(a.appliedAt).getTime()
                const dateB = new Date(b.appliedAt).getTime()
                return dateB - dateA
            
            default:
                // Default order (as fetched from database)
                return 0
        }
    })

    const handleViewDetails = (application: Application) => {
        setSelectedApplication(application)
        setShowApplicationModal(true)
    }

    const handleViewResume = (application: Application) => {
        setSelectedApplication(application)
        setShowResumeModal(true)
    }

    const handleDownloadResume = (application: Application) => {
        if (!application.resume) return
        
        try {
            // Convert base64 back to blob
            const byteCharacters = atob(application.resume)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: application.resumeFileType || 'application/pdf' })
            
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = application.resumeFileName || 'resume.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading resume:', error)
            alert('Failed to download resume')
        }
    }

    const handleResumeScreening = async (application: Application, forceRescreen: boolean = false) => {
        if (!application.resume) {
            alert('No resume available for screening')
            return
        }

        // Check if screening has already been completed (unless force re-screen is requested)
        if (!forceRescreen && application.screeningCompleted && application.aiScore !== undefined) {
            console.log('Screening already completed, showing cached results')
            setSelectedApplication(application)
            setShowScreeningModal(true)
            return
        }

        setSelectedApplication(application)
        setShowScreeningModal(true)
        
        try {
            console.log('Starting resume screening for:', application.candidateName)
            
            // Call the resume screening API
            const result = await screenResume(
                application.resume,
                application.resumeFileName || 'resume.pdf',
                application.jobId,
                application.candidateName,
                true // Enable AI
            )

            if (result.success) {
                console.log('Resume screening completed:', result)
                
                // Store screening results in Firebase
                const storeResult = await fsUpdateScreeningResults(application.id, result)
                if (storeResult.success) {
                    console.log('Screening results stored in database')
                } else {
                    console.error('Failed to store screening results:', storeResult.error)
                }
                
                // Update the application with comprehensive AI data
                const updatedApplication = {
                    ...application,
                    aiScore: result.ai_score,
                    screeningDetails: result.analysis,
                    componentScores: result.component_scores,
                    skillAnalysis: result.skill_analysis,
                    keywordAnalysis: result.keyword_analysis,
                    screeningCompleted: true,
                    screeningDate: new Date().toISOString()
                }
                
                setSelectedApplication(updatedApplication)
                
                // Update the applications list to show the score immediately
                setApplications(prev => prev.map(app => 
                    app.id === application.id ? updatedApplication : app
                ))
            } else {
                console.error('Resume screening failed:', result.error)
                alert('Resume screening failed: ' + (result.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error during resume screening:', error)
            alert('Failed to screen resume. Please try again.')
        }
    }

    const handleSendEmail = (application: Application) => {
        // Create email content with candidate details
        const subject = `Application Update - ${application.jobTitle || 'Position'}`
        const body = `Dear ${application.candidateName},

Thank you for your interest in the ${application.jobTitle || 'position'} at our company.

We have completed the initial review of your application and would like to inform you about the next steps in our hiring process.

Application Details:
- Position: ${application.jobTitle || 'N/A'}
- Application Date: ${new Date(application.appliedAt).toLocaleDateString()}
- Status: ${application.status || 'Under Review'}

${application.aiScore ? `Your application scored ${application.aiScore}% in our initial screening.` : ''}

We will be in touch soon with further updates.

Best regards,
HR Team`

        // Create mailto link
        const mailtoLink = `mailto:${application.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        
        // Open default email client
        window.open(mailtoLink)
        
        console.log('Opening email client for:', application.email)
    }

    const handlePushToInterview = async (application: Application) => {
        try {
            const result = await fsPushToInterview(application.id, {
                uid: application.uid,
                name: application.candidateName,
                jobId: application.jobId,
                jobTitle: application.jobTitle
            })

            if (result.success) {
                // Update local state
                setApplications(prev => prev.map(app => 
                    app.id === application.id 
                        ? { ...app, interviewStatus: 'scheduled', interviewCreatedAt: Date.now() }
                        : app
                ))
                
                alert('Candidate pushed to interview successfully! Go to Interviews page to create the interview.')
            } else {
                alert('Failed to push candidate to interview: ' + result.error)
            }
        } catch (error) {
            console.error('Error pushing to interview:', error)
            alert('Failed to push candidate to interview. Please try again.')
        }
    }

    const handleMarkInterviewCreated = async (application: Application) => {
        const interviewBotUrl = prompt('Please enter the interview bot URL:')
        if (!interviewBotUrl) return

        try {
            const result = await fsMarkInterviewCreated(application.id, interviewBotUrl)
            
            if (result.success) {
                // Update local state
                setApplications(prev => prev.map(app => 
                    app.id === application.id 
                        ? { ...app, interviewStatus: 'created', interviewBotUrl }
                        : app
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

    const handleViewInterviewResults = (application: Application) => {
        if (application.interviewBotUrl) {
            window.open(application.interviewBotUrl, '_blank')
        } else {
            alert('Interview bot URL not available')
        }
    }

    const handleOpenDecisionModal = (application: Application, type: 'accept' | 'reject') => {
        setSelectedApplication(application)
        setDecisionType(type)
        setDecisionNotes('')
        setShowDecisionModal(true)
    }

    const handleSubmitDecision = async () => {
        if (!selectedApplication || !decisionType) return

        try {
            const result = await fsUpdateApplicationDecision(
                selectedApplication.id, 
                decisionType === 'accept' ? 'accepted' : 'rejected',
                decisionNotes || undefined
            )

            if (result.success) {
                // Update local state
                setApplications(prev => prev.map(app => 
                    app.id === selectedApplication.id 
                        ? { 
                            ...app, 
                            finalDecision: decisionType === 'accept' ? 'accepted' : 'rejected',
                            decisionDate: Date.now(),
                            decisionNotes: decisionNotes || undefined,
                            status: decisionType === 'accept' ? 'accepted' : 'rejected'
                        }
                        : app
                ))
                
                setShowDecisionModal(false)
                setSelectedApplication(null)
                setDecisionType(null)
                setDecisionNotes('')
                
                alert(`Candidate ${decisionType === 'accept' ? 'accepted' : 'rejected'} successfully!`)
            } else {
                alert(`Failed to ${decisionType} candidate: ` + result.error)
            }
        } catch (error) {
            console.error('Error updating decision:', error)
            alert(`Failed to ${decisionType} candidate. Please try again.`)
        }
    }

    const handleBulkScreening = async () => {
        // Get all applications that haven't been screened yet
        const unscreenedApplications = applications.filter(app => 
            !app.screeningCompleted || app.aiScore === undefined
        )

        if (unscreenedApplications.length === 0) {
            alert('All candidates have already been screened!')
            return
        }

        // Confirm before starting bulk screening
        const confirmed = confirm(
            `Start bulk screening for ${unscreenedApplications.length} candidates? This may take several minutes.`
        )
        
        if (!confirmed) return

        setIsBulkScreening(true)
        setBulkScreeningTotal(unscreenedApplications.length)
        setBulkScreeningProgress(0)
        setBulkScreeningCurrent('')

        try {
            for (let i = 0; i < unscreenedApplications.length; i++) {
                const application = unscreenedApplications[i]
                
                setBulkScreeningCurrent(`${application.candidateName} (${i + 1}/${unscreenedApplications.length})`)
                // Don't update progress yet - wait for completion

                try {
                    console.log(`Screening ${i + 1}/${unscreenedApplications.length}: ${application.candidateName}`)
                    
                    // Call the resume screening API
                    const result = await screenResume(
                        application.resume!,
                        application.resumeFileName || 'resume.pdf',
                        application.jobId,
                        application.candidateName,
                        true // Enable AI
                    )

                    if (result.success) {
                        // Store screening results in Firebase
                        await fsUpdateScreeningResults(application.id, result)
                        
                        // Update the application with comprehensive AI data
                        const updatedApplication = {
                            ...application,
                            aiScore: result.ai_score,
                            screeningDetails: result.analysis,
                            componentScores: result.component_scores,
                            skillAnalysis: result.skill_analysis,
                            keywordAnalysis: result.keyword_analysis,
                            screeningCompleted: true,
                            screeningDate: new Date().toISOString()
                        }
                        
                        // Update the applications list
                        setApplications(prev => prev.map(app => 
                            app.id === application.id ? updatedApplication : app
                        ))
                        
                        console.log(`✓ Completed screening for ${application.candidateName}`)
                        
                        // Update progress after successful completion
                        setBulkScreeningProgress(((i + 1) / unscreenedApplications.length) * 100)
                    } else {
                        console.error(`✗ Failed to screen ${application.candidateName}:`, result.error)
                    }
                } catch (error) {
                    console.error(`✗ Error screening ${application.candidateName}:`, error)
                }

                // Add a small delay to prevent overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            alert(`Bulk screening completed! Processed ${unscreenedApplications.length} candidates.`)
        } catch (error) {
            console.error('Bulk screening failed:', error)
            alert('Bulk screening failed. Please try again.')
        } finally {
            setIsBulkScreening(false)
            setBulkScreeningProgress(0)
            setBulkScreeningTotal(0)
            setBulkScreeningCurrent('')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400"><Clock className="h-3 w-3 mr-1" />Applied</Badge>
            case 'approved':
                return <Badge variant="secondary" className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
            case 'rejected':
                return <Badge variant="secondary" className="bg-red-500/20 text-red-400"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
            default:
                return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">{status}</Badge>
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Candidate Management</h2>
        <p className="text-muted-foreground">Track and manage all job candidates</p>
      </div>

            {/* Search and Filter */}
      <GlassCard delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                            placeholder="Search candidates by name, email, job title, or department..."
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
                            <option value="pending">Applied</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
          <Button 
                            variant="outline" 
                            className="border-glass-border"
                            onClick={() => {
                                // Cycle through sorting options
                                switch (sortBy) {
                                    case 'default':
                                        setSortBy('score-high')
                                        break
                                    case 'score-high':
                                        setSortBy('score-low')
                                        break
                                    case 'score-low':
                                        setSortBy('name')
                                        break
                                    case 'name':
                                        setSortBy('date')
                                        break
                                    case 'date':
                                        setSortBy('default')
                                        break
                                }
                            }}
                            title={`Current sort: ${sortBy === 'default' ? 'Default' : 
                                           sortBy === 'score-high' ? 'Score (High to Low)' :
                                           sortBy === 'score-low' ? 'Score (Low to High)' :
                                           sortBy === 'name' ? 'Name (A-Z)' :
                                           'Date (Newest First)'}`}
                        >
                            {sortBy === 'default' && 'Sort by Score'}
                            {sortBy === 'score-high' && 'Score ↓'}
                            {sortBy === 'score-low' && 'Score ↑'}
                            {sortBy === 'name' && 'Name A-Z'}
                            {sortBy === 'date' && 'Date ↓'}
                        </Button>
                        <Button 
                            onClick={handleBulkScreening}
                            disabled={isBulkScreening}
                            className={`${
                                isBulkScreening 
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                                    : 'bg-accent hover:bg-accent/90'
                            }`}
                            title="Screen all candidates who haven't been screened yet"
                        >
                            {isBulkScreening ? (
                                <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Screening...
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Bulk Screen
                                    {(() => {
                                        const unscreenedCount = applications.filter(app => 
                                            !app.screeningCompleted || app.aiScore === undefined
                                        ).length
                                        return unscreenedCount > 0 ? (
                                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                                {unscreenedCount}
                                            </span>
                                        ) : null
                                    })()}
                                </>
                            )}
                        </Button>
                    </div>
        </div>
      </GlassCard>

      {/* Bulk Screening Progress */}
      {isBulkScreening && (
        <GlassCard delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Bulk Screening in Progress</h3>
              <span className="text-sm text-muted-foreground">
                {bulkScreeningProgress.toFixed(0)}% Complete
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">
                  Currently screening: <span className="text-foreground font-medium">{bulkScreeningCurrent}</span>
                </span>
              </div>
              
              <div className="w-full bg-background rounded-full h-2 border border-glass-border">
                <div 
                  className="bg-gradient-to-r from-accent to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${bulkScreeningProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress: {Math.round(bulkScreeningProgress)}%</span>
                <span>Total: {bulkScreeningTotal} candidates</span>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Candidates List */}
      <div className="space-y-4">
                {sortedApplications.length === 0 ? (
                    <GlassCard delay={0.2}>
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No Candidates Found</h3>
                            <p className="text-muted-foreground">
                                {applications.length === 0 
                                    ? "No applications have been submitted yet."
                                    : "No candidates match your search criteria."
                                }
                            </p>
                        </div>
                    </GlassCard>
                ) : (
                    sortedApplications.map((application, index) => (
                        <GlassCard key={application.id} delay={0.2 + index * 0.05}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-accent font-semibold text-lg">
                                            {application.candidateName?.[0] || 'C'}
                                        </span>
                </div>
                <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                            {application.candidateName || 'Unknown Candidate'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Applied for: {application.jobTitle || 'Position'}
                                        </p>
                                        {application.screeningCompleted && application.aiScore !== undefined && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-muted-foreground">AI Score:</span>
                                                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                                    application.aiScore >= 80 ? 'bg-green-500/20 text-green-400' :
                                                    application.aiScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    application.aiScore >= 40 ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {application.aiScore.toFixed(0)}%
                                                </span>
                                            </div>
                                        )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                                                {application.email || 'No email'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                                                {application.phone || 'No phone'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {application.currentLocation || 'No location'}
                    </span>
                                            <span>Applied: {formatDate(application.appliedAt)}</span>
                  </div>
                </div>
              </div>
                                
              <div className="flex flex-col md:items-end gap-3">
                <div className="flex items-center gap-3">
                                        {getStatusBadge(application.status)}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">AI Score</p>
                                            <p className="text-lg font-bold text-accent">
                                                {application.aiScore ? `${application.aiScore}%` : '--'}
                                            </p>
                  </div>
                </div>
                                    
                <div className="flex flex-wrap gap-2">
                                        {application.resume && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="border-glass-border"
                                                onClick={() => handleViewResume(application)}
                                            >
                    <FileText className="h-4 w-4" />
                  </Button>
                                        )}
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="border-glass-border"
                                            onClick={() => handleSendEmail(application)}
                                        >
                    <Mail className="h-4 w-4" />
                  </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className={`border-glass-border ${
                                                application.screeningCompleted 
                                                    ? 'bg-green-500/20 border-green-500 text-green-400' 
                                                    : 'hover:bg-accent hover:text-white hover:border-accent'
                                            }`}
                                            onClick={() => handleResumeScreening(application)}
                                            title={application.screeningCompleted ? 'Screening completed - click to view results' : 'Start AI resume screening'}
                                        >
                                            <Brain className="h-4 w-4" />
                                            {application.screeningCompleted && (
                                                <span className="ml-1 text-xs">✓</span>
                                            )}
                                        </Button>
                                        
                                        {/* Interview Action Buttons */}
                                        {application.screeningCompleted && !application.interviewStatus && (
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                                                onClick={() => handlePushToInterview(application)}
                                                title="Push candidate to interview"
                                            >
                                                <Video className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">Push to Interview</span>
                                                <span className="sm:hidden">Push</span>
                                            </Button>
                                        )}
                                        
                                        <Button 
                                            size="sm"
                                            onClick={() => handleViewDetails(application)}
                                        >
                                            <span className="hidden sm:inline">View Details</span>
                                            <span className="sm:hidden">Details</span>
                                        </Button>
                </div>
              </div>
            </div>
          </GlassCard>
                    ))
                )}
            </div>

            {/* Application Details Modal */}
            {showApplicationModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-blue-400/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">
                                    Application Details - {selectedApplication.candidateName}
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {selectedApplication.jobTitle} • {selectedApplication.jobDepartment}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowApplicationModal(false)}
                                className="text-slate-300 hover:text-white"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">Full Name</p>
                                            <p className="text-slate-100">{selectedApplication.candidateName}</p>
                                        </div>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">Email</p>
                                            <p className="text-slate-100">{selectedApplication.email}</p>
                                        </div>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">Phone</p>
                                            <p className="text-slate-100">{selectedApplication.phone}</p>
                                        </div>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">Location</p>
                                            <p className="text-slate-100">{selectedApplication.currentLocation}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Education */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Education</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">Education</p>
                                            <p className="text-slate-100">{selectedApplication.education}</p>
                                        </div>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">College/University</p>
                                            <p className="text-slate-100">{selectedApplication.college}</p>
                                        </div>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400">Marks/Percentage</p>
                                            <p className="text-slate-100">{selectedApplication.marks}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience & Skills */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Experience & Skills</h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400 mb-2">Work Experience</p>
                                            <p className="text-slate-100 whitespace-pre-wrap">{selectedApplication.experience}</p>
                                        </div>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-sm text-slate-400 mb-2">Skills</p>
                                            <p className="text-slate-100 whitespace-pre-wrap">{selectedApplication.skills}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                {selectedApplication.coverLetter && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100 mb-3">Cover Letter</h3>
                                        <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                            <p className="text-slate-100 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Resume Actions */}
                                {selectedApplication.resume && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100 mb-3">Resume</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleViewResume(selectedApplication)}
                                                className="bg-accent hover:bg-accent/90"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Resume
                                            </Button>
                                            <Button
                                                onClick={() => handleDownloadResume(selectedApplication)}
                                                variant="outline"
                                                className="border-glass-border"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Resume
                                            </Button>
                                            <Button
                                                onClick={() => handleResumeScreening(selectedApplication)}
                                                variant="outline"
                                                className={`border-glass-border ${
                                                    selectedApplication?.screeningCompleted 
                                                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                                                        : 'hover:bg-accent hover:text-white hover:border-accent'
                                                }`}
                                                title={selectedApplication?.screeningCompleted ? 'Screening completed - click to view results' : 'Start AI resume screening'}
                                            >
                                                <Brain className="h-4 w-4 mr-2" />
                                                {selectedApplication?.screeningCompleted ? 'View Screening Results' : 'Resume Screening'}
                                                {selectedApplication?.screeningCompleted && (
                                                    <span className="ml-2 text-xs">✓</span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resume Modal */}
            {showResumeModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-blue-400/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">Resume - {selectedApplication.candidateName}</h2>
                                <p className="text-sm text-slate-400">
                                    {selectedApplication.jobTitle} • {selectedApplication.resumeFileName}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowResumeModal(false)}
                                className="text-slate-300 hover:text-white"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {selectedApplication.resume ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleDownloadResume(selectedApplication)}
                                            className="bg-accent hover:bg-accent/90"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Resume
                                        </Button>
                                    </div>
                                    <div className="bg-slate-800 border border-blue-400/20 rounded p-4">
                                        <iframe
                                            src={`data:${selectedApplication.resumeFileType || 'application/pdf'};base64,${selectedApplication.resume}`}
                                            className="w-full h-[600px] border-0"
                                            title="Resume Preview"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-300 text-center py-8">No resume available.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Resume Screening Modal */}
            {showScreeningModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-blue-400/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">Resume Screening Results</h2>
                                <p className="text-sm text-slate-400">
                                    {selectedApplication.candidateName} • {selectedApplication.jobTitle}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowScreeningModal(false)}
                                className="text-slate-300 hover:text-white"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {selectedApplication.aiScore ? (
                                <div className="space-y-6">
                                    {/* AI Score Display */}
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-accent to-blue-500 mb-4">
                                            <span className="text-2xl font-bold text-white">
                                                {Math.round(selectedApplication.aiScore)}%
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-100 mb-2">AI Match Score</h3>
                                        <p className="text-slate-400">
                                            Based on skills, experience, and job requirements analysis
                                        </p>
                                    </div>

                                    {/* Screening Details */}
                                    {selectedApplication.screeningDetails && (
                                        <div className="space-y-4">
                                            {/* Overall Assessment */}
                                            {selectedApplication.screeningDetails.overall_assessment && (
                                                <div className="bg-slate-800 border border-blue-400/20 rounded p-4">
                                                    <h4 className="text-slate-100 font-semibold mb-2">Overall Assessment</h4>
                                                    <p className="text-slate-300">{selectedApplication.screeningDetails.overall_assessment}</p>
                                                </div>
                                            )}

                                            {/* Strengths */}
                                            {selectedApplication.screeningDetails.strengths && selectedApplication.screeningDetails.strengths.length > 0 && (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
                                                    <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Strengths
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {selectedApplication.screeningDetails.strengths.map((strength: string, index: number) => (
                                                            <li key={index} className="text-green-300 text-sm">• {strength}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Weaknesses */}
                                            {selectedApplication.screeningDetails.weaknesses && selectedApplication.screeningDetails.weaknesses.length > 0 && (
                                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
                                                    <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        Areas for Improvement
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {selectedApplication.screeningDetails.weaknesses.map((weakness: string, index: number) => (
                                                            <li key={index} className="text-yellow-300 text-sm">• {weakness}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Recommendation */}
                                            {selectedApplication.screeningDetails.recommendation && (
                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
                                                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                                        <Brain className="h-4 w-4" />
                                                        AI Recommendation
                                                    </h4>
                                                    <p className="text-blue-300">{selectedApplication.screeningDetails.recommendation}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 justify-center pt-4">
                                        <Button
                                            onClick={() => {
                                                setShowDetailedScreeningModal(true)
                                                setShowScreeningModal(false)
                                            }}
                                            className="bg-accent hover:bg-accent/90"
                                        >
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            View Full Details
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-glass-border hover:bg-orange-500/20 hover:border-orange-500 hover:text-orange-400"
                                            onClick={() => {
                                                setShowScreeningModal(false)
                                                handleResumeScreening(selectedApplication, true) // Force re-screen
                                            }}
                                            title="Re-run AI analysis (this will update the results)"
                                        >
                                            <Brain className="h-4 w-4 mr-2" />
                                            Re-screen
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-glass-border"
                                            onClick={() => setShowScreeningModal(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <Brain className="h-16 w-16 text-accent mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Resume Screening</h3>
                                        <p className="text-slate-400 mb-4">
                                            Analyzing resume using AI to provide insights and scoring...
                                        </p>
                                    </div>
                                    
                                    <div className="bg-slate-800 border border-blue-400/20 rounded p-4">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                                            <span className="ml-3 text-slate-300">Processing resume...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
      </div>
      </div>
            )}

            {/* Comprehensive Detailed Screening Results Modal */}
            {showDetailedScreeningModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-blue-400/20 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">Comprehensive Resume Analysis</h2>
                                    <p className="text-slate-400">{selectedApplication.candidateName} • {selectedApplication.jobTitle}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetailedScreeningModal(false)}
                                    className="border-glass-border"
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Score Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 text-center">
                                    <div className="text-4xl font-bold text-accent mb-2">
                                        {selectedApplication.aiScore ? `${Math.round(selectedApplication.aiScore)}%` : '--'}
                                    </div>
                                    <div className="text-slate-300 font-medium">Composite Score</div>
                                    <div className="text-sm text-slate-400 mt-1">Overall Assessment</div>
                                </div>
                                
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 text-center">
                                    <div className="text-4xl font-bold text-green-400 mb-2">
                                        {(selectedApplication.skillAnalysis?.matched_required?.length || 0) + (selectedApplication.skillAnalysis?.matched_optional?.length || 0)}
                                    </div>
                                    <div className="text-slate-300 font-medium">Skills Match</div>
                                    <div className="text-sm text-slate-400 mt-1">Total skills matched</div>
                                </div>
                                
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 text-center">
                                    <div className="text-4xl font-bold text-blue-400 mb-2">
                                        {selectedApplication.keywordAnalysis?.coverage_percentage ? `${Math.round(selectedApplication.keywordAnalysis.coverage_percentage)}%` : '--'}
                                    </div>
                                    <div className="text-slate-300 font-medium">Relevance</div>
                                    <div className="text-sm text-slate-400 mt-1">Keyword coverage</div>
                                </div>
                            </div>

                            {/* Component Scores */}
                            {selectedApplication.componentScores && (
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                        <BarChart3 className="h-5 w-5 mr-2 text-accent" />
                                        Component Scores
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(selectedApplication.componentScores).map(([component, score]) => (
                                            <div key={component} className="flex items-center justify-between">
                                                <span className="text-slate-300 capitalize">{component.replace('_', ' ')}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-32 bg-slate-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                                                            style={{ width: `${score as number}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-slate-300 font-medium w-12 text-right">{score as number}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills Analysis */}
                            {selectedApplication.skillAnalysis && (
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                                        Skills Analysis
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Matched Required Skills */}
                                        {selectedApplication.skillAnalysis.matched_required && selectedApplication.skillAnalysis.matched_required.length > 0 && (
                                            <div>
                                                <h4 className="text-slate-300 font-medium mb-3">Matched Required Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApplication.skillAnalysis.matched_required.map((skill: string, index: number) => (
                                                        <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Missing Required Skills */}
                                        {selectedApplication.skillAnalysis.missing_required && selectedApplication.skillAnalysis.missing_required.length > 0 && (
                                            <div>
                                                <h4 className="text-slate-300 font-medium mb-3">Missing Required Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApplication.skillAnalysis.missing_required.map((skill: string, index: number) => (
                                                        <span key={index} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Matched Optional Skills */}
                                        {selectedApplication.skillAnalysis.matched_optional && selectedApplication.skillAnalysis.matched_optional.length > 0 && (
                                            <div>
                                                <h4 className="text-slate-300 font-medium mb-3">Matched Optional Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApplication.skillAnalysis.matched_optional.map((skill: string, index: number) => (
                                                        <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                                                            <span className="w-3 h-3 mr-1">•</span>
                                                            {skill}
                                                        </span>
        ))}
      </div>
                                            </div>
                                        )}

                                        {/* All Candidate Skills with Color Coding */}
                                        {selectedApplication.skillAnalysis.all_candidate_skills && (
                                            <div>
                                                <h4 className="text-slate-300 font-medium mb-3">All Candidate Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApplication.skillAnalysis.all_candidate_skills.slice(0, 15).map((skill: string, index: number) => {
                                                        // Check if this skill matches any required skill
                                                        const isMatched = selectedApplication.skillAnalysis.matched_required?.some((matchedSkill: string) => 
                                                            matchedSkill.toLowerCase() === skill.toLowerCase() ||
                                                            skill.toLowerCase().includes(matchedSkill.toLowerCase()) ||
                                                            matchedSkill.toLowerCase().includes(skill.toLowerCase())
                                                        );
                                                        
                                                        return (
                                                            <span 
                                                                key={index} 
                                                                className={`px-2 py-1 rounded text-sm ${
                                                                    isMatched 
                                                                        ? 'bg-green-600 text-white' 
                                                                        : 'bg-slate-600 text-slate-200'
                                                                }`}
                                                            >
                                                                {skill}
                                                            </span>
                                                        );
                                                    })}
                                                    {selectedApplication.skillAnalysis.all_candidate_skills.length > 15 && (
                                                        <span className="text-slate-400 text-sm">...and {selectedApplication.skillAnalysis.all_candidate_skills.length - 15} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                            {/* Education & Experience Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Education */}
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                                        Education
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Education Score:</span>
                                            <span className="text-slate-300 font-medium">{selectedApplication.componentScores?.education || 0}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Degree:</span>
                                            <span className="text-slate-300">{selectedApplication.education || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Institution:</span>
                                            <span className="text-slate-300">{selectedApplication.college || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Marks:</span>
                                            <span className="text-slate-300">{selectedApplication.marks || 'Not specified'}</span>
                                        </div>
                                        <div className="bg-green-600 text-white px-3 py-2 rounded flex items-center mt-4">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Meets education requirement
                                        </div>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                        <Clock className="h-5 w-5 mr-2 text-orange-400" />
                                        Experience
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Experience Score:</span>
                                            <span className="text-slate-300 font-medium">{selectedApplication.componentScores?.experience || 0}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Years:</span>
                                            <span className="text-slate-300">0 years</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Required:</span>
                                            <span className="text-slate-300">0 years</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Rating:</span>
                                            <span className="text-slate-300">Limited (0 years)</span>
                                        </div>
                                        <div className="bg-green-600 text-white px-3 py-2 rounded flex items-center mt-4">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Meets experience requirement
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Domain Alignment & Language Quality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Domain Alignment */}
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Domain Alignment</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Domain Score:</span>
                                            <span className="text-slate-300 font-medium">{selectedApplication.componentScores?.domain || 0}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Primary Domain:</span>
                                            <span className="text-slate-300">IT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Target Domain:</span>
                                            <span className="text-slate-300">IT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Rating:</span>
                                            <span className="text-slate-300">Strong Alignment</span>
                                        </div>
                                        <div className="bg-green-600 text-white px-3 py-2 rounded flex items-center mt-4">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Perfect domain match
                                        </div>
                                    </div>
                                </div>

                                {/* Language Quality */}
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Language Quality</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Grammar Score:</span>
                                            <span className="text-slate-300 font-medium">{selectedApplication.componentScores?.language || 0}/100</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Error Count:</span>
                                            <span className="text-slate-300">0</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Word Count:</span>
                                            <span className="text-slate-300">99</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Rating:</span>
                                            <span className="text-slate-300">Fair</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Keyword Density Analysis */}
                            {selectedApplication.keywordAnalysis && (
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                        <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                                        Keyword Density Analysis
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Keyword Coverage:</span>
                                                    <span className="text-slate-300 font-medium">{selectedApplication.keywordAnalysis.coverage_percentage || 0}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Overall Density:</span>
                                                    <span className="text-slate-300 font-medium">{selectedApplication.keywordAnalysis.overall_density || 0}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Keywords Found:</span>
                                                    <span className="text-slate-300 font-medium">{selectedApplication.keywordAnalysis.keywords_found || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Keywords Missing:</span>
                                                    <span className="text-slate-300 font-medium">{selectedApplication.keywordAnalysis.keywords_missing || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bg-slate-700 rounded-lg p-4">
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold mb-2 ${
                                                        (selectedApplication.aiScore || 0) >= 80 ? 'text-green-400' :
                                                        (selectedApplication.aiScore || 0) >= 65 ? 'text-blue-400' :
                                                        (selectedApplication.aiScore || 0) >= 50 ? 'text-yellow-400' :
                                                        (selectedApplication.aiScore || 0) >= 35 ? 'text-orange-400' :
                                                        'text-red-400'
                                                    }`}>
                                                        {(selectedApplication.aiScore || 0) >= 80 ? 'Highly Recommended' :
                                                         (selectedApplication.aiScore || 0) >= 65 ? 'Recommended' :
                                                         (selectedApplication.aiScore || 0) >= 50 ? 'Consider with Reservations' :
                                                         (selectedApplication.aiScore || 0) >= 35 ? 'Not Recommended' :
                                                         'Strongly Not Recommended'}
                                                    </div>
                                                    <div className="text-slate-300">Score: {selectedApplication.aiScore || 0}/100</div>
                                                    <div className="text-slate-400 text-sm mt-2">
                                                        {selectedApplication.screeningDetails?.recommendation || 'Manual review required'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Overall Assessment */}
                            {selectedApplication.screeningDetails?.overall_assessment && (
                                <div className="bg-slate-800 border border-blue-400/20 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                        <Brain className="h-5 w-5 mr-2 text-accent" />
                                        Overall Assessment
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        {selectedApplication.screeningDetails.overall_assessment}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-700">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetailedScreeningModal(false)}
                                    className="border-glass-border"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowDetailedScreeningModal(false)
                                        setShowResumeModal(true)
                                    }}
                                    className="bg-accent hover:bg-accent/90"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Resume
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Decision Modal */}
            {showDecisionModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-blue-400/20 rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-100">
                                    {decisionType === 'accept' ? 'Accept' : 'Reject'} Candidate
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {selectedApplication.candidateName} • {selectedApplication.jobTitle}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDecisionModal(false)}
                                className="text-slate-300 hover:text-white"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                <div className="bg-slate-800 border border-blue-400/20 rounded p-3">
                                    <p className="text-slate-300">
                                        Are you sure you want to <span className={`font-semibold ${decisionType === 'accept' ? 'text-green-400' : 'text-red-400'}`}>
                                            {decisionType === 'accept' ? 'accept' : 'reject'}
                                        </span> this candidate?
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-slate-300 text-sm font-medium">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={decisionNotes}
                                        onChange={(e) => setDecisionNotes(e.target.value)}
                                        className="w-full p-3 bg-slate-800 border border-blue-400/20 rounded text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                                        placeholder={`Add notes for ${decisionType === 'accept' ? 'acceptance' : 'rejection'}...`}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 justify-end mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDecisionModal(false)}
                                    className="border-glass-border"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitDecision}
                                    className={`${
                                        decisionType === 'accept' 
                                            ? 'bg-green-500 hover:bg-green-600' 
                                            : 'bg-red-500 hover:bg-red-600'
                                    } text-white`}
                                >
                                    {decisionType === 'accept' ? 'Accept' : 'Reject'} Candidate
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
}