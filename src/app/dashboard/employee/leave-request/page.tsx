"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, FileText, Send } from 'lucide-react'
import { useState } from 'react'
import { fsCreateLeaveRequest } from '@/lib/firestoreApi'
import { useRouter } from 'next/navigation'

export default function LeaveRequestPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        leaveType: 'vacation',
        startDate: '',
        endDate: '',
        reason: '',
        emergencyContact: '',
        emergencyPhone: ''
    })

    const leaveTypes = [
        { value: 'vacation', label: 'Vacation' },
        { value: 'sick', label: 'Sick Leave' },
        { value: 'personal', label: 'Personal Leave' },
        { value: 'maternity', label: 'Maternity Leave' },
        { value: 'paternity', label: 'Paternity Leave' },
        { value: 'bereavement', label: 'Bereavement Leave' },
        { value: 'other', label: 'Other' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await fsCreateLeaveRequest(formData)
            router.push('/dashboard/employee')
        } catch (error) {
            console.error('Error creating leave request:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateDays = () => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate)
            const end = new Date(formData.endDate)
            const diffTime = Math.abs(end.getTime() - start.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
            return diffDays
        }
        return 0
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Request Leave</h2>
                <p className="text-muted-foreground">Submit a leave request to your manager</p>
            </div>

            <form onSubmit={handleSubmit}>
                <GlassCard delay={0.1}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                            <Calendar className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Leave Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="leave-type" className="text-foreground">Leave Type</Label>
                            <select
                                id="leave-type"
                                value={formData.leaveType}
                                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                className="w-full px-3 py-2 bg-background/50 border border-glass-border rounded-md text-foreground"
                                required
                            >
                                {leaveTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="days" className="text-foreground">Total Days</Label>
                            <Input
                                id="days"
                                value={calculateDays()}
                                className="bg-background/50 border-glass-border"
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-foreground">Start Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="pl-10 bg-background/50 border-glass-border"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-foreground">End Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="pl-10 bg-background/50 border-glass-border"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.2}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                            <FileText className="h-5 w-5 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Reason & Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-foreground">Reason for Leave</Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                className="bg-background/50 border-glass-border min-h-[100px]"
                                placeholder="Please provide a detailed reason for your leave request..."
                                required
                            />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.3}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                            <Clock className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Emergency Contact</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergency-contact" className="text-foreground">Contact Name</Label>
                            <Input
                                id="emergency-contact"
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                className="bg-background/50 border-glass-border"
                                placeholder="Emergency contact person"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergency-phone" className="text-foreground">Phone Number</Label>
                            <Input
                                id="emergency-phone"
                                value={formData.emergencyPhone}
                                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                className="bg-background/50 border-glass-border"
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>
                    </div>
                </GlassCard>

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard/employee')}
                        className="border-glass-border"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                        <Send className="h-4 w-4" />
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
