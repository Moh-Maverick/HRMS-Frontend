"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import Starfield from '@/components/Starfield'

export default function LoginPage() {
    const { login, role, loading: authLoading } = useAuth()
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)

        // Basic validation
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields")
            setSubmitting(false)
            return
        }

        try {
            await login(formData.email, formData.password)
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
        <div className="min-h-screen w-full relative overflow-hidden auth-page" style={{ background: 'none' }}>
            {/* Starfield background - same as landing page */}
            <Starfield />

            {/* Background gradient - same as landing page */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-glow-pulse animation-delay-2000" />

            {/* Content - full width layout */}
            <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 relative z-10 pt-20 pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md mx-auto"
                >
                    {/* Back button */}
                    <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Home
                    </Link>

                    {/* Glass card */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-white/80">Login to your HRMS account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="text-sm text-red-400 bg-red-500/20 p-3 rounded-lg">{error}</div>}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center text-white/80 cursor-pointer">
                                    <input type="checkbox" className="mr-2 rounded border-white/20" />
                                    Remember me
                                </label>
                                <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Login'}
                            </Button>
            </form>

                        {/* Signup link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/80">
                                Don't have an account?{" "}
                                <Link href="/auth/signup" className="text-accent hover:text-accent/80 font-semibold transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}


