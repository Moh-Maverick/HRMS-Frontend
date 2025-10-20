"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase, MapPin, Clock, DollarSign, Users, Search, Send, Upload, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import JDModal from '@/components/JDModal'
import { fsGetAvailableJobs, fsApplyForJob } from '@/lib/firestoreApi'

const jobs = [
    {
        id: '1',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'Bangalore, India',
        type: 'Full-time',
        salary: '₹12-18 LPA',
        experience: '3-5 years',
        description: 'We are looking for a Senior Full Stack Developer to join our team...',
        requirements: ['React', 'Node.js', 'MongoDB', 'AWS'],
        postedDate: '2 days ago',
        applicants: 24
    },
    {
        id: '2',
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Mumbai, India',
        type: 'Full-time',
        salary: '₹8-12 LPA',
        experience: '2-4 years',
        description: 'Creative UI/UX Designer needed for our design team...',
        requirements: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping'],
        postedDate: '5 days ago',
        applicants: 18
    },
    {
        id: '3',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'Full-time',
        salary: '₹15-25 LPA',
        experience: '4-6 years',
        description: 'Lead product strategy and development for our platform...',
        requirements: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
        postedDate: '1 week ago',
        applicants: 32
    }
]

export default function CandidateJobsPage() {
    const [jobsList, setJobsList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [showApplicationForm, setShowApplicationForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [showJDModal, setShowJDModal] = useState(false)
    const [applicationData, setApplicationData] = useState({
        candidateName: '',
        email: '',
        phone: '',
        currentLocation: '',
        education: '',
        college: '',
        marks: '',
        experience: '',
        skills: '',
        resume: null as File | null,
        coverLetter: ''
    })

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                console.log('Fetching jobs for candidate dashboard...')
                const jobsData = await fsGetAvailableJobs()
                console.log('Fetched jobs data:', jobsData)
                setJobsList(jobsData.length > 0 ? jobsData : jobs)
            } catch (error) {
                console.error('Error fetching jobs:', error)
                setJobsList(jobs)
            } finally {
                setLoading(false)
            }
        }
        fetchJobs()
    }, [])

    const filteredJobs = jobsList.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleViewJD = (job: any) => {
        setSelectedJob(job)
        setShowJDModal(true)
    }

    const handleApply = (job: any) => {
        setSelectedJob(job)
        setShowApplicationForm(true)
    }

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            console.log('Submitting application for job:', selectedJob?.title)
            console.log('Application data:', applicationData)
            
            const result = await fsApplyForJob(selectedJob.id, applicationData)
            
            if (result.success === false) {
                console.error('Application submission failed:', result.error)
                alert('Failed to submit application: ' + (result.error || 'Unknown error'))
                return
            }
            
            console.log('Application submitted successfully:', result)
            alert('Application submitted successfully!')
            
            setShowApplicationForm(false)
            setSelectedJob(null)
            setApplicationData({
                candidateName: '',
                email: '',
                phone: '',
                currentLocation: '',
                education: '',
                college: '',
                marks: '',
                experience: '',
                skills: '',
                resume: null,
                coverLetter: ''
            })
        } catch (error) {
            console.error('Error submitting application:', error)
            alert('Failed to submit application. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const files = e.dataTransfer.files
        if (files && files[0]) {
            processFile(files[0])
        }
    }

    const processFile = (file: File) => {
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, or DOCX file only.')
            return
        }
        
        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 5MB.')
            return
        }
        
        console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type)
        setApplicationData({ ...applicationData, resume: file })
    }

    const removeFile = () => {
        setApplicationData({ ...applicationData, resume: null })
        // Clear the file input
        const fileInput = document.getElementById('resume-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading jobs...</p>
                </div>
            </div>
        )
    }

    if (showApplicationForm) {
        return (
            <div className="space-y-6 max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Apply for Job</h2>
                            <p className="text-muted-foreground">Complete your application for {selectedJob?.title} at {selectedJob?.company}</p>
                        </div>
                        <Button variant="outline" onClick={() => setShowApplicationForm(false)} className="border-glass-border">
                            Back to Jobs
                        </Button>
                    </div>

                    <form onSubmit={handleSubmitApplication} className="space-y-6">
                        {/* Personal Information */}
                        <GlassCard delay={0.1}>
                            <h3 className="text-xl font-semibold text-foreground mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={applicationData.candidateName}
                                        onChange={(e) => setApplicationData({ ...applicationData, candidateName: e.target.value })}
                                        className="bg-background border-glass-border"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={applicationData.email}
                                        onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                                        className="bg-background border-glass-border"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        value={applicationData.phone}
                                        onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                                        className="bg-background border-glass-border"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-foreground">Current Location *</Label>
                                    <Input
                                        id="location"
                                        value={applicationData.currentLocation}
                                        onChange={(e) => setApplicationData({ ...applicationData, currentLocation: e.target.value })}
                                        className="bg-background border-glass-border"
                                        required
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Education */}
                        <GlassCard delay={0.2}>
                            <h3 className="text-xl font-semibold text-foreground mb-4">Education Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="education" className="text-foreground">Highest Education *</Label>
                                    <select
                                        id="education"
                                        value={applicationData.education}
                                        onChange={(e) => setApplicationData({ ...applicationData, education: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-glass-border rounded-md"
                                        required
                                    >
                                        <option value="">Select Education</option>
                                        <option value="High School">High School</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Bachelor's">Bachelor's Degree</option>
                                        <option value="Master's">Master's Degree</option>
                                        <option value="PhD">PhD</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="college" className="text-foreground">College/University *</Label>
                                    <Input
                                        id="college"
                                        value={applicationData.college}
                                        onChange={(e) => setApplicationData({ ...applicationData, college: e.target.value })}
                                        className="bg-background border-glass-border"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="marks" className="text-foreground">Marks/Percentage *</Label>
                                    <Input
                                        id="marks"
                                        value={applicationData.marks}
                                        onChange={(e) => setApplicationData({ ...applicationData, marks: e.target.value })}
                                        className="bg-background border-glass-border"
                                        placeholder="e.g., 85% or 8.5 CGPA"
                                        required
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Experience & Skills */}
                        <GlassCard delay={0.3}>
                            <h3 className="text-xl font-semibold text-foreground mb-4">Experience & Skills</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience" className="text-foreground">Work Experience *</Label>
                                    <Textarea
                                        id="experience"
                                        value={applicationData.experience}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicationData({ ...applicationData, experience: e.target.value })}
                                        className="bg-background border-glass-border min-h-[100px]"
                                        placeholder="Describe your work experience, projects, and achievements..."
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skills" className="text-foreground">Skills *</Label>
                                    <Textarea
                                        id="skills"
                                        value={applicationData.skills}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicationData({ ...applicationData, skills: e.target.value })}
                                        className="bg-background border-glass-border min-h-[80px]"
                                        placeholder="List your technical skills, programming languages, tools, etc."
                                        required
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Resume & Cover Letter */}
                        <GlassCard delay={0.4}>
                            <h3 className="text-xl font-semibold text-foreground mb-4">Resume & Cover Letter</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-foreground">Upload Resume *</Label>
                                    <div 
                                        className="border-2 border-dashed border-glass-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer"
                                        onClick={() => document.getElementById('resume-upload')?.click()}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 5MB</p>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="resume-upload"
                                            required
                                        />
                                        <Button 
                                            type="button"
                                            variant="outline" 
                                            className="mt-2 border-glass-border"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                document.getElementById('resume-upload')?.click()
                                            }}
                                        >
                                            Choose File
                                        </Button>
                                    </div>
                                    {applicationData.resume && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-green-400 flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Resume uploaded successfully: {applicationData.resume.name}
                                                    </p>
                                                    <p className="text-xs text-green-300 mt-1">
                                                        Size: {(applicationData.resume.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removeFile}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="coverLetter" className="text-foreground">Cover Letter</Label>
                                    <Textarea
                                        id="coverLetter"
                                        value={applicationData.coverLetter}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                        className="bg-background border-glass-border min-h-[120px]"
                                        placeholder="Write a cover letter explaining why you're interested in this position..."
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        <div className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowApplicationForm(false)}
                                className="border-glass-border"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="gap-2 bg-accent hover:bg-accent/90">
                                <Send className="h-4 w-4" />
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Available Jobs</h2>
                <p className="text-muted-foreground">Find and apply for jobs that match your skills</p>
            </div>

            {/* Search */}
            <GlassCard delay={0.1}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search jobs by title, company, or location..."
                            className="pl-10 bg-background border-glass-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-glass-border">Filter</Button>
                </div>
            </GlassCard>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                    <GlassCard key={index} delay={0.2 + index * 0.05}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                                    <Briefcase className="h-6 w-6 text-accent" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-foreground mb-1">{job.title}</h3>
                                    <p className="text-lg text-muted-foreground mb-2">{job.company}</p>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {job.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            {job.salary}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {job.experience}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {job.requirements?.map((req: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Posted {job.postedDate} • {job.applicants} applicants</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => handleApply(job)}
                                    className="bg-accent hover:bg-accent/90"
                                >
                                    Apply Now
                                </Button>
                                <Button variant="outline" className="border-glass-border" onClick={() => handleViewJD(job)}>
                                    View JD
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <JDModal
                job={selectedJob}
                isOpen={showJDModal}
                onClose={() => setShowJDModal(false)}
            />
        </div>
    )
}
