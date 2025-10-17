"use client"
import { Card } from '@/components/ui'
import { useState } from 'react'
import { Api } from '@/lib/api'

export default function EmployeeProfilePage() {
    const [profile, setProfile] = useState<any>({ name: '', phone: '', address: '' })
    return (
        <div className="space-y-4">
            <Card title="Personal Info">
                <div className="space-y-3">
                    <input value={profile.name} onChange={(e) => setProfile((p: any) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="w-full border rounded-md px-3 py-2" />
                    <input value={profile.phone} onChange={(e) => setProfile((p: any) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full border rounded-md px-3 py-2" />
                    <input value={profile.address} onChange={(e) => setProfile((p: any) => ({ ...p, address: e.target.value }))} placeholder="Address" className="w-full border rounded-md px-3 py-2" />
                    <div className="flex justify-end">
                        <button onClick={async () => { await Api.saveProfile(profile) }} className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Save</button>
                    </div>
                </div>
            </Card>
        </div>
    )
}


