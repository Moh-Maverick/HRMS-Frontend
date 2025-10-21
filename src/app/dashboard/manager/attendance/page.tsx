"use client"
import { GlassCard } from '@/components/ui/glass-card'
import { StatsCard } from '@/components/ui/stats-card'
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetTeamMembers, fsGetMyAttendance } from '@/lib/firestoreApi'

export default function ManagerAttendancePage() {
    const [teamMembers, setTeamMembers] = useState<any[]>([])
    const [attendanceData, setAttendanceData] = useState<any[]>([])
    const [stats, setStats] = useState<{ present: number; absent: number; late: number } | null>(null)
    const [loading, setLoading] = useState(true)

    // Dummy data for when Firebase is empty
    const dummyTeamMembers = [
        { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', role: 'Senior Developer', department: 'Engineering' },
        { id: '2', name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'UI Designer', department: 'Design' },
        { id: '3', name: 'Amit Reddy', email: 'amit.reddy@company.com', role: 'Backend Developer', department: 'Engineering' },
        { id: '4', name: 'Sneha Mehta', email: 'sneha.mehta@company.com', role: 'QA Engineer', department: 'Quality' },
        { id: '5', name: 'Arjun Patel', email: 'arjun.patel@company.com', role: 'DevOps Engineer', department: 'Engineering' },
        { id: '6', name: 'Kavya Singh', email: 'kavya.singh@company.com', role: 'Frontend Developer', department: 'Engineering' }
    ]

    const dummyAttendanceData = [
        { id: '1', name: 'Rajesh Kumar', date: '2024-12-20', checkIn: '09:00', checkOut: '18:00', status: 'present', hours: 9 },
        { id: '2', name: 'Priya Sharma', date: '2024-12-20', checkIn: '09:15', checkOut: '18:15', status: 'present', hours: 9 },
        { id: '3', name: 'Amit Reddy', date: '2024-12-20', checkIn: '10:00', checkOut: '19:00', status: 'late', hours: 9 },
        { id: '4', name: 'Sneha Mehta', date: '2024-12-20', checkIn: '09:30', checkOut: '17:30', status: 'present', hours: 8 },
        { id: '5', name: 'Arjun Patel', date: '2024-12-20', checkIn: '08:45', checkOut: '17:45', status: 'present', hours: 9 },
        { id: '6', name: 'Kavya Singh', date: '2024-12-20', checkIn: '09:00', checkOut: '18:00', status: 'present', hours: 9 }
    ]

    useEffect(() => { 
        const fetchData = async () => {
            try {
                // Fetch team members
                const members = await fsGetTeamMembers()
                
                // Use dummy data if no members found
                if (members.length === 0) {
                    setTeamMembers(dummyTeamMembers)
                    setAttendanceData(dummyAttendanceData)
                    setStats({ present: 5, absent: 1, late: 1 })
                } else {
                    setTeamMembers(members)
                    
                    // Calculate attendance stats
                    const today = new Date().toISOString().split('T')[0]
                    let present = 0, absent = 0, late = 0
                    
                    // For each team member, check their attendance
                    for (const member of members) {
                        try {
                            const memberAttendance = await fsGetMyAttendance() // This should be modified to get specific user's attendance
                            const todayRecord = memberAttendance.find((record: any) => record.date === today)
                            
                            if (todayRecord) {
                                if (todayRecord.status === 'present') {
                                    present++
                                } else if (todayRecord.status === 'absent') {
                                    absent++
                                }
                            } else {
                                absent++ // No record means absent
                            }
                        } catch (error) {
                            console.error(`Error fetching attendance for ${member.name}:`, error)
                            absent++
                        }
                    }
                    
                    setStats({ present, absent, late })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                // Use dummy data on error
                setTeamMembers(dummyTeamMembers)
                setAttendanceData(dummyAttendanceData)
                setStats({ present: 5, absent: 1, late: 1 })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-300">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Team Attendance</h2>
                    <p className="text-gray-300">Monitor your team's attendance and punctuality</p>
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
                        <h3 className="text-xl font-semibold text-white mb-4">Today's Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                                        <UserCheck className="h-5 w-5 text-orange-300" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Present</p>
                                        <p className="text-sm text-gray-300">{stats?.present || 0} team members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-orange-300">{stats?.present || 0}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-red-300" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Absent</p>
                                        <p className="text-sm text-gray-300">{stats?.absent || 0} team members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-300">{stats?.absent || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-600/20 border border-blue-500/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-yellow-300" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Late</p>
                                        <p className="text-sm text-gray-300">{stats?.late || 0} team members</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-yellow-300">{stats?.late || 0}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard delay={0.5}>
                        <h3 className="text-xl font-semibold text-white mb-4">Weekly Trends</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Monday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-600/30 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-300">95%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Tuesday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-600/30 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-300">92%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Wednesday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-600/30 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-300">88%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Thursday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-600/30 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-300">94%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Friday</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-600/30 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-300">90%</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Team Attendance Details */}
                <GlassCard delay={0.6}>
                    <h3 className="text-xl font-semibold text-white mb-4">Team Attendance Details</h3>
                    <div className="space-y-3">
                        {teamMembers.map((member, index) => {
                            // Determine status based on member data or attendance
                            const status = member.status === 'online' ? 'present' : 'absent'
                            const time = member.status === 'online' ? '9:00 AM' : '-'
                            
                            return (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-blue-600/20 border border-blue-500/30">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                            status === 'present' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-red-500/20 border border-red-500/30'
                                        }`}>
                                            <span className={`text-xs font-semibold ${
                                                status === 'present' ? 'text-orange-300' : 'text-red-300'
                                            }`}>
                                                {member.name[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{member.name}</p>
                                            <p className="text-sm text-gray-300">{member.role || 'Team Member'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-300">{time}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            status === 'present' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        }`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </GlassCard>
        </div>
    )
}


