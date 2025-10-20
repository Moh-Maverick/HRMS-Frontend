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
    Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetAllApplications, screenResume } from '@/lib/firestoreApi'

interface ScreeningDetails {
    overall_assessment?: string
    strengths?: string[]
    weaknesses?: string[]
    recommendation?: string
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

  useEffect(() => {
        const fetchApplications = async () => {
            try {
                console.log('Fetching applications for candidates page...')
                const applicationsData = await fsGetAllApplications()
                console.log('Fetched applications:', applicationsData)
                setApplications(applicationsData)
      } catch (error) {
                console.error('Error fetching applications:', error)
      } finally {
        setLoading(false)
      }
    }
        fetchApplications()
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

    const handleResumeScreening = async (application: Application) => {
        if (!application.resume) {
            alert('No resume available for screening')
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
                // Update the application with AI score
                setSelectedApplication({
                    ...application,
                    aiScore: result.ai_score,
                    screeningDetails: result.analysis
                })
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
        // TODO: Implement email functionality
        console.log('Sending email to:', application.email)
        alert(`Email functionality will be implemented. Would send email to: ${application.email}`)
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
          <Button variant="outline" className="border-glass-border">Sort by Score</Button>
                    </div>
        </div>
      </GlassCard>

      {/* Candidates List */}
      <div className="space-y-4">
                {filteredApplications.length === 0 ? (
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
                    filteredApplications.map((application, index) => (
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
                                    
                <div className="flex gap-2">
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
                                            className="border-glass-border"
                                            onClick={() => handleResumeScreening(application)}
                                        >
                                            <Brain className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            size="sm"
                                            onClick={() => handleViewDetails(application)}
                                        >
                                            View Details
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
                                                className="border-glass-border"
                                            >
                                                <Brain className="h-4 w-4 mr-2" />
                                                Resume Screening
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
                                                // TODO: Show detailed screening results
                                                console.log('Showing detailed results for:', selectedApplication.candidateName)
                                            }}
                                            className="bg-accent hover:bg-accent/90"
                                        >
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            View Full Details
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
    </div>
  )
}