"use client"
import { Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function EmployeePayrollPage() {
    const [payroll, setPayroll] = useState<{ month: string; amount: number; status: string } | null>(null)
    useEffect(() => { Api.getPayroll().then(setPayroll) }, [])
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <Card title="Month"><div className="text-3xl font-semibold">{payroll?.month ?? '-'}</div></Card>
            <Card title="Amount"><div className="text-3xl font-semibold">₹{payroll?.amount ?? '-'}</div></Card>
            <Card title="Status"><div className="text-3xl font-semibold">{payroll?.status ?? '-'}</div></Card>
        </div>
    )
}


