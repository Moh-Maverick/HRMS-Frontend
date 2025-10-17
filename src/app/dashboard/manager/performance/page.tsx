"use client"
import { Card } from '@/components/ui'

export default function ManagerPerformancePage() {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card title="Performance Trend"><div className="h-40 bg-primary/10 rounded" /></Card>
            <Card title="Feedback Queue"><div className="h-40 bg-primary/10 rounded" /></Card>
        </div>
    )
}


