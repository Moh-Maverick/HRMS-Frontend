"use client"
import { Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function CandidateResultPage() {
    const [status, setStatus] = useState<string>('Loading...')
    useEffect(() => { Api.getApplicationStatus().then((s) => setStatus(s.status)) }, [])
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card title="Application Status"><div className="text-2xl font-semibold">{status}</div></Card>
            <Card title="Feedback"><div className="h-40 bg-gray-50 rounded" /></Card>
        </div>
    )
}


