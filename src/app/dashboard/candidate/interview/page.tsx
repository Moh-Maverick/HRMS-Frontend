"use client"
import { Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function CandidateInterviewPage() {
    const [tokens, setTokens] = useState<any[]>([])
    useEffect(() => { setTokens([{ id: 'tk1', value: 'ABC-123', expires: '2025-10-31' }]) }, [])
    return (
        <div className="space-y-4">
            <Card title="Interview Tokens">
                <ul className="text-sm text-gray-700 space-y-1">
                    {tokens.map((t) => (
                        <li key={t.id}>{t.value} • Expires {t.expires}</li>
                    ))}
                </ul>
            </Card>
            <Card title="Join AI Interview"><button className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Join</button></Card>
        </div>
    )
}


