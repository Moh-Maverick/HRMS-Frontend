"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetPendingLeaves, fsDecideLeave } from '@/lib/firestoreApi'

export default function ManagerLeaveRequestsPage() {
    const [leaves, setLeaves] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const leavesData = await fsGetPendingLeaves()
                setLeaves(leavesData)
            } catch (error) {
                console.error('Error fetching leave requests:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaves()
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading leave requests...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Leave Requests</h2>
                <p className="text-gray-600">Review and approve leave requests from your team</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-500">{leaves.length}</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Approved</p>
                        <p className="text-3xl font-bold text-green-500">12</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Rejected</p>
                        <p className="text-3xl font-bold text-red-500">3</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-3xl font-bold text-orange-500">18</p>
                    </div>
                </GlassCard>
            </div>

            {/* Leave Requests */}
            <div className="space-y-4">
                {leaves.length > 0 ? (
                    leaves.map((request, index) => (
                        <GlassCard key={index} delay={0.3 + index * 0.05}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <User className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.employee || 'Team Member'}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{request.type || 'Leave Request'} • {request.days || 1} days</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {request.from} - {request.to}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Submitted {request.submittedDate || 'Recently'}
                                            </span>
                                        </div>
                                        {request.reason && (
                                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                                                {request.reason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-green-500 hover:bg-green-600"
                                        onClick={() => handleLeaveDecision(request.id, 'approved')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleLeaveDecision(request.id, 'rejected')}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <GlassCard delay={0.3}>
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No pending leave requests</p>
                        </div>
                    </GlassCard>
                )}
            </div>

            {/* Recent Decisions */}
            <GlassCard delay={0.4}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Decisions</h3>
                <div className="space-y-3">
                    {[
                        { employee: 'John Doe', type: 'Vacation', days: 5, status: 'approved', date: 'Jan 15, 2025' },
                        { employee: 'Sarah Miller', type: 'Sick Leave', days: 2, status: 'approved', date: 'Jan 14, 2025' },
                        { employee: 'Mike Roberts', type: 'Personal', days: 3, status: 'rejected', date: 'Jan 13, 2025' },
                    ].map((decision, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${decision.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {decision.status === 'approved' ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{decision.employee}</p>
                                    <p className="text-sm text-gray-600">{decision.type} • {decision.days} days</p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${decision.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {decision.status}
                            </span>
                            <span className="text-xs text-gray-500">{decision.date}</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
