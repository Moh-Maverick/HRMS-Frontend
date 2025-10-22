"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { GlassCard } from "@/components/ui/glass-card"
import { Users, UserCheck, TrendingUp, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fsGetPendingLeaves, fsDecideLeave, fsGetTeamMembers } from '@/lib/firestoreApi'

const performanceData = [
  { name: 'Rajesh K.', score: 92 },
  { name: 'Priya S.', score: 88 },
  { name: 'Amit R.', score: 85 },
  { name: 'Sneha M.', score: 90 },
  { name: 'Arjun L.', score: 87 },
]

export default function ManagerDashboard() {
  const router = useRouter()
  const [leaves, setLeaves] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
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

  const refreshData = async () => {
    setLoading(true)
    try {
      const [leavesData, teamData] = await Promise.all([
        fsGetPendingLeaves(),
        fsGetTeamMembers()
      ])
      
      setLeaves(leavesData)
      
      if (teamData.length === 0) {
        setTeamMembers([
          { name: 'Rajesh Kumar', role: 'Senior Developer', status: 'online' },
          { name: 'Priya Sharma', role: 'UI Designer', status: 'online' },
          { name: 'Amit Reddy', role: 'Backend Dev', status: 'offline' },
          { name: 'Sneha Mehta', role: 'QA Engineer', status: 'online' },
          { name: 'Arjun Patel', role: 'DevOps', status: 'online' },
          { name: 'Kavya Singh', role: 'Frontend Dev', status: 'online' },
        ])
      } else {
        setTeamMembers(teamData.map(member => ({
          name: member.name || 'Unknown',
          role: member.department || 'Employee',
          status: 'online'
        })))
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesData, teamData] = await Promise.all([
          fsGetPendingLeaves(),
          fsGetTeamMembers()
        ])
        
        // console.log('📊 Manager Dashboard - Leaves Data:', leavesData)
        // console.log('📊 Manager Dashboard - Team Data:', teamData)
        
        // Use real data from Firestore
        setLeaves(leavesData)
        
        // Use dummy team data if no team members found
        if (teamData.length === 0) {
          setTeamMembers([
            { name: 'Rajesh Kumar', role: 'Senior Developer', status: 'online' },
            { name: 'Priya Sharma', role: 'UI Designer', status: 'online' },
            { name: 'Amit Reddy', role: 'Backend Dev', status: 'offline' },
            { name: 'Sneha Mehta', role: 'QA Engineer', status: 'online' },
            { name: 'Arjun Patel', role: 'DevOps', status: 'online' },
            { name: 'Kavya Singh', role: 'Frontend Dev', status: 'online' },
          ])
        } else {
          setTeamMembers(teamData.map(member => ({
            name: member.name || 'Unknown',
            role: member.department || 'Employee',
            status: 'online'
          })))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Use empty arrays on error
        setLeaves([])
        setTeamMembers([
          { name: 'Rajesh Kumar', role: 'Senior Developer', status: 'online' },
          { name: 'Priya Sharma', role: 'UI Designer', status: 'online' },
          { name: 'Amit Reddy', role: 'Backend Dev', status: 'offline' },
          { name: 'Sneha Mehta', role: 'QA Engineer', status: 'online' },
          { name: 'Arjun Patel', role: 'DevOps', status: 'online' },
          { name: 'Kavya Singh', role: 'Frontend Dev', status: 'online' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    
    // Refresh data every 30 seconds to catch new requests
    const interval = setInterval(fetchData, 30000)
    
    // Refresh when page becomes visible (user returns from another page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleLeaveDecision = async (id: string, decision: 'approved' | 'rejected') => {
    try {
      const result = await fsDecideLeave(id, decision)
      if (result.success) {
        setLeaves(prev => prev.filter(leave => leave.id !== id))
      } else {
        alert(`Failed to ${decision} leave: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deciding leave:', error)
      alert('Error processing leave request. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Manager Dashboard</h2>
        <p className="text-gray-300 text-sm">Monitor your team's performance and activities</p>
      </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <GlassCard delay={0.4} className="xl:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-3">Team Performance</h3>
            <ResponsiveContainer width="100%" height={250} style={{ background: 'transparent' }}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Pending Leave Requests</h3>
              <Button variant="outline" size="sm" className="border-gray-300" onClick={() => router.push('/dashboard/manager/leave-requests')}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {leaves.length > 0 ? (
                leaves.slice(0, 3).map((request, index) => (
                  <div key={index} className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{request.employee || 'Unknown Employee'}</p>
                        <p className="text-xs text-gray-300">
                          {request.type || 'Leave Request'} - {request.days && !isNaN(request.days) ? `${request.days} days` : 'N/A days'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1"
                        onClick={() => handleLeaveDecision(request.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500 text-red-300 hover:bg-red-500 hover:text-white text-xs py-1"
                        onClick={() => handleLeaveDecision(request.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  <p className="text-sm">No pending leave requests</p>
                  <p className="text-xs mt-1">All caught up! 🎉</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Team Members & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <GlassCard delay={0.6} className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Team Members</h3>
              <Button variant="outline" className="border-gray-300" onClick={() => router.push('/dashboard/manager/team')}>
                View Details
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                      <span className="text-orange-300 font-semibold text-sm">{member.name[0]}</span>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </div>
                  <h4 className="font-semibold text-white text-sm">{member.name}</h4>
                  <p className="text-xs text-gray-300">{member.role}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.65}>
            <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { action: 'Rajesh Kumar submitted a leave request', time: '2 hours ago', type: 'leave' },
                { action: 'Priya Sharma completed performance review', time: '4 hours ago', type: 'review' },
                { action: 'Amit Reddy updated project status', time: '6 hours ago', type: 'project' },
                { action: 'Sneha Mehta attended team meeting', time: '1 day ago', type: 'meeting' },
                { action: 'Arjun Patel submitted timesheet', time: '1 day ago', type: 'timesheet' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
                  <div className={`h-2 w-2 rounded-full mt-2 ${activity.type === 'leave' ? 'bg-yellow-500' :
                    activity.type === 'review' ? 'bg-green-500' :
                      activity.type === 'project' ? 'bg-blue-500' :
                        activity.type === 'meeting' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-xs text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard delay={0.7}>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-3 flex-col gap-1 border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleSubmitReview}>
              <Award className="h-4 w-4" />
              <span className="text-xs">Submit Review</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1 border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleViewAttendance}>
              <UserCheck className="h-4 w-4" />
              <span className="text-xs">View Attendance</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1 border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleLeaveRequests}>
              <Clock className="h-4 w-4" />
              <span className="text-xs">Leave Requests</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-1 border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" onClick={handleTeamReport}>
              <Users className="h-4 w-4" />
              <span className="text-xs">Team Report</span>
            </Button>
          </div>
        </GlassCard>
    </div>
  )
}

