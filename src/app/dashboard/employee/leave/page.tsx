"use client"
import { Card } from '@/components/ui'
import { useEffect, useState } from 'react'
import { Api } from '@/lib/api'

export default function EmployeeLeavePage() {
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [type, setType] = useState('Casual')
    const [reason, setReason] = useState('')
    const [list, setList] = useState<Array<{ id: string; from: string; to: string; type: string; reason: string; days: number; status: string }>>([])

    useEffect(() => {
        Api.getLeaves().then((items) => setList(items as any))
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
                    <button onClick={async () => { await Api.submitLeave({ from, to, type, reason }); const items = await Api.getLeaves(); setList(items as any); setReason('') }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Submit</button>
                </div>
            </Card>
            <Card title="My Requests">
                <div className="grid md:grid-cols-2 gap-3">
                    {list.map((l) => (
                        <div key={l.id} className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-sm font-medium text-gray-800">{l.type || 'Casual'} Leave</div>
                                <span className={`text-xs px-2 py-1 rounded-full ${l.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : l.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{l.status || 'pending'}</span>
                            </div>
                            <div className="text-sm text-gray-700">
                                <div className="mb-1"><span className="font-medium">When:</span> {l.from || '-'} → {l.to || '-'}</div>
                                <div className="mb-1"><span className="font-medium">Days:</span> {l.days || '-'}</div>
                                <div className=""><span className="font-medium">Reason:</span> {l.reason || '-'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}


