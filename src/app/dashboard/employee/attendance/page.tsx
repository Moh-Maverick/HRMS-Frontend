"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { fsGetMyAttendance, fsMarkAttendance } from '@/lib/firestoreApi'

const weeklyHours = [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 8.5 },
    { day: 'Wed', hours: 7.5 },
    { day: 'Thu', hours: 8 },
    { day: 'Fri', hours: 9 },
]

export default function EmployeeAttendancePage() {
    const [attendance, setAttendance] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [currentHours, setCurrentHours] = useState('0h 0m')

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const attendanceData = await fsGetMyAttendance()
                setAttendance(attendanceData)

                // Check if user is currently checked in
                const today = new Date().toISOString().split('T')[0]
                const todayRecord = attendanceData.find(record => record.date === today)
                if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
                    setIsCheckedIn(true)
                    // Calculate current hours
                    const checkInTime = new Date(`${today}T${todayRecord.checkIn}`)
                    const now = new Date()
                    const diffMs = now.getTime() - checkInTime.getTime()
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                    setCurrentHours(`${diffHours}h ${diffMinutes}m`)
                }
            } catch (error) {
                console.error('Error fetching attendance:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAttendance()
    }, [])

    const handleCheckInOut = async () => {
        try {
            await fsMarkAttendance(isCheckedIn ? 'absent' : 'present')
            setIsCheckedIn(!isCheckedIn)
            // Refresh attendance data
            const attendanceData = await fsGetMyAttendance()
            setAttendance(attendanceData)
        } catch (error) {
            console.error('Error marking attendance:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading attendance...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">My Attendance</h2>
                <p className="text-muted-foreground">Track your daily attendance and work hours</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard delay={0.1}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                            <p className="text-2xl font-bold text-green-400">{isCheckedIn ? 'Checked In' : 'Checked Out'}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isCheckedIn ? `Today at ${attendance.find(r => r.date === new Date().toISOString().split('T')[0])?.checkIn || '9:00 AM'}` : 'Not checked in today'}
                            </p>
                        </div>
                        <Button size="lg" onClick={handleCheckInOut}>
                            {isCheckedIn ? 'Check Out' : 'Check In'}
                        </Button>
                    </div>
                </GlassCard>

                <GlassCard delay={0.15}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Hours Today</p>
                            <p className="text-2xl font-bold text-accent">{isCheckedIn ? currentHours : '0h 0m'}</p>
                            <p className="text-xs text-muted-foreground mt-1">{isCheckedIn ? 'Still working' : 'Not working'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                            <Clock className="h-8 w-8 text-accent" />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">This Month</p>
                        <p className="text-3xl font-bold text-foreground">{attendance.filter(r => r.checkOut).length}</p>
                        <p className="text-xs text-muted-foreground">days present</p>
                    </div>
                </GlassCard>

                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Avg Hours/Day</p>
                        <p className="text-3xl font-bold text-secondary">8.2h</p>
                    </div>
                </GlassCard>

                <GlassCard delay={0.3}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">On-Time Rate</p>
                        <p className="text-3xl font-bold text-green-400">95%</p>
                    </div>
                </GlassCard>

                <GlassCard delay={0.35}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                        <p className="text-3xl font-bold text-accent">176h</p>
                    </div>
                </GlassCard>
            </div>

            {/* Weekly Chart */}
            <GlassCard delay={0.4}>
                <h3 className="text-xl font-semibold text-foreground mb-4">This Week's Hours</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyHours}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                border: '2px solid #F7A800',
                                borderRadius: '12px',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                padding: '12px 16px',
                                boxShadow: '0 8px 32px rgba(247, 168, 0, 0.3)'
                            }}
                            labelStyle={{
                                color: '#F7A800',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        />
                        <Line type="monotone" dataKey="hours" stroke="#F7A800" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </GlassCard>

            {/* Recent Attendance */}
            <GlassCard delay={0.5}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Recent Attendance</h3>
                    <Button variant="outline" className="border-glass-border">View All</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-glass-border">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Check In</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Check Out</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.slice(0, 5).map((record, index) => (
                                <tr key={index} className="border-b border-glass-border/50">
                                    <td className="py-3 px-4 font-medium text-foreground">{record.date}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{record.checkIn || '-'}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{record.checkOut || '-'}</td>
                                    <td className="py-3 px-4">
                                        {record.checkOut ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-400/20 text-green-400 text-xs font-medium">
                                                <CheckCircle className="h-3 w-3" />
                                                {record.hours || '8h 0m'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-medium">
                                                <Clock className="h-3 w-3" />
                                                In Progress
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}