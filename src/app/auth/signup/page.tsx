"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, ArrowLeft, Shield, Users, UserCog, Briefcase, FileUser, Building } from 'lucide-react'
import { useAuth, UserRole } from '@/lib/auth'
import { fsGetDepartments } from '@/lib/firestoreApi'
import Starfield from '@/components/Starfield'

type Role = "admin" | "hr" | "manager" | "employee" | "candidate";

const roles = [
    { id: "employee", name: "Employee", icon: Briefcase, description: "Access to personal dashboard" },
    { id: "candidate", name: "Candidate", icon: FileUser, description: "Apply for positions" },
];

export default function SignupPage() {
    const { signup } = useAuth()
    const router = useRouter()
    const [step, setStep] = useState<1 | 2>(1)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const rolesRequiringDepartment = ['hr', 'manager', 'employee']

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const depts = await fsGetDepartments()
                setDepartments(depts)
            } catch (error) {
                console.error('Error fetching departments:', error)
            }
        }
        fetchDepartments()
    }, [])

    const handleRoleSelect = (roleId: Role) => {
        setSelectedRole(roleId)
        setTimeout(() => setStep(2), 300)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all required fields")
            setLoading(false)
            return
        }

        if (rolesRequiringDepartment.includes(selectedRole!) && !formData.department) {
            setError("Please select a department")
            setLoading(false)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            await signup(formData.email, formData.password, selectedRole as UserRole, formData.fullName, formData.department)
            router.replace(`/dashboard/${selectedRole}`)
        } catch (err: any) {
            setError(err?.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden auth-page">
            {/* Starfield background */}
            <Starfield />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-glow-pulse animation-delay-2000" />

            <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 relative z-10 pt-20 pb-20">
                <div className="w-full max-w-5xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Home
                    </Link>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                                    <div className="text-center mb-10">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Choose Your Role</h1>
                                        <p className="text-white/80">Select the role that best describes you</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {roles.map((role) => {
                                            const Icon = role.icon
                                            return (
                                                <motion.button
                                                    key={role.id}
                                                    onClick={() => handleRoleSelect(role.id as Role)}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left hover:bg-white/20 hover:border-accent/50 transition-all duration-300 group"
                                                >
                                                    <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                                                        <Icon className="text-accent" size={28} />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                                                    <p className="text-white/70 text-sm">{role.description}</p>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                    <p className="text-center text-white/60 text-sm mt-4">
                                        Need HR or Manager access? Contact your administrator.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto">
                                    <div className="text-center mb-8">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Account</h1>
                                        <p className="text-white/80">
                                            Signing up as <span className="text-accent font-semibold">{roles.find(r => r.id === selectedRole)?.name}</span>
                                        </p>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-accent hover:text-accent/80 text-sm mt-2 transition-colors"
                                        >
                                            Change role
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {error && <div className="text-sm text-red-400 bg-red-500/20 p-3 rounded-lg">{error}</div>}

                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-white font-medium">Full Name *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                                                <Input
                                                    id="fullName"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-white font-medium">Email Address *</Label>
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
                                            <Label htmlFor="password" className="text-white font-medium">Password *</Label>
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

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
                                                />
                                            </div>
                                        </div>

                                        {/* Department Dropdown */}
                                        {selectedRole && rolesRequiringDepartment.includes(selectedRole) && (
                                            <div className="space-y-2">
                                                <Label htmlFor="department" className="text-white font-medium">Department *</Label>
                                                <select
                                                    id="department"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 rounded-md focus:border-accent focus:ring-accent focus:ring-1"
                                                >
                                                    <option value="" disabled>Select your department</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))}
                                                </select>
                                                <div className="text-xs text-white/50 mt-1">
                                                    Debug: Selected department ID = "{formData.department}"
                                                </div>
                                            </div>
                                        )}

                                        <Button type="submit" variant="accent" size="lg" className="w-full mt-8" disabled={loading}>
                                            {loading ? 'Creating Account...' : 'Create Account'}
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-white/80">
                                            Already have an account?{" "}
                                            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-semibold transition-colors">
                                                Login
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
