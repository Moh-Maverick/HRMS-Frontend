"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Users, Mail, Phone, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetTeamMembers } from '@/lib/firestoreApi'

export default function ManagerTeamPage() {
    const [teamMembers, setTeamMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const membersData = await fsGetTeamMembers()
                setTeamMembers(membersData)
            } catch (error) {
                console.error('Error fetching team members:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTeamMembers()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading team...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">My Team</h2>
                <p className="text-gray-600">Manage and monitor your team members</p>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Members</p>
                        <p className="text-3xl font-bold text-orange-500">{teamMembers.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Online Now</p>
                        <p className="text-3xl font-bold text-green-400">{teamMembers.filter(m => m.status === 'online').length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Avg Performance</p>
                        <p className="text-3xl font-bold text-blue-500">88%</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Projects Active</p>
                        <p className="text-3xl font-bold text-gray-900">8</p>
                    </div>
                </GlassCard>
            </div>

            {/* Team Members */}
            <div className="space-y-4">
                {teamMembers.map((member, index) => (
                    <GlassCard key={index} delay={0.3 + index * 0.05}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-orange-600 font-semibold text-2xl">{member.name?.[0] || 'M'}</span>
                                    </div>
                                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name || 'Team Member'}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{member.role || 'Employee'}</p>
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {member.email || 'No email'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {member.phone || 'No phone'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:items-end gap-3">
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Performance</p>
                                        <p className="text-xl font-bold text-orange-500">{member.performance || 85}%</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-gray-300">
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm">View Profile</Button>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}