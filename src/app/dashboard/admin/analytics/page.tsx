"use client"
import { Card } from '@/components/ui'

export default function AdminAnalyticsPage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Employees per Department"><div className="h-32 bg-primary/10 rounded" /></Card>
      <Card title="Attendance %"><div className="h-32 bg-primary/10 rounded" /></Card>
      <Card title="Payroll Burn"><div className="h-32 bg-primary/10 rounded" /></Card>
      <Card title="Hiring KPIs"><div className="h-32 bg-primary/10 rounded" /></Card>
      <Card title="AI Candidate Scores"><div className="h-32 bg-primary/10 rounded" /></Card>
      <Card title="Pending Interviews"><div className="h-32 bg-primary/10 rounded" /></Card>
    </div>
  )
}


