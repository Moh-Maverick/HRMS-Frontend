"use client"
import { Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function ManagerAttendancePage() {
    const [stats, setStats] = useState<{ present: number; absent: number; late: number } | null>(null)
    useEffect(() => { Api.getAttendance().then(setStats) }, [])
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <Card title="Present"><div className="text-3xl font-semibold">{stats?.present ?? '-'}</div></Card>
            <Card title="Absent"><div className="text-3xl font-semibold">{stats?.absent ?? '-'}</div></Card>
            <Card title="Late"><div className="text-3xl font-semibold">{stats?.late ?? '-'}</div></Card>
        </div>
    )
}


