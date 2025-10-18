"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fsGetMyAttendance, fsMarkAttendance } from '@/lib/firestoreApi'

export default function EmployeeAttendancePage() {
    const [attendance, setAttendance] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [todayStatus, setTodayStatus] = useState<'present' | 'absent' | 'pending'>('pending')

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const attendanceData = await fsGetMyAttendance()
                setAttendance(attendanceData)

                // Check today's status
                const today = new Date().toISOString().split('T')[0]
                const todayRecord = attendanceData.find(record => record.date === today)
                if (todayRecord) {
                    setTodayStatus(todayRecord.status === 'present' ? 'present' : 'absent')
                }
            } catch (error) {
                console.error('Error fetching attendance:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAttendance()
    }, [])

    const markAttendance = async (status: 'present' | 'absent') => {
        try {
            const result = await fsMarkAttendance(status)
            if (result.success) {
                // Refresh attendance data
                const attendanceData = await fsGetMyAttendance()
                setAttendance(attendanceData)

                // Update today's status
                const today = new Date().toISOString().split('T')[0]
                const todayRecord = attendanceData.find(record => record.date === today)
                if (todayRecord) {
                    setTodayStatus(todayRecord.status === 'present' ? 'present' : 'absent')
                }
            }
        } catch (error) {
            console.error('Error marking attendance:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading attendance...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Attendance Management</h2>
                <p className="text-muted-foreground">Track your daily attendance and view history</p>
            </div>

            {/* Today's Status */}
            <GlassCard delay={0}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Today's Attendance</h3>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center mb-6">
                    <div className={`p-6 rounded-2xl border-2 ${todayStatus === 'present'
                        ? 'border-green-400 bg-green-400/10'
                        : todayStatus === 'absent'
                            ? 'border-red-400 bg-red-400/10'
                            : 'border-muted bg-muted/30'
                        }`}>
                        {todayStatus === 'present' ? (
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                                <span className="text-2xl font-bold text-green-400">Present</span>
                            </div>
                        ) : todayStatus === 'absent' ? (
                            <div className="flex items-center gap-3">
                                <XCircle className="h-8 w-8 text-red-400" />
                                <span className="text-2xl font-bold text-red-400">Absent</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Clock className="h-8 w-8 text-muted-foreground" />
                                <span className="text-2xl font-bold text-muted-foreground">Not Marked</span>
                            </div>
                        )}
                    </div>
                </div>

                {todayStatus === 'pending' && (
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => markAttendance('present')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Present
                        </Button>
                        <Button
                            onClick={() => markAttendance('absent')}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Mark Absent
                        </Button>
                    </div>
                )}
            </GlassCard>

            {/* Attendance History */}
            <GlassCard delay={0.1}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Attendance History</h3>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last 30 days</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {attendance.slice(0, 10).map((record, index) => (
                        <div key={record.id || index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${record.status === 'present'
                                        ? 'bg-green-400/20'
                                        : 'bg-red-400/20'
                                        }`}>
                                        {record.status === 'present' ? (
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {record.timestamp ? new Date(record.timestamp).toLocaleTimeString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === 'present'
                                    ? 'bg-green-400/20 text-green-400'
                                    : 'bg-red-400/20 text-red-400'
                                    }`}>
                                    {record.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard delay={0.2}>
                <h3 className="text-xl font-semibold text-foreground mb-4">This Month's Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-muted-foreground">Days Present</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {attendance.filter(record => record.status === 'present').length}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-muted-foreground">Days Absent</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {attendance.filter(record => record.status === 'absent').length}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Attendance Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                            {attendance.length > 0
                                ? Math.round((attendance.filter(record => record.status === 'present').length / attendance.length) * 100)
                                : 0}%
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}


