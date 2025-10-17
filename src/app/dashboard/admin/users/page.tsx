"use client"
import { Card, Table, Modal } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ id?: string; name: string; email: string; role: string; department?: string }>({ name: '', email: '', role: 'employee' })

  useEffect(() => { Api.getUsers().then(setUsers) }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return users.filter((u) => {
      const name = (u?.name ?? '').toString().toLowerCase()
      const email = (u?.email ?? '').toString().toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [users, query])

  const save = async () => {
    if (!form.name || !form.email) return
    if (form.id) {
      const updated = await Api.updateUser(form.id, form)
      setUsers((prev) => prev.map((u) => (u.id === form.id ? { ...u, ...updated } : u)))
    } else {
      const created = await Api.createUser(form)
      setUsers((prev) => [...prev, created])
    }
    setOpen(false)
    setForm({ name: '', email: '', role: 'employee' })
  }

  const remove = async (id: string) => {
    await Api.deleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" className="border rounded-md px-3 py-2" />
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">New User</button>
        </div>
      </div>
      <Card title="Users">
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
            { key: 'department', header: 'Department' },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => { setForm(row); setOpen(true) }} className="px-2 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
                  <button onClick={() => remove(row.id)} className="px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors">Delete</button>
                </div>
              ),
            },
          ]}
          data={filtered.map(u => ({ id: u.id, name: u?.name ?? '-', email: u?.email ?? '-', role: u?.role ?? '-', department: u?.department ?? '-' }))}
        />
      </Card>

      <Modal open={open} title={form.id ? 'Edit User' : 'New User'} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" className="w-full border rounded-md px-3 py-2" />
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full border rounded-md px-3 py-2">
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="candidate">Candidate</option>
          </select>
          <input value={form.department || ''} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} placeholder="Department (optional)" className="w-full border rounded-md px-3 py-2" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border">Cancel</button>
            <button onClick={save} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


