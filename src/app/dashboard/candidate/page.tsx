"use client"
import { Sidebar, Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function CandidateDashboard() {
    const { role } = useAuth()
    const [interviews, setInterviews] = useState<any[]>([])
    useEffect(() => { Api.getInterviewSchedule().then(setInterviews) }, [])

    return (
        <main className="flex-1 p-4 space-y-4">
            <h1 className="text-xl font-semibold text-gray-800">Candidate Dashboard</h1>
            <div className="grid md:grid-cols-3 gap-4">
                <Card title="Upcoming Interviews"><div className="text-3xl font-semibold">{interviews.length}</div></Card>
                <Card title="Resume Status"><div className="text-3xl font-semibold">Pending</div></Card>
                <Card title="AI Evaluation"><div className="text-3xl font-semibold">Queued</div></Card>
            </div>
        </main>
    )
}


