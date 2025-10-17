"use client"
import { Card } from '@/components/ui'

export default function AdminAiMonitorPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Resume Screening Model"><div className="text-sm text-gray-600">Status: Healthy • Last deploy: v1.3.2</div></Card>
      <Card title="Interview Bot"><div className="text-sm text-gray-600">Status: Degraded • Latency p95: 420ms</div></Card>
      <Card title="Evaluation Scorer"><div className="text-sm text-gray-600">Status: Healthy • Drift: Low</div></Card>
      <Card title="Logs"><div className="h-48 overflow-auto bg-gray-50 rounded p-2 text-xs">[10:01] Score=0.82\n[10:03] Interview session created\n[10:05] Embedding cache hit</div></Card>
    </div>
  )
}


