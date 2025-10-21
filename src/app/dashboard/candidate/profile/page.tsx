"use client"

import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  MapPin,
  GraduationCap,
  Briefcase
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { fsGetCandidateProfile, fsUpdateCandidateProfile } from '@/lib/firestoreApi'

// ✅ Define the structure of a candidate profile
interface CandidateProfile {
  fullName?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  skills?: string
  experience?: string
  education?: string
  resume?: File | string | null
}

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<CandidateProfile>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    resume: null
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fsGetCandidateProfile();

        // Set profile state (can be null)
        setProfile(profileData || null);

        // Set formData safely
        setFormData({
          fullName: profileData?.fullName ?? '',
          email: profileData?.email ?? '',
          phone: profileData?.phone ?? '',
          location: profileData?.location ?? '',
          summary: profileData?.summary ?? '',
          skills: profileData?.skills ?? '',
          experience: profileData?.experience ?? '',
          education: profileData?.education ?? '',
          resume: profileData?.resume ?? null,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleSave = async () => {
    try {
      await fsUpdateCandidateProfile(formData)
      setIsEditing(false)
      const updatedProfile = await fsGetCandidateProfile()
      setProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        summary: profile.summary || '',
        skills: profile.skills || '',
        experience: profile.experience || '',
        education: profile.education || '',
        resume: profile.resume ?? null
      })
    }
    setIsEditing(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, resume: file })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-600">Complete your profile to improve your chances</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <GlassCard delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
            <User className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                placeholder="Enter your full name"
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  placeholder="your.email@example.com"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  placeholder="+1 234 567 8900"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  placeholder="City, Country"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-gray-700">Professional Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="bg-white border-gray-300 min-h-[100px] text-gray-900 placeholder:text-gray-500"
              placeholder="Tell us about yourself, your skills, and career goals..."
              disabled={!isEditing}
            />
          </div>
        </div>
      </GlassCard>

      {/* Skills & Experience */}
      <GlassCard delay={0.2}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
            <Briefcase className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Skills & Experience</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-gray-700">Skills</Label>
            <Textarea
              id="skills"
              value={formData.skills || ''}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="bg-white border-gray-300 min-h-[80px] text-gray-900 placeholder:text-gray-500"
              placeholder="List your technical skills, programming languages, tools, etc."
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-gray-700">Work Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience || ''}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="bg-white border-gray-300 min-h-[120px] text-gray-900 placeholder:text-gray-500"
              placeholder="Describe your work experience, projects, and achievements..."
              disabled={!isEditing}
            />
          </div>
        </div>
      </GlassCard>

      {/* Education */}
      <GlassCard delay={0.3}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-100 border border-green-200">
            <GraduationCap className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Education</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="education" className="text-gray-700">Educational Background</Label>
          <Textarea
            id="education"
            value={formData.education || ''}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            className="bg-white border-gray-300 min-h-[100px] text-gray-900 placeholder:text-gray-500"
            placeholder="List your educational qualifications, degrees, certifications, etc."
            disabled={!isEditing}
          />
        </div>
      </GlassCard>

      {/* Resume Upload */}
      <GlassCard delay={0.4}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
            <FileText className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Resume</h3>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Upload Resume</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-all cursor-pointer">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC up to 5MB</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
              disabled={!isEditing}
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Button variant="outline" className="mt-2 border-gray-300" disabled={!isEditing}>
                Choose File
              </Button>
            </label>
          </div>
          {formData.resume && (
            <p className="text-sm text-green-600">✓ Resume uploaded successfully</p>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
