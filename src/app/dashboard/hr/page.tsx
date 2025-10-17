"use client"
import { Sidebar, Card, Table } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function HrDashboard() {
    const { role } = useAuth()
    const [jobs, setJobs] = useState<any[]>([])
    useEffect(() => { Api.getJobs().then(setJobs) }, [])

  return (
      <main className="flex-1 p-4 space-y-4">
                <h1 className="text-xl font-semibold text-gray-800">HR Dashboard</h1>
                <div className="grid md:grid-cols-3 gap-4">
                    <Card title="Open Roles"><div className="text-3xl font-semibold">{jobs.length}</div></Card>
                    <Card title="Candidates"><div className="text-3xl font-semibold">12</div></Card>
                    <Card title="Interviews Today"><div className="text-3xl font-semibold">3</div></Card>
                </div>
                <Card title="Jobs">
                    <Table columns={[{ key: 'title', header: 'Title' }, { key: 'openings', header: 'Openings' }]} data={jobs.map(j => ({ id: j.id, title: j.title, openings: String(j.openings) }))} />
                </Card>
      </main>
    )
}


