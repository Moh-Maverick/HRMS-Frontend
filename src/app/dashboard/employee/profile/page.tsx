"use client"

import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetUserProfile, fsUpdateUserProfile } from '@/lib/firestoreApi'

type EmployeeProfile = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    emergencyContact: string
    emergencyPhone: string
    emergencyRelationship: string
    position?: string
    department?: string
    employmentType?: string
    joinDate?: string
    manager?: string
    employeeId?: string
}

export default function EmployeeProfilePage() {
    const [profile, setProfile] = useState<EmployeeProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        emergencyRelationship: '',
        position: '',
        department: '',
        employmentType: '',
        joinDate: '',
        manager: '',
        employeeId: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileDataRaw = await fsGetUserProfile()
                if (profileDataRaw) {
                    const profileData: EmployeeProfile = {
                        name: '',
                        email: '',
                        phone: '',
                        address: '',
                        emergencyContact: '',
                        emergencyPhone: '',
                        emergencyRelationship: '',
                        position: '',
                        department: '',
                        employmentType: '',
                        joinDate: '',
                        manager: '',
                        employeeId: '',
                        ...profileDataRaw
                    }

                    setProfile(profileData)
                    setFormData({
                        name: profileData.name,
                        email: profileData.email,
                        phone: profileData.phone,
                        address: profileData.address,
                        emergencyContact: profileData.emergencyContact,
                        emergencyPhone: profileData.emergencyPhone,
                        emergencyRelationship: profileData.emergencyRelationship,
                        position: profileData.position || '',
                        department: profileData.department || '',
                        employmentType: profileData.employmentType || '',
                        joinDate: profileData.joinDate || '',
                        manager: profileData.manager || '',
                        employeeId: profileData.employeeId || ''
                    })
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleSave = async () => {
        try {
            await fsUpdateUserProfile(formData)
            setIsEditing(false)
            const updatedProfileRaw = await fsGetUserProfile()
            if (updatedProfileRaw) {
                const updatedProfile: EmployeeProfile = {
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    emergencyContact: '',
                    emergencyPhone: '',
                    emergencyRelationship: '',
                    position: '',
                    department: '',
                    employmentType: '',
                    joinDate: '',
                    manager: '',
                    employeeId: '',
                    ...updatedProfileRaw
                }
                setProfile(updatedProfile)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                emergencyContact: profile.emergencyContact,
                emergencyPhone: profile.emergencyPhone,
                emergencyRelationship: profile.emergencyRelationship,
                position: profile.position || '',
                department: profile.department || '',
                employmentType: profile.employmentType || '',
                joinDate: profile.joinDate || '',
                manager: profile.manager || '',
                employeeId: profile.employeeId || ''
            })
        }
        setIsEditing(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">My Profile</h2>
                <p className="text-muted-foreground">View and manage your personal information</p>
            </div>

            {/* Profile Header */}
            <GlassCard delay={0.1}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold text-4xl">{profile?.name?.[0] || 'E'}</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-foreground mb-1">{profile?.name}</h3>
                        <p className="text-muted-foreground mb-2">{profile?.position || 'Employee'}</p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                                {profile?.employmentType || 'Full-time'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                                {profile?.department || 'General'}
                            </span>
                        </div>
                    </div>
                    <Button onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>
            </GlassCard>

            {/* Personal Information */}
            <GlassCard delay={0.2}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                        <User className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-background/50 border-glass-border"
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="pl-10 bg-background/50 border-glass-border"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="pl-10 bg-background/50 border-glass-border"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-foreground">Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="pl-10 bg-background/50 border-glass-border"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Emergency Contact */}
            <GlassCard delay={0.3}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                        <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-foreground">Contact Name</Label>
                        <Input
                            value={formData.emergencyContact}
                            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            className="bg-background/50 border-glass-border"
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Relationship</Label>
                        <Input
                            value={formData.emergencyRelationship}
                            onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                            className="bg-background/50 border-glass-border"
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-foreground">Phone Number</Label>
                        <Input
                            value={formData.emergencyPhone}
                            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                            className="bg-background/50 border-glass-border"
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Save/Cancel Buttons */}
            {isEditing && (
                <div className="flex gap-4 justify-end">
                    <Button variant="outline" onClick={handleCancel} className="border-glass-border">
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            )}
        </div>
    )
}
