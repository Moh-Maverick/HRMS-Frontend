"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, MessageSquare, Users, Send, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fsGetManagerFeedback, fsCreateManagerFeedback, fsGetTeamMembers } from '@/lib/firestoreApi'

export default function ManagerFeedbackPage() {
    const [feedback, setFeedback] = useState<any[]>([])
    const [teamMembers, setTeamMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        recipientId: '',
        recipientName: '',
        rating: 5,
        message: '',
        type: 'manager'
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feedbackData, membersData] = await Promise.all([
                    fsGetManagerFeedback(),
                    fsGetTeamMembers()
                ])
                setFeedback(feedbackData)
                setTeamMembers(membersData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            await fsCreateManagerFeedback(formData)
            setFormData({
                recipientId: '',
                recipientName: '',
                rating: 5,
                message: '',
                type: 'manager'
            })
            // Refresh feedback data
            const feedbackData = await fsGetManagerFeedback()
            setFeedback(feedbackData)
        } catch (error) {
            console.error('Error creating feedback:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const getRatingStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
            />
        ))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading feedback...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Feedback</h2>
                <p className="text-gray-600">Give feedback to your team members and track performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Give Feedback Form */}
                <GlassCard delay={0.1}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                            <MessageSquare className="h-5 w-5 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Give Feedback</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient" className="text-gray-700">Team Member</Label>
                            <select
                                id="recipient"
                                value={formData.recipientId}
                                onChange={(e) => {
                                    const member = teamMembers.find(m => m.id === e.target.value)
                                    setFormData({
                                        ...formData,
                                        recipientId: e.target.value,
                                        recipientName: member?.name || ''
                                    })
                                }}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                                required
                            >
                                <option value="">Select team member</option>
                                {teamMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name} - {member.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-gray-700">Feedback Type</Label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                            >
                                <option value="manager">Manager Feedback</option>
                                <option value="peer">Peer Feedback</option>
                                <option value="performance">Performance Review</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700">Rating</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`h-6 w-6 ${rating <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-gray-700">Feedback Message</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="bg-white border-gray-300 min-h-[120px]"
                                placeholder="Share your feedback and suggestions..."
                                required
                            />
                        </div>

                        <Button type="submit" disabled={submitting} className="w-full gap-2 bg-orange-500 hover:bg-orange-600">
                            <Send className="h-4 w-4" />
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                    </form>
                </GlassCard>

                {/* Team Performance Overview */}
                <GlassCard delay={0.2}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                            <Award className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Team Performance</h3>
                    </div>

                    <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">{member.name}</p>
                                        <p className="text-sm text-gray-600">{member.role}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {getRatingStars(member.performance || 4)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 transition-all"
                                            style={{ width: `${member.performance || 80}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-orange-500">{member.performance || 80}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Feedback History */}
            <GlassCard delay={0.3}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                        <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Feedback History</h3>
                </div>

                <div className="space-y-4">
                    {feedback.length > 0 ? (
                        feedback.map((item, index) => (
                            <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">To: {item.recipientName}</p>
                                        <p className="text-sm text-gray-600">{item.type}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {getRatingStars(item.rating)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700">{item.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No feedback given yet</p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    )
}
