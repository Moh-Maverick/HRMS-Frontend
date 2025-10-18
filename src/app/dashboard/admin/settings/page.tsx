"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select } from '@/components/ui/select'
import { Settings as SettingsIcon, Mail, Bell, Shield, Database } from 'lucide-react'

export default function AdminSettingsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        companyName: 'FWC Corporation',
        companyEmail: 'contact@fwc.co.in',
        timezone: 'UTC+5:30',
        emailNotifications: {
            newUserRegistration: true,
            dailyReports: true,
            systemAlerts: true
        },
        security: {
            twoFactorAuth: true,
            sessionTimeout: true,
            passwordComplexity: true
        },
        database: {
            automaticBackups: true
        }
    })

    const timezones = [
        { value: 'UTC-12:00', label: 'UTC-12:00 (Baker Island)' },
        { value: 'UTC-11:00', label: 'UTC-11:00 (American Samoa)' },
        { value: 'UTC-10:00', label: 'UTC-10:00 (Hawaii)' },
        { value: 'UTC-09:00', label: 'UTC-09:00 (Alaska)' },
        { value: 'UTC-08:00', label: 'UTC-08:00 (Pacific Time)' },
        { value: 'UTC-07:00', label: 'UTC-07:00 (Mountain Time)' },
        { value: 'UTC-06:00', label: 'UTC-06:00 (Central Time)' },
        { value: 'UTC-05:00', label: 'UTC-05:00 (Eastern Time)' },
        { value: 'UTC-04:00', label: 'UTC-04:00 (Atlantic Time)' },
        { value: 'UTC-03:00', label: 'UTC-03:00 (Brazil)' },
        { value: 'UTC-02:00', label: 'UTC-02:00 (Mid-Atlantic)' },
        { value: 'UTC-01:00', label: 'UTC-01:00 (Azores)' },
        { value: 'UTC+00:00', label: 'UTC+00:00 (GMT/London)' },
        { value: 'UTC+01:00', label: 'UTC+01:00 (Central Europe)' },
        { value: 'UTC+02:00', label: 'UTC+02:00 (Eastern Europe)' },
        { value: 'UTC+03:00', label: 'UTC+03:00 (Moscow)' },
        { value: 'UTC+04:00', label: 'UTC+04:00 (Gulf)' },
        { value: 'UTC+05:00', label: 'UTC+05:00 (Pakistan)' },
        { value: 'UTC+05:30', label: 'UTC+05:30 (India Standard Time)' },
        { value: 'UTC+06:00', label: 'UTC+06:00 (Bangladesh)' },
        { value: 'UTC+07:00', label: 'UTC+07:00 (Thailand)' },
        { value: 'UTC+08:00', label: 'UTC+08:00 (China/Singapore)' },
        { value: 'UTC+09:00', label: 'UTC+09:00 (Japan/Korea)' },
        { value: 'UTC+10:00', label: 'UTC+10:00 (Australia East)' },
        { value: 'UTC+11:00', label: 'UTC+11:00 (Solomon Islands)' },
        { value: 'UTC+12:00', label: 'UTC+12:00 (New Zealand)' }
    ]

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleNestedChange = (section: string, field: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section as keyof typeof prev] as any),
                [field]: value
            }
        }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Here you would typically save to Firebase or your backend
            console.log('Settings saved:', formData)

            // Navigate back to dashboard
            router.push('/dashboard/admin')
        } catch (error) {
            console.error('Error saving settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        router.push('/dashboard/admin')
    }

    const handleBackup = async () => {
        setIsLoading(true)
        try {
            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 2000))
            alert('Backup completed successfully!')
        } catch (error) {
            console.error('Error creating backup:', error)
            alert('Backup failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">System Settings</h2>
                <p className="text-muted-foreground">Configure system-wide preferences and settings</p>
            </div>

            {/* General Settings */}
            <GlassCard delay={0.1}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <SettingsIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">General Settings</h3>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company-name" className="text-foreground">Company Name</Label>
                        <Input
                            id="company-name"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className="bg-background/50 border-glass-border"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="company-email" className="text-foreground">Contact Email</Label>
                        <Input
                            id="company-email"
                            type="email"
                            value={formData.companyEmail}
                            onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                            className="bg-background/50 border-glass-border"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="timezone" className="text-foreground">Timezone</Label>
                        <Select
                            value={formData.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            className="bg-background/50 border-glass-border"
                        >
                            {timezones.map((tz) => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </GlassCard>

            {/* Email Notifications */}
            <GlassCard delay={0.2}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                        <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Email Notifications</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">New User Registration</p>
                            <p className="text-sm text-muted-foreground">Send email when new users register</p>
                        </div>
                        <Switch
                            checked={formData.emailNotifications.newUserRegistration}
                            onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'newUserRegistration', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">Daily Reports</p>
                            <p className="text-sm text-muted-foreground">Receive daily system reports</p>
                        </div>
                        <Switch
                            checked={formData.emailNotifications.dailyReports}
                            onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'dailyReports', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">System Alerts</p>
                            <p className="text-sm text-muted-foreground">Get notified of critical system events</p>
                        </div>
                        <Switch
                            checked={formData.emailNotifications.systemAlerts}
                            onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'systemAlerts', checked)}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Security Settings */}
            <GlassCard delay={0.3}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Security</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                        </div>
                        <Switch
                            checked={formData.security.twoFactorAuth}
                            onCheckedChange={(checked) => handleNestedChange('security', 'twoFactorAuth', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">Session Timeout</p>
                            <p className="text-sm text-muted-foreground">Auto logout after 30 minutes of inactivity</p>
                        </div>
                        <Switch
                            checked={formData.security.sessionTimeout}
                            onCheckedChange={(checked) => handleNestedChange('security', 'sessionTimeout', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">Password Complexity</p>
                            <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                        </div>
                        <Switch
                            checked={formData.security.passwordComplexity}
                            onCheckedChange={(checked) => handleNestedChange('security', 'passwordComplexity', checked)}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Database Settings */}
            <GlassCard delay={0.4}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                        <Database className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Database & Backup</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-glass-border">
                        <div>
                            <p className="font-medium text-foreground">Automatic Backups</p>
                            <p className="text-sm text-muted-foreground">Daily backup at 2:00 AM</p>
                        </div>
                        <Switch
                            checked={formData.database.automaticBackups}
                            onCheckedChange={(checked) => handleNestedChange('database', 'automaticBackups', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Last Backup</p>
                            <p className="text-sm text-muted-foreground">Today at 2:00 AM</p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-glass-border"
                            onClick={handleBackup}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Backing up...' : 'Backup Now'}
                        </Button>
                    </div>
                </div>
            </GlassCard>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    className="border-glass-border"
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    )
}
