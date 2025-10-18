"use client"
import React from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'admin' | 'hr' | 'manager' | 'employee' | 'candidate'

type AuthContextValue = {
    user: User | null
    role: UserRole | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string, role: UserRole, name?: string, department?: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<UserRole | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u)
            if (u) {
                const snap = await getDoc(doc(db, 'users', u.uid))
                const data = snap.data() as { role?: UserRole } | undefined
                setRole((data?.role ?? null) as UserRole | null)
            } else {
                setRole(null)
            }
            setLoading(false)
        })
        return () => unsub()
    }, [])

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const signup = async (email: string, password: string, role: UserRole, name?: string, department?: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', cred.user.uid), { email, role, name: name || '', department: department || '' })
    }

    const logout = async () => {
        await signOut(auth)
        window.location.href = '/'
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}


