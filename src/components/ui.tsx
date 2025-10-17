"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import React from 'react'

export function Navbar() {
    const { user, role, logout } = useAuth()
    const router = useRouter()
    return (
        <nav className="w-full sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-primary font-semibold text-lg">FWC HRMS</Link>
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-600 hidden sm:block">{role?.toUpperCase()}</span>
                            <button
                                onClick={async () => { await logout(); router.push('/') }}
                                className="px-3 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="px-3 py-2 rounded-md text-primary hover:text-accent transition-colors">Login</Link>
                            <Link href="/auth/signup" className="px-3 py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

type SidebarItem = { label: string; href: string }

const roleToLinks: Record<string, SidebarItem[]> = {
    admin: [
        { label: 'Users', href: '/dashboard/admin/users' },
        { label: 'Departments', href: '/dashboard/admin/departments' },
        { label: 'Analytics', href: '/dashboard/admin/analytics' },
        { label: 'AI Model Monitor', href: '/dashboard/admin/ai-monitor' },
    ],
    hr: [
        { label: 'Jobs', href: '/dashboard/hr/jobs' },
        { label: 'Candidates', href: '/dashboard/hr/candidates' },
        { label: 'Interviews', href: '/dashboard/hr/interviews' },
        { label: 'Offers', href: '/dashboard/hr/offers' },
    ],
    manager: [
        { label: 'Team', href: '/dashboard/manager/team' },
        { label: 'Attendance', href: '/dashboard/manager/attendance' },
        { label: 'Performance', href: '/dashboard/manager/performance' },
    ],
    employee: [
        { label: 'Profile', href: '/dashboard/employee/profile' },
        { label: 'Attendance', href: '/dashboard/employee/attendance' },
        { label: 'Payroll', href: '/dashboard/employee/payroll' },
        { label: 'Leave', href: '/dashboard/employee/leave' },
        { label: 'Feedback', href: '/dashboard/employee/feedback' },
    ],
    candidate: [
        { label: 'Profile', href: '/dashboard/candidate/profile' },
        { label: 'Interview', href: '/dashboard/candidate/interview' },
        { label: 'Result', href: '/dashboard/candidate/result' },
    ],
}

export function Sidebar({ role }: { role: keyof typeof roleToLinks }) {
    const pathname = usePathname()
    const links = [{ label: 'Home', href: `/dashboard/${role}` }, ...(roleToLinks[role] || [])]
    return (
        <aside className="w-full md:w-64 border-r border-gray-100 bg-white">
            <div className="p-4 text-sm font-semibold text-gray-500">{role.toUpperCase()}</div>
            <nav className="flex flex-col">
                {links.map((item) => {
                    const isHome = item.href === `/dashboard/${role}`
                    const active = isHome ? pathname === item.href : pathname.startsWith(item.href)
                    return (
                        <Link key={item.href} href={item.href} className={`px-4 py-2 transition-colors ${active ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}>
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4 hover:shadow-md transition-shadow animate-fadeIn">
            <div className="font-medium text-gray-800 mb-2">{title}</div>
            {children}
        </div>
    )
}

export function Table({ columns, data }: { columns: { key: string; header: string; render?: (row: any) => React.ReactNode }[]; data: Array<{ id: string } & Record<string, any>> }) {
    return (
        <div className="overflow-auto rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} className="px-4 py-2 text-left text-xs font-semibold text-gray-500">{c.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {columns.map((c) => (
                                <td key={c.key} className="px-4 py-2 text-sm text-gray-700">
                                    {c.render ? c.render(row) : String((row as any)[c.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-gray-800">{title}</div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function Loader() {
    return (
        <div className="flex items-center gap-2 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
            <span className="text-sm">Loading...</span>
        </div>
    )
}


