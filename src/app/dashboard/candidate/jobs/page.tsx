"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase, MapPin, Clock, DollarSign, Users, Search, Send, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
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
                const jobsData = await fsGetAvailableJobs()
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

    const handleApply = (job: any) => {
        setSelectedJob(job)
        setShowApplicationForm(true)
    }

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            await fsApplyForJob(selectedJob.id, applicationData)
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
        } finally {
            setSubmitting(false)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setApplicationData({ ...applicationData, resume: file })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        )
    }

    if (showApplicationForm) {
        return (
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Job</h2>
                        <p className="text-gray-600">Complete your application for {selectedJob?.title} at {selectedJob?.company}</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowApplicationForm(false)} className="border-gray-300">
                        Back to Jobs
                    </Button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-6">
                    {/* Personal Information */}
                    <GlassCard delay={0.1}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={applicationData.candidateName}
                                    onChange={(e) => setApplicationData({ ...applicationData, candidateName: e.target.value })}
                                    className="bg-white border-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={applicationData.email}
                                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                                    className="bg-white border-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    value={applicationData.phone}
                                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                                    className="bg-white border-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-gray-700">Current Location *</Label>
                                <Input
                                    id="location"
                                    value={applicationData.currentLocation}
                                    onChange={(e) => setApplicationData({ ...applicationData, currentLocation: e.target.value })}
                                    className="bg-white border-gray-300"
                                    required
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Education */}
                    <GlassCard delay={0.2}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Education Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="education" className="text-gray-700">Highest Education *</Label>
                                <select
                                    id="education"
                                    value={applicationData.education}
                                    onChange={(e) => setApplicationData({ ...applicationData, education: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
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
                                <Label htmlFor="college" className="text-gray-700">College/University *</Label>
                                <Input
                                    id="college"
                                    value={applicationData.college}
                                    onChange={(e) => setApplicationData({ ...applicationData, college: e.target.value })}
                                    className="bg-white border-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="marks" className="text-gray-700">Marks/Percentage *</Label>
                                <Input
                                    id="marks"
                                    value={applicationData.marks}
                                    onChange={(e) => setApplicationData({ ...applicationData, marks: e.target.value })}
                                    className="bg-white border-gray-300"
                                    placeholder="e.g., 85% or 8.5 CGPA"
                                    required
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Experience & Skills */}
                    <GlassCard delay={0.3}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience & Skills</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-gray-700">Work Experience *</Label>
                                <Textarea
                                    id="experience"
                                    value={applicationData.experience}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicationData({ ...applicationData, experience: e.target.value })}
                                    className="bg-white border-gray-300 min-h-[100px]"
                                    placeholder="Describe your work experience, projects, and achievements..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills" className="text-gray-700">Skills *</Label>
                                <Textarea
                                    id="skills"
                                    value={applicationData.skills}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicationData({ ...applicationData, skills: e.target.value })}
                                    className="bg-white border-gray-300 min-h-[80px]"
                                    placeholder="List your technical skills, programming languages, tools, etc."
                                    required
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Resume & Cover Letter */}
                    <GlassCard delay={0.4}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume & Cover Letter</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700">Upload Resume *</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, DOC up to 5MB</p>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="resume-upload"
                                        required
                                    />
                                    <label htmlFor="resume-upload" className="cursor-pointer">
                                        <Button variant="outline" className="mt-2 border-gray-300">
                                            Choose File
                                        </Button>
                                    </label>
                                </div>
                                {applicationData.resume && (
                                    <p className="text-sm text-green-600">✓ Resume uploaded successfully</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coverLetter" className="text-gray-700">Cover Letter</Label>
                                <Textarea
                                    id="coverLetter"
                                    value={applicationData.coverLetter}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                    className="bg-white border-gray-300 min-h-[120px]"
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
                            className="border-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting} className="gap-2 bg-orange-500 hover:bg-orange-600">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Jobs</h2>
                <p className="text-gray-600">Find and apply for jobs that match your skills</p>
            </div>

            {/* Search */}
            <GlassCard delay={0.1}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search jobs by title, company, or location..."
                            className="pl-10 bg-white border-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-gray-300">Filter</Button>
                </div>
            </GlassCard>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                    <GlassCard key={index} delay={0.2 + index * 0.05}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-orange-100 border border-orange-200">
                                    <Briefcase className="h-6 w-6 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                                    <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
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
                                    <p className="text-sm text-gray-700 mb-2">{job.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {job.requirements?.map((req: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Posted {job.postedDate} • {job.applicants} applicants</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => handleApply(job)}
                                    className="bg-orange-500 hover:bg-orange-600"
                                >
                                    Apply Now
                                </Button>
                                <Button variant="outline" className="border-gray-300">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}
