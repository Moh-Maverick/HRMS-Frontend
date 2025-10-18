"use client"
import { StatsCard } from '@/components/dashboard/StatsCard'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Users, Building2, Cpu, FileText, TrendingUp, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useEffect, useState } from 'react'
import { fsGetUsers, fsGetDepartments } from '@/lib/firestoreApi'

const userGrowthData = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 180 },
    { month: 'Apr', users: 220 },
    { month: 'May', users: 280 },
    { month: 'Jun', users: 340 },
]

const departmentData = [
    { name: 'Engineering', count: 45 },
    { name: 'Marketing', count: 28 },
    { name: 'Sales', count: 35 },
    { name: 'HR', count: 12 },
    { name: 'Finance', count: 18 },
]

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([])
    const [departments, setDepartments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, departmentsData] = await Promise.all([
                    fsGetUsers(),
                    fsGetDepartments()
                ])
                setUsers(usersData)
                setDepartments(departmentsData)
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">System Overview</h2>
                <p className="text-muted-foreground">Monitor and manage your entire HRMS platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={Users}
                    title="Total Users"
                    value={users.length}
                    subtitle="Across all roles"
                    trend={{ value: 12, isPositive: true }}
                    delay={0}
                />
                <StatsCard
                    icon={Building2}
                    title="Departments"
                    value={departments.length}
                    subtitle="Active departments"
                    delay={0.1}
                />
                <StatsCard
                    icon={Cpu}
                    title="AI Models"
                    value="5"
                    subtitle="Running models"
                    trend={{ value: 8, isPositive: true }}
                    delay={0.2}
                />
                <StatsCard
                    icon={FileText}
                    title="Reports Generated"
                    value="1,247"
                    subtitle="This month"
                    delay={0.3}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.4}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 27, 56, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line type="monotone" dataKey="users" stroke="#FF8C42" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </GlassCard>

                <GlassCard delay={0.5}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Department Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 27, 56, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="count" fill="#5B9FFF" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* AI Model Monitoring */}
            <GlassCard delay={0.6}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">AI Model Monitoring</h3>
                    <Button variant="outline" className="border-glass-border">
                        View Details
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-muted-foreground">API Uptime</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">99.8%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Error Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">0.2%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <Cpu className="h-4 w-4 text-secondary" />
                            <span className="text-sm text-muted-foreground">Last Retrain</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">2 days ago</p>
                    </div>
                </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard delay={0.7}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button className="h-auto py-4 flex-col gap-2">
                        <Users className="h-5 w-5" />
                        <span className="text-sm">Add User</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border">
                        <Building2 className="h-5 w-5" />
                        <span className="text-sm">New Department</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Generate Report</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-glass-border">
                        <Cpu className="h-5 w-5" />
                        <span className="text-sm">AI Settings</span>
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}


