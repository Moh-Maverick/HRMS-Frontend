"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from '@/components/ui/glass-card'
import { StatsCard } from '@/components/ui/stats-card'
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function ManagerAttendancePage() {
    const [stats, setStats] = useState<{ present: number; absent: number; late: number } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        Api.getAttendance().then((data) => {
            setStats(data)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <DashboardLayout userRole="manager" userName="Team Manager">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="manager" userName="Team Manager">
            <div className="space-y-6 max-w-7xl">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Attendance</h2>
                    <p className="text-gray-600">Monitor your team's attendance and punctuality</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        icon={UserCheck}
                        title="Present Today"
                        value={stats?.present?.toString() || '0'}
                        subtitle="Team members"
                        trend={{ value: 92, isPositive: true }}
                        delay={0}
                    />
                    <StatsCard
                        icon={Users}
                        title="Absent Today"
                        value={stats?.absent?.toString() || '0'}
                        subtitle="On leave/sick"
                        trend={{ value: 8, isPositive: false }}
                        delay={0.1}
                    />
                    <StatsCard
                        icon={Clock}
                        title="Late Arrivals"
                        value={stats?.late?.toString() || '0'}
                        subtitle="This week"
                        trend={{ value: 15, isPositive: false }}
                        delay={0.2}
                    />
                    <StatsCard
                        icon={TrendingUp}
                        title="Attendance Rate"
                        value="94%"
                        subtitle="This month"
                        trend={{ value: 3, isPositive: true }}
                        delay={0.3}
                    />
                </div>

                {/* Attendance Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard delay={0.4}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <UserCheck className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-900">Present</p>
                                        <p className="text-sm text-green-700">{stats?.present || 0} team members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">{stats?.present || 0}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-900">Absent</p>
                                        <p className="text-sm text-red-700">{stats?.absent || 0} team members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-600">{stats?.absent || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-yellow-900">Late</p>
                                        <p className="text-sm text-yellow-700">{stats?.late || 0} team members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-yellow-600">{stats?.late || 0}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard delay={0.5}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Trends</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Monday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">95%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Tuesday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">92%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Wednesday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">88%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Thursday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">94%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Friday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">90%</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Team Attendance Details */}
                <GlassCard delay={0.6}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Attendance Details</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'John Doe', status: 'present', time: '9:00 AM', role: 'Senior Developer' },
                            { name: 'Sarah Miller', status: 'present', time: '9:15 AM', role: 'UI Designer' },
                            { name: 'Mike Roberts', status: 'late', time: '9:45 AM', role: 'Backend Dev' },
                            { name: 'Emily Stone', status: 'present', time: '8:55 AM', role: 'QA Engineer' },
                            { name: 'David Lee', status: 'absent', time: '-', role: 'DevOps' },
                            { name: 'Anna White', status: 'present', time: '9:05 AM', role: 'Frontend Dev' },
                        ].map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                        member.status === 'present' ? 'bg-green-100' : 
                                        member.status === 'late' ? 'bg-yellow-100' : 'bg-red-100'
                                    }`}>
                                        <span className={`text-xs font-semibold ${
                                            member.status === 'present' ? 'text-green-600' : 
                                            member.status === 'late' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {member.name[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{member.name}</p>
                                        <p className="text-sm text-gray-600">{member.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">{member.time}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        member.status === 'present' ? 'bg-green-100 text-green-800' : 
                                        member.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </DashboardLayout>
    )
}


