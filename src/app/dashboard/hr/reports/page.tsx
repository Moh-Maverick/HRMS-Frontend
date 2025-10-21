"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { FileText, Download, TrendingUp, Users, Clock, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useState } from 'react'

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
    const [isExporting, setIsExporting] = useState(false)

    const handleExportReport = async () => {
        setIsExporting(true)
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Create a simple CSV report
            const csvContent = [
                'Report Type,Value,Date',
                'Total Hires,93,2025-01-21',
                'Avg Time to Hire,18 days,2025-01-21',
                'Offer Accept Rate,87%,2025-01-21',
                'Active Jobs,12,2025-01-21'
            ].join('\n')
            
            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `hr-report-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsExporting(false)
        }
    }

    const handleDownloadChart = (chartName: string) => {
        // Create a simple download functionality
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, 400, 200)
            ctx.fillStyle = '#ffffff'
            ctx.font = '16px Arial'
            ctx.fillText(`${chartName} Chart`, 20, 30)
            ctx.fillText('Downloaded from HR Reports', 20, 50)
            
            const link = document.createElement('a')
            link.download = `${chartName.toLowerCase().replace(/\s+/g, '_')}_chart.png`
            link.href = canvas.toDataURL()
            link.click()
        }
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">HR Reports</h2>
                    <p className="text-muted-foreground">Analytics and insights for recruitment</p>
                </div>
                <Button 
                    className="gap-2 w-full sm:w-auto" 
                    onClick={handleExportReport}
                    disabled={isExporting}
                >
                    <Download className="h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <GlassCard delay={0.3}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">Hiring Sources</h3>
                        <div className="text-sm text-muted-foreground">Total: 100%</div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
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
                                    formatter={(value: any, name: any) => [`${value}%`, name]}
                                />
                                <Legend 
                                    wrapperStyle={{ 
                                        fontSize: '14px', 
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        paddingTop: '20px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard delay={0.35}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">Monthly Hiring Trend</h3>
                        <div className="text-sm text-muted-foreground">Last 6 months</div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyHires} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="rgba(255,255,255,0.5)" 
                                    fontSize={12}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.5)" 
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
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
                                    formatter={(value: any) => [`${value} hires`, 'Hires']}
                                />
                                <Bar 
                                    dataKey="hires" 
                                    fill="#F7A800" 
                                    radius={[8, 8, 0, 0]}
                                    stroke="#F7A800"
                                    strokeWidth={2}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* Recent Reports */}
            <GlassCard delay={0.4}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Generated Reports</h3>
                    <div className="text-sm text-muted-foreground">3 reports available</div>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Q4 2024 Hiring Report', date: 'Jan 5, 2025', size: '2.4 MB', type: 'PDF' },
                        { name: 'December Recruitment Analytics', date: 'Jan 1, 2025', size: '1.8 MB', type: 'Excel' },
                        { name: 'Year End Summary 2024', date: 'Dec 28, 2024', size: '3.2 MB', type: 'PDF' },
                    ].map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-accent/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                                    <FileText className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{report.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{report.date}</span>
                                        <span>•</span>
                                        <span>{report.size}</span>
                                        <span>•</span>
                                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                                            {report.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-glass-border gap-2 hover:bg-accent hover:text-white hover:border-accent transition-all" onClick={() => handleDownloadChart(report.type)}>
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
