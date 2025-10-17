"use client"
import { Sidebar, Card, Modal } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'

export default function ManagerDashboard() {
    const { role } = useAuth()
  const [attendance, setAttendance] = useState<{ present: number; absent: number; late: number } | null>(null)
  const [leaves, setLeaves] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [review, setReview] = useState<{ employee: string; score: number; notes?: string }>({ employee: '', score: 80 })
  useEffect(() => { Api.getAttendance().then(setAttendance); Api.getPendingLeaves().then(setLeaves) }, [])

  return (
      <main className="flex-1 p-4 space-y-4">
                <h1 className="text-xl font-semibold text-gray-800">Manager Dashboard</h1>
                <div className="grid md:grid-cols-3 gap-4">
                    <Card title="Present"><div className="text-3xl font-semibold">{attendance?.present ?? '-'}</div></Card>
                    <Card title="Absent"><div className="text-3xl font-semibold">{attendance?.absent ?? '-'}</div></Card>
                    <Card title="Late"><div className="text-3xl font-semibold">{attendance?.late ?? '-'}</div></Card>
                </div>
        <Card title="Pending Leave Approvals">
          <div className="flex flex-col gap-2">
            {leaves.map((lv) => (
              <div key={lv.id} className="flex items-center justify-between text-sm">
                <div>{lv.employee} • {lv.days} day(s) • {lv.reason}</div>
                <div className="flex gap-2">
                  <button onClick={async () => { await Api.decideLeave(lv.id, 'approved'); setLeaves((prev) => prev.filter(x => x.id !== lv.id)) }} className="px-2 py-1 rounded border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors">Approve</button>
                  <button onClick={async () => { await Api.decideLeave(lv.id, 'rejected'); setLeaves((prev) => prev.filter(x => x.id !== lv.id)) }} className="px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex justify-end">
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Submit Performance Review</button>
        </div>
        <Modal open={open} title="Submit Review" onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <input value={review.employee} onChange={(e) => setReview((r) => ({ ...r, employee: e.target.value }))} placeholder="Employee name" className="w-full border rounded-md px-3 py-2" />
            <input type="number" value={review.score} onChange={(e) => setReview((r) => ({ ...r, score: Number(e.target.value) }))} placeholder="Score" className="w-full border rounded-md px-3 py-2" />
            <textarea value={review.notes || ''} onChange={(e) => setReview((r) => ({ ...r, notes: e.target.value }))} placeholder="Notes" className="w-full border rounded-md px-3 py-2" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border">Cancel</button>
              <button onClick={async () => { await Api.submitReview(review.employee, review.score, review.notes); setOpen(false) }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
            </div>
          </div>
        </Modal>
      </main>
    )
}


