"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, UserRole } from '@/lib/auth'

const roles: { label: string; value: UserRole }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'HR', value: 'hr' },
    { label: 'Manager', value: 'manager' },
    { label: 'Employee', value: 'employee' },
    { label: 'Candidate', value: 'candidate' },
]

export default function SignupPage() {
    const { signup } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<UserRole>('candidate')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await signup(email, password, role)
            router.replace(`/dashboard/${role}`)
        } catch (err: any) {
            setError(err?.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-primary text-center">Create account</h1>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <input className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full border rounded-md px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <select className="w-full border rounded-md px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                    {roles.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <button disabled={loading} className="w-full py-2 rounded-md bg-primary text-white hover:bg-accent transition-colors disabled:opacity-60">
                    {loading ? 'Creating...' : 'Signup'}
                </button>
            </form>
        </div>
    )
}


