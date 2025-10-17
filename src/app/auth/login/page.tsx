"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
    const { login, role, loading: authLoading } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await login(email, password)
        } catch (err: any) {
            setError(err?.message || 'Login failed')
        } finally {
            setSubmitting(false)
        }
    }

    // When role is resolved in context, redirect to that dashboard
    useEffect(() => {
        if (!authLoading && role) {
            router.replace(`/dashboard/${role}`)
        }
    }, [authLoading, role, router])

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-primary text-center">Login</h1>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <input className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full border rounded-md px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button disabled={submitting} className="w-full py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors disabled:opacity-60">
                    {submitting ? 'Signing in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}


