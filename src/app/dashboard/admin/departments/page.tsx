"use client"
import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Plus, Search, Edit, Trash2, Users, UserPlus } from 'lucide-react'
import { fsGetDepartments, fsCreateDepartment, fsUpdateDepartment, fsDeleteDepartment, fsAssignUsersToDepartment, fsGetUsers } from '@/lib/firestoreApi'

type Dept = { id: string; name: string; head?: string; employees?: number }

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Dept[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState<{ id?: string; name: string; head?: string }>({ name: '' })

    const [assignOpen, setAssignOpen] = useState(false)
    const [assignDeptId, setAssignDeptId] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departmentsData, usersData] = await Promise.all([
                    fsGetDepartments(),
                    fsGetUsers()
                ])
                setDepartments(departmentsData)
                setUsers(usersData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return departments.filter((d) => d.name.toLowerCase().includes(q))
    }, [departments, query])

    const handleSave = async () => {
        if (!form.name.trim()) return
        try {
            if (form.id) {
                const updated = await fsUpdateDepartment(form.id, { name: form.name, head: form.head })
                setDepartments((prev) => prev.map((d) => (d.id === form.id ? { ...d, ...updated } : d)))
            } else {
                const created = await fsCreateDepartment({ name: form.name, head: form.head })
                setDepartments((prev) => [...prev, { ...created, employees: 0 } as Dept])
            }
            setOpen(false)
            setForm({ name: '' })
        } catch (error) {
            console.error('Error saving department:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await fsDeleteDepartment(id)
            setDepartments((prev) => prev.filter((d) => d.id !== id))
        } catch (error) {
            console.error('Error deleting department:', error)
        }
    }

    const openAssign = (deptId: string) => {
        setAssignDeptId(deptId)
        setSelectedUsers([])
        setAssignOpen(true)
    }

    const saveAssign = async () => {
        if (!assignDeptId) return
        try {
            await fsAssignUsersToDepartment(assignDeptId, selectedUsers)
            setAssignOpen(false)
            // Refresh departments to update employee counts
            const departmentsData = await fsGetDepartments()
            setDepartments(departmentsData)
        } catch (error) {
            console.error('Error assigning users:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading departments...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Department Management</h2>
                <p className="text-muted-foreground">Manage organizational departments and employee assignments</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard delay={0}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Departments</p>
                            <p className="text-2xl font-bold text-foreground">{departments.length}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.1}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-400/10 border border-green-400/20">
                            <Users className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Employees</p>
                            <p className="text-2xl font-bold text-foreground">{departments.reduce((s, d) => s + (d.employees || 0), 0)}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard delay={0.2}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-400/10 border border-blue-400/20">
                            <UserPlus className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg per Department</p>
                            <p className="text-2xl font-bold text-foreground">{Math.round((departments.reduce((s, d) => s + (d.employees || 0), 0) / Math.max(departments.length, 1)) || 0)}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Department List */}
            <GlassCard delay={0.3}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">All Departments</h3>
                    <Button onClick={() => setOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Department
                    </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search departments..."
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {filtered.map((dept, index) => (
                        <div key={dept.id || index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{dept.name}</h4>
                                        <p className="text-sm text-muted-foreground">Head: {dept.head || 'Not assigned'}</p>
                                        <p className="text-xs text-muted-foreground">{dept.employees || 0} employees</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setForm({ id: dept.id, name: dept.name, head: dept.head }); setOpen(true) }}
                                        className="border-glass-border"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openAssign(dept.id)}
                                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                    >
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        Assign
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(dept.id)}
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Add/Edit Department Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <GlassCard className="w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-foreground">
                                {form.id ? 'Edit Department' : 'Add New Department'}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(false)}
                            >
                                ×
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Department Name</label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Enter department name"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Department Head (Optional)</label>
                                <Input
                                    value={form.head || ''}
                                    onChange={(e) => setForm((f) => ({ ...f, head: e.target.value }))}
                                    placeholder="Enter department head name"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="border-glass-border"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>
                                    {form.id ? 'Update' : 'Create'} Department
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Assign Users Modal */}
            {assignOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <GlassCard className="w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-foreground">Assign Users to Department</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setAssignOpen(false)}
                            >
                                ×
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="max-h-56 overflow-auto space-y-2">
                                {users.map((user) => (
                                    <label key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-glass-border hover:border-primary/50 transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={(e) => {
                                                setSelectedUsers((prev) =>
                                                    e.target.checked
                                                        ? [...prev, user.id]
                                                        : prev.filter((x) => x !== user.id)
                                                )
                                            }}
                                            className="rounded"
                                        />
                                        <div>
                                            <p className="font-medium text-foreground">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setAssignOpen(false)}
                                    className="border-glass-border"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={saveAssign}>
                                    Assign Users
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    )
}



