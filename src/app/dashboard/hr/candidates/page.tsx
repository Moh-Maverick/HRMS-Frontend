"use client"
import { Card, Table } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'

export default function HrCandidatesPage() {
  const [cands, setCands] = useState<any[]>([])
  const [filterJob, setFilterJob] = useState<string>('all')
  useEffect(() => { Api.getCandidates().then(setCands) }, [])
  const data = useMemo(() => filterJob === 'all' ? cands : cands.filter(c => c.jobId === filterJob), [cands, filterJob])

  const update = async (id: string, status: string) => {
    const res = await Api.updateCandidateStatus(id, status)
    setCands((prev) => prev.map((c) => c.id === id ? { ...c, status: res.status } : c))
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Candidate Tracking</h2>
        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} className="border rounded-md px-3 py-2">
          <option value="all">All Jobs</option>
          <option value="j1">Frontend Engineer</option>
          <option value="j2">QA Analyst</option>
        </select>
      </div>
      <Card title="Candidates">
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'status', header: 'Status' },
            { key: 'jobId', header: 'Job' },
            { key: 'score', header: 'Score' },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex gap-2 text-sm">
                  <button onClick={() => update(row.id, 'Interview')} className="px-2 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Interview</button>
                  <button onClick={() => update(row.id, 'Offer')} className="px-2 py-1 rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">Offer</button>
                  <button onClick={() => update(row.id, 'Rejected')} className="px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                </div>
              ),
            },
          ]}
          data={data.map(c => ({ id: c.id, name: c.name, status: c.status, jobId: c.jobId, score: String(c.score) }))}
        />
      </Card>
    </div>
  )
}


