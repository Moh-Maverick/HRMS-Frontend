"use client"
import { Card } from '@/components/ui'
import { useState } from 'react'

export default function EmployeeAttendancePage() {
    const [history, setHistory] = useState<Array<{ id: string; date: string; status: string }>>([
        { id: 'a1', date: '2025-10-16', status: 'Present' },
        { id: 'a2', date: '2025-10-15', status: 'Present' },
    ])
    const markPresent = () => {
        const today = new Date().toISOString().slice(0, 10)
        setHistory((prev) => [{ id: crypto.randomUUID(), date: today, status: 'Present' }, ...prev])
    }
    return (
        <div className="space-y-4">
            <Card title="History">
                <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-700">Recent</div>
                    <button onClick={markPresent} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Mark Present</button>
                </div>
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {history.map((h) => (
                            <tr key={h.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-700">{h.date}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{h.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}


