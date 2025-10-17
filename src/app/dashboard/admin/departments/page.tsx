"use client"
import { useEffect, useMemo, useState } from 'react'
import { Sidebar, Card, Table, Modal } from '@/components/ui'
import { Api } from '@/lib/api'
import { useAuth } from '@/lib/auth'

type Dept = { id: string; name: string; head?: string; employees?: number }

export default function DepartmentsPage() {
    const { role } = useAuth()
    const [departments, setDepartments] = useState<Dept[]>([])
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<{ id?: string; name: string; head?: string }>({ name: '' })

    const [users, setUsers] = useState<any[]>([])
    const [assignOpen, setAssignOpen] = useState(false)
    const [assignDeptId, setAssignDeptId] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    useEffect(() => {
        Api.getDepartments().then(setDepartments)
        Api.getUsers().then(setUsers)
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return departments.filter((d) => d.name.toLowerCase().includes(q))
    }, [departments, query])

    const handleSave = async () => {
        if (!form.name.trim()) return
        if (form.id) {
            const updated = await Api.updateDepartment(form.id, { name: form.name, head: form.head })
            setDepartments((prev) => prev.map((d) => (d.id === form.id ? { ...d, ...updated } : d)))
        } else {
            const created = await Api.createDepartment({ name: form.name, head: form.head })
            setDepartments((prev) => [...prev, { ...created, employees: 0 } as Dept])
        }
        setOpen(false)
        setForm({ name: '' })
    }

    const handleDelete = async (id: string) => {
        await Api.deleteDepartment(id)
        setDepartments((prev) => prev.filter((d) => d.id !== id))
    }

    const openAssign = (deptId: string) => {
        setAssignDeptId(deptId)
        setSelectedUsers([])
        setAssignOpen(true)
    }

    const saveAssign = async () => {
        if (!assignDeptId) return
        await Api.assignUsersToDepartment(assignDeptId, selectedUsers)
        setAssignOpen(false)
    }

    return (
        <main className="flex-1 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-800">Departments</h1>
                <div className="flex gap-2">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter departments" className="border rounded-md px-3 py-2" />
                    <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">New</button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card title="Total Departments"><div className="text-3xl font-semibold">{departments.length}</div></Card>
                <Card title="Employees"><div className="text-3xl font-semibold">{departments.reduce((s, d) => s + (d.employees || 0), 0)}</div></Card>
                <Card title="Avg per Dept"><div className="text-3xl font-semibold">{Math.round((departments.reduce((s, d) => s + (d.employees || 0), 0) / Math.max(departments.length, 1)) || 0)}</div></Card>
            </div>

            <Card title="Department List">
                <Table
                    columns={[
                        { key: 'name', header: 'Name' },
                        { key: 'head', header: 'Head' },
                        { key: 'employees', header: 'Employees' },
                        {
                            key: 'actions',
                            header: 'Actions',
                            render: (row: any) => (
                                <div className="flex gap-2 text-sm">
                                    <button onClick={() => { setForm({ id: row.id, name: row.name, head: row.head }); setOpen(true) }} className="px-2 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
                                    <button onClick={() => handleDelete(row.id)} className="px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors">Delete</button>
                                    <button onClick={() => openAssign(row.id)} className="px-2 py-1 rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">Assign</button>
                                </div>
                            ),
                        },
                    ]}
                    data={filtered.map((d) => ({ id: d.id, name: d.name, head: d.head || '-', employees: String(d.employees || 0) })) as any}
                />
            </Card>

            <Modal open={open} title={form.id ? 'Edit Department' : 'New Department'} onClose={() => setOpen(false)}>
                <div className="space-y-3">
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Department name" className="w-full border rounded-md px-3 py-2" />
                    <input value={form.head || ''} onChange={(e) => setForm((f) => ({ ...f, head: e.target.value }))} placeholder="Head (optional)" className="w-full border rounded-md px-3 py-2" />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
                    </div>
                </div>
            </Modal>

            <Modal open={assignOpen} title="Assign Users" onClose={() => setAssignOpen(false)}>
                <div className="space-y-3">
                    <div className="max-h-56 overflow-auto border rounded-md">
                        {users.map((u) => (
                            <label key={u.id} className="flex items-center gap-2 px-3 py-2 border-b last:border-b-0">
                                <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={(e) => {
                                    setSelectedUsers((prev) => e.target.checked ? [...prev, u.id] : prev.filter((x) => x !== u.id))
                                }} />
                                <span className="text-sm text-gray-700">{u.name} • {u.email}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setAssignOpen(false)} className="px-3 py-2 rounded-md border">Cancel</button>
                        <button onClick={saveAssign} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
                    </div>
                </div>
            </Modal>
        </main>
    )
}



