"use client"
import { Card } from '@/components/ui'
import { useEffect, useState } from 'react'
import { Api } from '@/lib/api'

export default function EmployeeLeavePage() {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [type, setType] = useState('Casual')
    const [reason, setReason] = useState('')
    const [list, setList] = useState<any[]>([])

    useEffect(() => {
        // For Firestore mode, we could load personal leaves; fallback mock
        setList([{ id: 'l1', days: 2, reason: 'Medical', status: 'approved' }])
    }, [])

    return (
        <div className="space-y-4">
            <Card title="Request Leave">
                <div className="grid md:grid-cols-5 gap-2">
                    <div className="md:col-span-1">
                        <label className="block text-xs text-gray-600 mb-1">From</label>
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs text-gray-600 mb-1">To</label>
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded-md px-3 py-2 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs text-gray-600 mb-1">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded-md px-3 py-2 w-full">
                            <option>Casual</option>
                            <option>Sick</option>
                            <option>Earned</option>
                            <option>Unpaid</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Reason</label>
                        <input value={reason} onChange={(e) => setReason(e.target.value)} className="border rounded-md px-3 py-2 w-full" placeholder="Reason" />
                    </div>
                </div>
                <div className="flex justify-end mt-2">
                    <button onClick={async () => { await Api.submitLeave({ from, to, type, reason }); setReason(''); }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Submit</button>
                </div>
            </Card>
            <Card title="My Requests">
                <ul className="text-sm text-gray-700 space-y-1">
                    {list.map((l) => (
                        <li key={l.id}>{l.from || '-'} → {l.to || '-'} • {l.type || 'Casual'} • {l.days || '-'} day(s) • {l.reason} • {l.status || 'pending'}</li>
                    ))}
                </ul>
            </Card>
        </div>
    )
}


