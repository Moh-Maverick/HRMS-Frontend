"use client"
import { Card, Table } from '@/components/ui'
import { useMemo, useState } from 'react'

export default function HrOffersPage() {
    const [offers, setOffers] = useState<any[]>([
        { id: 'o1', candidate: 'Rahul', role: 'Frontend Engineer', status: 'Sent' },
        { id: 'o2', candidate: 'Priya', role: 'QA Analyst', status: 'Accepted' },
    ])
    const update = (id: string, status: string) => setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    const data = useMemo(() => offers, [offers])
    return (
        <Card title="Offers">
            <Table
                columns={[
                    { key: 'candidate', header: 'Candidate' },
                    { key: 'role', header: 'Role' },
                    { key: 'status', header: 'Status' },
                    {
                        key: 'actions',
                        header: 'Actions',
                        render: (row) => (
                            <div className="flex gap-2 text-sm">
                                <button onClick={() => update(row.id, 'Accepted')} className="px-2 py-1 rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">Accepted</button>
                                <button onClick={() => update(row.id, 'Declined')} className="px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors">Declined</button>
                            </div>
                        ),
                    },
                ]}
                data={data}
            />
        </Card>
    )
}


