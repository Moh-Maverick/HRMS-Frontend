"use client"
import { Card } from '@/components/ui'
import { Api } from '@/lib/api'
import { useState } from 'react'

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<any>({ name: '', email: '', resumeUrl: '' })
  return (
    <div className="space-y-4">
      <Card title="Resume">
        <div className="flex gap-2">
          <input value={profile.resumeUrl} onChange={(e) => setProfile((p: any) => ({ ...p, resumeUrl: e.target.value }))} className="border rounded-md px-3 py-2 flex-1" placeholder="Resume link" />
          <button onClick={async () => { await Api.saveProfile(profile) }} className="px-3 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Save</button>
        </div>
      </Card>
      <Card title="Personal Details">
        <div className="space-y-3">
          <input value={profile.name} onChange={(e) => setProfile((p: any) => ({ ...p, name: e.target.value }))} className="border rounded-md px-3 py-2 w-full" placeholder="Full name" />
          <input value={profile.email} onChange={(e) => setProfile((p: any) => ({ ...p, email: e.target.value }))} className="border rounded-md px-3 py-2 w-full" placeholder="Email" />
          <div className="flex justify-end">
            <button onClick={async () => { await Api.saveProfile(profile) }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
          </div>
        </div>
      </Card>
    </div>
  )
}


