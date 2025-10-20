"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/ui/stats-card"
import { GlassCard } from "@/components/ui/glass-card"
import { Users, UserCheck, TrendingUp, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fsGetPendingLeaves, fsDecideLeave } from '@/lib/firestoreApi'

const performanceData = [
  { name: 'John D.', score: 92 },
  { name: 'Sarah M.', score: 88 },
  { name: 'Mike R.', score: 85 },
  { name: 'Emily S.', score: 90 },
  { name: 'David L.', score: 87 },
]

const teamMembers = [
  { name: 'John Doe', role: 'Senior Developer', status: 'online' },
  { name: 'Sarah Miller', role: 'UI Designer', status: 'online' },
  { name: 'Mike Roberts', role: 'Backend Dev', status: 'offline' },
  { name: 'Emily Stone', role: 'QA Engineer', status: 'online' },
  { name: 'David Lee', role: 'DevOps', status: 'online' },
  { name: 'Anna White', role: 'Frontend Dev', status: 'online' },
]

export default function ManagerDashboard() {
  const router = useRouter()
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleSubmitReview = () => {
    router.push('/dashboard/manager/performance')
  }

  const handleViewAttendance = () => {
    router.push('/dashboard/manager/attendance')
  }

  const handleLeaveRequests = () => {
    router.push('/dashboard/manager/leave-requests')
  }

  const handleTeamReport = () => {
    router.push('/dashboard/manager/team')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leavesData = await fsGetPendingLeaves()
        setLeaves(leavesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLeaveDecision = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      await fsDecideLeave(id, decision)
      setLeaves(prev => prev.filter(leave => leave.id !== id))
    } catch (error) {
      console.error('Error deciding leave:', error)
    }
  }

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
      <div className="space-y-6 w-full">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h2>
          <p className="text-gray-600">Monitor your team's performance and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Users}
            title="Team Members"
            value="12"
            subtitle="Active members"
            delay={0}
          />
          <StatsCard
            icon={UserCheck}
            title="Present Today"
            value="11"
            subtitle="1 on leave"
            trend={{ value: 92, isPositive: true }}
            delay={0.1}
          />
          <StatsCard
            icon={TrendingUp}
            title="Avg Performance"
            value="88%"
            subtitle="Team average"
            trend={{ value: 5, isPositive: true }}
            delay={0.2}
          />
          <StatsCard
            icon={Clock}
            title="Leave Requests"
            value={leaves.length}
            subtitle="Pending approval"
            delay={0.3}
          />
        </div>

        {/* Team Performance & Leave Requests */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <GlassCard delay={0.4} className="xl:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
                <YAxis stroke="rgba(0,0,0,0.5)" />
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
                <Bar dataKey="score" fill="#F7A800" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard delay={0.5}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Pending Leave Requests</h3>
              <Button variant="outline" size="sm" className="border-gray-300">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {leaves.slice(0, 3).map((request, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{request.employee || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{request.type} • {request.days} days</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleLeaveDecision(request.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => handleLeaveDecision(request.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Team Members & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <GlassCard delay={0.6} className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
              <Button variant="outline" className="border-gray-300">
                View Details
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-orange-300 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">{member.name[0]}</span>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                  <p className="text-xs text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.65}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'John Doe submitted a leave request', time: '2 hours ago', type: 'leave' },
                { action: 'Sarah Miller completed performance review', time: '4 hours ago', type: 'review' },
                { action: 'Mike Roberts updated project status', time: '6 hours ago', type: 'project' },
                { action: 'Emily Stone attended team meeting', time: '1 day ago', type: 'meeting' },
                { action: 'David Lee submitted timesheet', time: '1 day ago', type: 'timesheet' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className={`h-2 w-2 rounded-full mt-2 ${activity.type === 'leave' ? 'bg-yellow-500' :
                    activity.type === 'review' ? 'bg-green-500' :
                      activity.type === 'project' ? 'bg-blue-500' :
                        activity.type === 'meeting' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard delay={0.7}>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleSubmitReview}>
              <Award className="h-5 w-5" />
              <span className="text-sm">Submit Review</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleViewAttendance}>
              <UserCheck className="h-5 w-5" />
              <span className="text-sm">View Attendance</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleLeaveRequests}>
              <Clock className="h-5 w-5" />
              <span className="text-sm">Leave Requests</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleTeamReport}>
              <Users className="h-5 w-5" />
              <span className="text-sm">Team Report</span>
            </Button>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}


