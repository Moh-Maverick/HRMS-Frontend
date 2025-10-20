"use client"

import { StatsCard } from "@/components/dashboard/StatsCard"
import { GlassCard } from "@/components/dashboard/GlassCard"
import { Calendar, DollarSign, FileText, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fsGetMyLeaves } from '@/lib/firestoreApi'

const attendanceData = [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 8.5 },
    { day: 'Wed', hours: 7.5 },
    { day: 'Thu', hours: 8 },
    { day: 'Fri', hours: 9 },
]

const recentLeaves = [
    { type: 'Vacation', dates: 'Dec 20-24, 2024', status: 'approved', days: 5 },
    { type: 'Sick Leave', dates: 'Dec 15, 2024', status: 'approved', days: 1 },
    { type: 'Personal', dates: 'Jan 5, 2025', status: 'pending', days: 1 },
]

export default function EmployeeDashboard() {
    const router = useRouter()
    const [leaves, setLeaves] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const handleApplyLeave = () => {
        router.push('/dashboard/employee/leave-request')
    }

    const handleViewPayslips = () => {
        router.push('/dashboard/employee/payroll')
    }

    const handleCheckIn = () => {
        router.push('/dashboard/employee/attendance')
    }

    const handleUpdateProfile = () => {
        router.push('/dashboard/employee/profile')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const leavesData = await fsGetMyLeaves()
                setLeaves(leavesData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 w-full">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Employee Dashboard</h2>
                <p className="text-muted-foreground">Track your attendance, payroll, and leave balance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Calendar}
                    title="Days Present"
                    value="22"
                    subtitle="This month"
                    trend={{ value: 95, isPositive: true }}
                    delay={0}
                />
                <StatsCard
                    icon={DollarSign}
                    title="Current Salary"
                    value="$5,200"
                    subtitle="Monthly gross"
                    delay={0.1}
                />
                <StatsCard
                    icon={Clock}
                    title="Leave Balance"
                    value="12"
                    subtitle="Days remaining"
                    delay={0.2}
                />
                <StatsCard
                    icon={FileText}
                    title="Pending Requests"
                    value={leaves.filter(l => l.status === 'pending').length}
                    subtitle="Leave approval"
                    delay={0.3}
                />
            </div>

            {/* Attendance & Leave History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.4}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">This Week's Attendance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={attendanceData}>
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

                <GlassCard delay={0.5}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">Recent Leave Requests</h3>
                        <Button variant="outline" size="sm" className="border-glass-border">
                            Apply Leave
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {leaves.slice(0, 3).map((leave, index) => (
                            <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-foreground">{leave.type}</p>
                                        <p className="text-sm text-muted-foreground">{leave.from} - {leave.to}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${leave.status === 'approved'
                                        ? 'bg-green-400/20 text-green-400'
                                        : leave.status === 'pending'
                                            ? 'bg-yellow-400/20 text-yellow-400'
                                            : 'bg-red-400/20 text-red-400'
                                        }`}>
                                        {leave.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Payroll Information */}
            <GlassCard delay={0.6}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Latest Payslip</h3>
                    <Button variant="outline" className="border-glass-border">
                        Download PDF
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <p className="text-sm text-muted-foreground mb-1">Gross Salary</p>
                        <p className="text-2xl font-bold text-foreground">$5,200</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <p className="text-sm text-muted-foreground mb-1">Deductions</p>
                        <p className="text-2xl font-bold text-foreground">$780</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <p className="text-sm text-muted-foreground mb-1">Net Salary</p>
                        <p className="text-2xl font-bold text-accent">$4,420</p>
                    </div>
                </div>
            </GlassCard>

            {/* Performance Feedback */}
            <GlassCard delay={0.7}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Recent Feedback</h3>
                <div className="space-y-3">
                    {[
                        { from: 'Manager', date: 'Dec 15, 2024', message: 'Excellent work on the Q4 project delivery', rating: 5 },
                        { from: 'Team Lead', date: 'Nov 28, 2024', message: 'Great collaboration with the team', rating: 4 },
                    ].map((feedback, index) => (
                        <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-foreground">{feedback.from}</p>
                                    <p className="text-xs text-muted-foreground">{feedback.date}</p>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(feedback.rating)].map((_, i) => (
                                        <CheckCircle key={i} className="h-4 w-4 text-accent" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-foreground">{feedback.message}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard delay={0.8}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleApplyLeave}>
                        <Clock className="h-5 w-5" />
                        <span className="text-sm">Apply Leave</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleViewPayslips}>
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">View Payslips</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleCheckIn}>
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm">Check-In</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={handleUpdateProfile}>
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm">Update Profile</span>
                    </Button>
                </div>
            </GlassCard>

            {/* Floating Chat Widget */}
            {/* Rendered globally for employee dashboard */}
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}

        </div>
    )
}


