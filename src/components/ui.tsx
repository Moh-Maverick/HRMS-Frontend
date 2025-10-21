"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut, Home, Users, Building, BarChart3, Cpu, Briefcase, UserCheck, FileText, DollarSign, Calendar, MessageSquare, UserCog, Clock, TrendingUp } from 'lucide-react'

export function ConditionalNavbar() {
    const pathname = usePathname()

    // Hide navbar on auth pages
    if (pathname?.startsWith('/auth/')) {
        return null
    }

    // Use dashboard navbar for dashboard pages
    if (pathname?.startsWith('/dashboard/')) {
        return <DashboardNavbar />
    }

    return <Navbar />
}

export function Navbar() {
    const { user, role, logout } = useAuth()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "#features" },
        { name: "AI Highlights", href: "#ai-highlights" },
        { name: "Contact", href: "#footer" },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="container mx-auto px-4 lg:px-8 py-4">
                <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 shadow-2xl">
                    <div className="flex items-center justify-between h-16 lg:h-18">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="text-2xl lg:text-2xl font-bold text-white">
                                FWC HRMS
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-foreground/70 hover:text-foreground font-medium transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-foreground/70 hidden sm:block">{role?.toUpperCase()}</span>
                                    <Link href={`/dashboard/${role || 'employee'}`}>
                                        <Button
                                            variant="outline"
                                            size="default"
                                            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="default"
                                        onClick={async () => { await logout(); router.push('/') }}
                                        className="text-foreground/70 hover:text-foreground hover:bg-white/5"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <Button variant="ghost" size="default" className="text-foreground/70 hover:text-foreground hover:bg-white/5">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <Button variant="outline" size="default" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                                            Signup
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-foreground"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-white/10 py-4 space-y-4 mt-4"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-foreground/70 hover:text-foreground font-medium transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                                {user ? (
                                    <>
                                        <span className="text-sm text-foreground/70">{role?.toUpperCase()}</span>
                                        <Link href={`/dashboard/${role || 'employee'}`} onClick={() => setIsMenuOpen(false)}>
                                            <Button
                                                variant="outline"
                                                size="default"
                                                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                                            >
                                                Go to Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="default"
                                            onClick={async () => { await logout(); router.push('/'); setIsMenuOpen(false) }}
                                            className="w-full"
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="ghost" size="default" className="w-full">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="default" size="default" className="w-full">
                                                Signup
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}

export function DashboardNavbar() {
    const { user, role, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Get role from pathname if not available
    const currentRole = (role || pathname?.split('/')[2] || 'employee') as keyof typeof roleNames

    // Role display names
    const roleNames = {
        admin: 'Admin Dashboard',
        hr: 'HR Dashboard',
        manager: 'Manager Dashboard',
        employee: 'Employee Dashboard',
        candidate: 'Candidate Dashboard'
    } as const

    // Menu items with icons
    type MenuItem = { label: string; href: string; icon: any }
    const menuItems: Record<string, MenuItem[]> = {
        admin: [
            { label: 'Home', href: '/dashboard/admin', icon: Home },
            { label: 'Users', href: '/dashboard/admin/users', icon: Users },
            { label: 'Departments', href: '/dashboard/admin/departments', icon: Building },
            { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
            { label: 'AI Monitor', href: '/dashboard/admin/ai-monitor', icon: Cpu },
        ],
        hr: [
            { label: 'Home', href: '/dashboard/hr', icon: Home },
            { label: 'Jobs', href: '/dashboard/hr/jobs', icon: Briefcase },
            { label: 'Candidates', href: '/dashboard/hr/candidates', icon: UserCheck },
            { label: 'Interviews', href: '/dashboard/hr/interviews', icon: MessageSquare },
            { label: 'Offers', href: '/dashboard/hr/offers', icon: FileText },
        ],
        manager: [
            { label: 'Home', href: '/dashboard/manager', icon: Home },
            { label: 'Team', href: '/dashboard/manager/team', icon: Users },
            { label: 'Attendance', href: '/dashboard/manager/attendance', icon: Clock },
            { label: 'Performance', href: '/dashboard/manager/performance', icon: TrendingUp },
        ],
        employee: [
            { label: 'Home', href: '/dashboard/employee', icon: Home },
            { label: 'Profile', href: '/dashboard/employee/profile', icon: User },
            { label: 'Attendance', href: '/dashboard/employee/attendance', icon: Clock },
            { label: 'Payroll', href: '/dashboard/employee/payroll', icon: DollarSign },
            { label: 'Leave', href: '/dashboard/employee/leave', icon: Calendar },
            { label: 'Feedback', href: '/dashboard/employee/feedback', icon: MessageSquare },
        ],
        candidate: [
            { label: 'Home', href: '/dashboard/candidate', icon: Home },
            { label: 'Profile', href: '/dashboard/candidate/profile', icon: User },
            { label: 'Interview', href: '/dashboard/candidate/interview', icon: MessageSquare },
            { label: 'Result', href: '/dashboard/candidate/result', icon: FileText },
        ],
    }

    const currentMenuItems = menuItems[currentRole] || menuItems.employee

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Dashboard title */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-900">
                                {roleNames[currentRole] || 'Dashboard'}
                            </h1>
                        </div>
                    </div>

                    {/* Center - Navigation Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {currentMenuItems.map((item: MenuItem) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right side - User info and logout */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.displayName || user?.email || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {currentRole}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => { await logout(); router.push('/') }}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <LogOut className="w-4 h-4 mr-1" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="space-y-1">
                            {currentMenuItems.map((item: MenuItem) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
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


