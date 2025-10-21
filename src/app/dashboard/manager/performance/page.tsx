"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Award, TrendingUp, Star, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useEffect, useState } from 'react'
import { fsGetTeamMembers } from '@/lib/firestoreApi'

const skillsData = [
    { skill: 'Technical', value: 85 },
    { skill: 'Communication', value: 92 },
    { skill: 'Leadership', value: 78 },
    { skill: 'Problem Solving', value: 88 },
    { skill: 'Teamwork', value: 90 },
]

export default function ManagerPerformancePage() {
    const [performanceData, setPerformanceData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const performance = await fsGetTeamMembers()
                setPerformanceData(performance)
            } catch (error) {
                console.error('Error fetching performance data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPerformance()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading performance data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Team Performance</h2>
                <p className="text-gray-600">Track and review team member performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Team Average</p>
                            <p className="text-2xl font-bold text-gray-900">88%</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.15}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                            <Award className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Top Performer</p>
                            <p className="text-2xl font-bold text-gray-900">92%</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.2}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                            <Target className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Goals Met</p>
                            <p className="text-2xl font-bold text-gray-900">9/12</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.25}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                            <Star className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Reviews Due</p>
                            <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.3}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Individual Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData.map(member => ({
                            name: member.name || 'Team Member',
                            score: Math.floor(Math.random() * 30) + 70 // Mock performance score
                        }))}>
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

                <GlassCard delay={0.35}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Skills Assessment</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={skillsData}>
                            <PolarGrid stroke="rgba(0,0,0,0.2)" />
                            <PolarAngleAxis dataKey="skill" stroke="rgba(0,0,0,0.5)" />
                            <PolarRadiusAxis stroke="rgba(0,0,0,0.5)" />
                            <Radar dataKey="value" stroke="#F7A800" fill="#F7A800" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* Performance Reviews */}
            <GlassCard delay={0.4}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Pending Reviews</h3>
                    <Button>Submit Review</Button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: "John Doe", role: "Senior Developer", dueDate: "Jan 20, 2025", progress: 85 },
                        { name: "Sarah Miller", role: "UI Designer", dueDate: "Jan 22, 2025", progress: 70 },
                        { name: "Mike Roberts", role: "Backend Dev", dueDate: "Jan 25, 2025", progress: 0 },
                    ].map((review, index) => (
                        <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                    <p className="text-sm text-gray-600">{review.role}</p>
                                </div>
                                <span className="text-xs text-gray-500">Due: {review.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 transition-all"
                                            style={{ width: `${review.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-orange-500">{review.progress}%</span>
                                <Button size="sm" variant="outline" className="border-gray-300">
                                    {review.progress > 0 ? 'Continue' : 'Start'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}