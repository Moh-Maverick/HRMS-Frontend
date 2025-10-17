"use client"
import { Card, Table } from '@/components/ui'
import { Api } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function ManagerTeamPage() {
    const [team, setTeam] = useState<any[]>([])
    useEffect(() => { Api.getTeam().then(setTeam) }, [])
    return (
        <Card title="Team Members">
            <Table
                columns={[
                    { key: 'name', header: 'Name' },
                    { key: 'role', header: 'Role' },
                    {
                        key: 'actions',
                        header: 'Actions',
                        render: (row) => (
                            <div className="flex gap-2 text-sm">
                                <button className="px-2 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-white transition-colors">Message</button>
                            </div>
                        ),
                    },
                ]}
                data={team.map(t => ({ id: t.id, name: t.name, role: t.role }))}
            />
        </Card>
    )
}


