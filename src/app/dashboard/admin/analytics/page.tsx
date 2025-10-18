"use client"
import { StatsCard } from '@/components/dashboard/StatsCard'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useEffect, useState } from 'react'
import { fsGetUsers, fsGetDepartments } from '@/lib/firestoreApi'

const monthlyData = [
  { month: 'Jan', users: 280, hires: 12, revenue: 45000 },
  { month: 'Feb', users: 290, hires: 15, revenue: 48000 },
  { month: 'Mar', users: 305, hires: 18, revenue: 52000 },
  { month: 'Apr', users: 320, hires: 14, revenue: 55000 },
  { month: 'May', users: 335, hires: 16, revenue: 58000 },
  { month: 'Jun', users: 340, hires: 10, revenue: 60000 },
];

const departmentGrowth = [
  { dept: 'Eng', growth: 25 },
  { dept: 'Sales', growth: 18 },
  { dept: 'Marketing', growth: 22 },
  { dept: 'HR', growth: 8 },
  { dept: 'Finance', growth: 12 },
];

export default function AdminAnalyticsPage() {
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
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive insights and system metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          title="User Growth"
          value="+21%"
          subtitle="Last 6 months"
          trend={{ value: 21, isPositive: true }}
          delay={0}
        />
        <StatsCard
          icon={Briefcase}
          title="New Hires"
          value="93"
          subtitle="This year"
          trend={{ value: 15, isPositive: true }}
          delay={0.1}
        />
        <StatsCard
          icon={DollarSign}
          title="Cost per Hire"
          value="$3,200"
          subtitle="Average"
          trend={{ value: 8, isPositive: false }}
          delay={0.2}
        />
        <StatsCard
          icon={TrendingUp}
          title="Retention Rate"
          value="94.5%"
          subtitle="Annual"
          trend={{ value: 2.5, isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard delay={0.4}>
          <h3 className="text-xl font-semibold text-foreground mb-4">Monthly User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B9FFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5B9FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="users" stroke="#5B9FFF" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.5}>
          <h3 className="text-xl font-semibold text-foreground mb-4">Department Growth Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="dept" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 27, 56, 0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="growth" fill="#FF8C42" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Hiring & Revenue Trends */}
      <GlassCard delay={0.6}>
        <h3 className="text-xl font-semibold text-foreground mb-4">Hiring & Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 27, 56, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px'
              }}
            />
            <Line yAxisId="left" type="monotone" dataKey="hires" stroke="#5B9FFF" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FF8C42" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  )
}


