"use client"
import { Card } from '@/components/ui'
import { useState } from 'react'
import { Api } from '@/lib/api'

export default function EmployeeFeedbackPage() {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <div className="space-y-4">
      <Card title="Feedback from Manager"><div className="h-40 bg-gray-50 rounded" /></Card>
      <Card title="Submit Feedback">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full border rounded-md px-3 py-2" placeholder="Write your feedback here..." />
        <div className="flex justify-end mt-2">
          <button onClick={async () => { await Api.submitFeedback(text); setText(''); setSent(true) }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Send</button>
        </div>
        {sent && <div className="text-sm text-emerald-600 mt-1">Feedback sent.</div>}
      </Card>
    </div>
  )
}


