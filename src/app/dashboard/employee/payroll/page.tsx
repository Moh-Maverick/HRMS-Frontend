"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { DollarSign, Download, FileText, Calendar, CheckCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function EmployeePayrollPage() {
    const [payroll, setPayroll] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const handleDownloadAll = () => {
        alert('Downloading all payslips...')
    }

    const handleDownloadPayslip = (payslipId: string) => {
        alert(`Downloading payslip ${payslipId}...`)
    }

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                // Mock data for now - replace with actual Firebase call
                const mockPayroll = [
                    {
                        id: '1',
                        month: 'December 2024',
                        grossSalary: 75000,
                        deductions: 11250,
                        netSalary: 63750,
                        status: 'paid',
                        date: '2024-12-01'
                    },
                    {
                        id: '2',
                        month: 'November 2024',
                        grossSalary: 75000,
                        deductions: 11250,
                        netSalary: 63750,
                        status: 'paid',
                        date: '2024-11-01'
                    },
                    {
                        id: '3',
                        month: 'October 2024',
                        grossSalary: 75000,
                        deductions: 11250,
                        netSalary: 63750,
                        status: 'paid',
                        date: '2024-10-01'
                    }
                ]
                setPayroll(mockPayroll)
            } catch (error) {
                console.error('Error fetching payroll:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPayroll()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading payroll...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Payroll Management</h2>
                <p className="text-muted-foreground">View your salary details and download payslips</p>
            </div>

            {/* Current Month Summary */}
            <GlassCard delay={0}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Current Month</h3>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">December 2024</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-5 w-5 text-green-400" />
                            <span className="text-sm text-muted-foreground">Gross Salary</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">₹75,000</p>
                    </div>
                    <div className="p-6 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-red-400" />
                            <span className="text-sm text-muted-foreground">Deductions</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">₹11,250</p>
                    </div>
                    <div className="p-6 rounded-xl bg-muted/30 border border-glass-border">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Net Salary</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">₹63,750</p>
                    </div>
                </div>
            </GlassCard>

            {/* Payslip History */}
            <GlassCard delay={0.1}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Payslip History</h3>
                    <Button variant="outline" className="border-glass-border" onClick={handleDownloadAll}>
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                    </Button>
                </div>

                <div className="space-y-3">
                    {payroll.map((payslip, index) => (
                        <div key={payslip.id || index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{payslip.month}</h4>
                                        <p className="text-sm text-muted-foreground">Paid on {payslip.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-foreground">₹{payslip.netSalary.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Net Salary</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {payslip.status === 'paid' ? (
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-yellow-400" />
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${payslip.status === 'paid'
                                            ? 'bg-green-400/20 text-green-400'
                                            : 'bg-yellow-400/20 text-yellow-400'
                                            }`}>
                                            {payslip.status}
                                        </span>
                                    </div>

                                    <Button variant="outline" size="sm" className="border-glass-border" onClick={() => handleDownloadPayslip(payslip.id)}>
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Salary Breakdown */}
            <GlassCard delay={0.2}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Salary Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Earnings</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                                <span className="text-foreground">Basic Salary</span>
                                <span className="font-semibold text-foreground">₹60,000</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                                <span className="text-foreground">HRA</span>
                                <span className="font-semibold text-foreground">₹12,000</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                                <span className="text-foreground">Allowances</span>
                                <span className="font-semibold text-foreground">₹3,000</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Deductions</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                                <span className="text-foreground">Income Tax</span>
                                <span className="font-semibold text-foreground">₹7,500</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                                <span className="text-foreground">Provident Fund</span>
                                <span className="font-semibold text-foreground">₹2,250</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                                <span className="text-foreground">Health Insurance</span>
                                <span className="font-semibold text-foreground">₹1,500</span>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}


