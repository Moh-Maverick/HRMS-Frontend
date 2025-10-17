"use client"
import { Card, Table } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([])
    const [departments, setDepartments] = useState<any[]>([])
    useEffect(() => {
        Api.getUsers().then(setUsers)
        Api.getDepartments().then(setDepartments)
    }, [])

    return (
        <main className="flex-1 p-4 space-y-4">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="grid md:grid-cols-3 gap-4">
                <Card title="Total Users"><div className="text-3xl font-semibold">{users.length}</div></Card>
                <Card title="Departments"><div className="text-3xl font-semibold">{departments.length}</div></Card>
                <Card title="AI Models"><div className="text-3xl font-semibold">0</div></Card>
            </div>
            <Card title="Recent Users">
                <Table columns={[{ key: 'name', header: 'Name' }, { key: 'email', header: 'Email' }, { key: 'role', header: 'Role' }]} data={users.map(u => ({ id: u.id, name: u?.name ?? '-', email: u?.email ?? '-', role: u?.role ?? '-' }))} />
            </Card>
        </main>
    )
}


