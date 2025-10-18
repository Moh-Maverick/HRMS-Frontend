"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { FileText, Download, TrendingUp, Users, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const hiringSourceData = [
    { name: 'LinkedIn', value: 45, color: '#F7A800' },
    { name: 'Job Portals', value: 30, color: '#FF8C00' },
    { name: 'Referrals', value: 15, color: '#10B981' },
    { name: 'Direct', value: 10, color: '#FFA500' },
]

const monthlyHires = [
    { month: 'Jul', hires: 8 },
    { month: 'Aug', hires: 12 },
    { month: 'Sep', hires: 10 },
    { month: 'Oct', hires: 15 },
    { month: 'Nov', hires: 14 },
    { month: 'Dec', hires: 18 },
]

export default function HRReportsPage() {
    return (
        <div className="space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">HR Reports</h2>
                    <p className="text-muted-foreground">Analytics and insights for recruitment</p>
                </div>
                <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                            <Users className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Hires</p>
                            <p className="text-2xl font-bold text-foreground">93</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.15}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                            <Clock className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Avg Time to Hire</p>
                            <p className="text-2xl font-bold text-foreground">18d</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.2}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-400/10 border border-green-400/20">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Offer Accept Rate</p>
                            <p className="text-2xl font-bold text-foreground">87%</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.25}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                            <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Active Jobs</p>
                            <p className="text-2xl font-bold text-foreground">12</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard delay={0.3}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Hiring Sources</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={hiringSourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {hiringSourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
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
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </GlassCard>

                <GlassCard delay={0.35}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Monthly Hiring Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyHires}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
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
                            />
                            <Bar dataKey="hires" fill="#F7A800" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>
            </div>

            {/* Recent Reports */}
            <GlassCard delay={0.4}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Generated Reports</h3>
                <div className="space-y-3">
                    {[
                        { name: 'Q4 2024 Hiring Report', date: 'Jan 5, 2025', size: '2.4 MB' },
                        { name: 'December Recruitment Analytics', date: 'Jan 1, 2025', size: '1.8 MB' },
                        { name: 'Year End Summary 2024', date: 'Dec 28, 2024', size: '3.2 MB' },
                    ].map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-accent/50 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                                    <FileText className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{report.name}</p>
                                    <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-glass-border gap-2">
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}
