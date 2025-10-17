"use client"
import { Sidebar, Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function EmployeeDashboard() {
    const { role } = useAuth()
    const [payroll, setPayroll] = useState<{ month: string; amount: number; status: string } | null>(null)
    useEffect(() => { Api.getPayroll().then(setPayroll) }, [])

  return (
      <main className="flex-1 p-4 space-y-4">
                <h1 className="text-xl font-semibold text-gray-800">Employee Dashboard</h1>
                <div className="grid md:grid-cols-3 gap-4">
                    <Card title="Current Month"><div className="text-3xl font-semibold">{payroll?.month ?? '-'}</div></Card>
                    <Card title="Salary"><div className="text-3xl font-semibold">₹{payroll?.amount ?? '-'}</div></Card>
                    <Card title="Status"><div className="text-3xl font-semibold">{payroll?.status ?? '-'}</div></Card>
                </div>
      </main>
    )
}


