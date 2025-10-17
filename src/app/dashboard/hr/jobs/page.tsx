"use client"
import { Card, Table, Modal } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'

export default function HrJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ id?: string; title: string; openings: number }>({ title: '', openings: 1 })
  const [query, setQuery] = useState('')
  useEffect(() => { Api.getJobs().then(setJobs) }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return jobs.filter((j) => j.title.toLowerCase().includes(q))
  }, [jobs, query])

  const save = async () => {
    if (!form.title) return
    if (form.id) {
      const upd = await Api.updateJob(form.id, { title: form.title, openings: form.openings })
      setJobs((prev) => prev.map((j) => (j.id === form.id ? { ...j, ...upd } : j)))
    } else {
      const created = await Api.createJob({ title: form.title, openings: form.openings })
      setJobs((prev) => [...prev, created])
    }
    setOpen(false)
    setForm({ title: '', openings: 1 })
  }

  const close = async (id: string) => {
    const res = await Api.closeJob(id)
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...res } : j)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Job Management</h2>
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jobs" className="border rounded-md px-3 py-2" />
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">New Job</button>
        </div>
      </div>
      <Card title="Jobs">
        <Table
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'openings', header: 'Openings' },
            { key: 'status', header: 'Status' },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex gap-2 text-sm">
                  <button onClick={() => { setForm({ id: row.id, title: row.title, openings: Number(row.openings) }); setOpen(true) }} className="px-2 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Edit</button>
                  <button onClick={() => close(row.id)} className="px-2 py-1 rounded border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors">Close</button>
                </div>
              ),
            },
          ]}
          data={filtered.map(j => ({ id: j.id, title: j.title, openings: String(j.openings), status: j.status }))}
        />
      </Card>

      <Modal open={open} title={form.id ? 'Edit Job' : 'New Job'} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Job title" className="w-full border rounded-md px-3 py-2" />
          <input type="number" value={form.openings} onChange={(e) => setForm((f) => ({ ...f, openings: Number(e.target.value) }))} placeholder="Openings" className="w-full border rounded-md px-3 py-2" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border">Cancel</button>
            <button onClick={save} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


