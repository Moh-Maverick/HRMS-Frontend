"use client"

import { useAuth } from '@/lib/auth'
import { usePathname } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, role } = useAuth()
    const pathname = usePathname()
    const [userName, setUserName] = useState('User')

    // Extract role from pathname if not available from auth
    const currentRole = (role || pathname?.split('/')[2] || 'employee') as "admin" | "hr" | "manager" | "employee" | "candidate"

    useEffect(() => {
        const fetchUserName = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid))
                    const userData = userDoc.data()
                    const name = userData?.name || user?.displayName || user?.email?.split('@')[0] || 'User'
                    setUserName(name)
                } catch (error) {
                    console.error('Error fetching user name:', error)
                    setUserName(user?.displayName || user?.email?.split('@')[0] || 'User')
                }
            }
        }
        fetchUserName()
    }, [user])

    return (
        <DashboardLayout userRole={currentRole} userName={userName}>
            {children}
        </DashboardLayout>
    )
}


