"use client"
import { Card, Modal } from '@/components/ui'
import { useState } from 'react'

export default function HrInterviewsPage() {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<{ candidate: string; date: string; interviewer: string }>({ candidate: '', date: '', interviewer: '' })
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Interview Scheduling</h2>
                <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Schedule</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <Card title="Upcoming Interviews"><div className="h-32 bg-primary/10 rounded" /></Card>
                <Card title="Interviewers"><div className="h-32 bg-primary/10 rounded" /></Card>
            </div>
            <Modal open={open} title="Schedule Interview" onClose={() => setOpen(false)}>
                <div className="space-y-3">
                    <input value={form.candidate} onChange={(e) => setForm((f) => ({ ...f, candidate: e.target.value }))} placeholder="Candidate name" className="w-full border rounded-md px-3 py-2" />
                    <input type="datetime-local" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
                    <input value={form.interviewer} onChange={(e) => setForm((f) => ({ ...f, interviewer: e.target.value }))} placeholder="Interviewer" className="w-full border rounded-md px-3 py-2" />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border">Cancel</button>
                        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}


