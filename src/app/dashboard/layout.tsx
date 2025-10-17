"use client"
import { Sidebar } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { role, loading } = useAuth()
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const [effectiveRole, setEffectiveRole] = useState<'admin' | 'hr' | 'manager' | 'employee' | 'candidate'>('employee')

    useEffect(() => {
        if (role) setEffectiveRole(role)
        else {
            const match = pathname.match(/^\/dashboard\/(admin|hr|manager|employee|candidate)/)
            if (match) setEffectiveRole(match[1] as any)
        }
    }, [role, pathname])

    return (
        <div className="flex">
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden fixed top-16 left-3 z-40 px-3 py-2 rounded-md border bg-white shadow">Menu</button>
            <div className="hidden md:block"><Sidebar role={effectiveRole} /></div>
            <div className={`md:hidden fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-gray-100 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}>
                <Sidebar role={effectiveRole} />
            </div>
            <main className="flex-1 p-4">{children}</main>
        </div>
    )
}


