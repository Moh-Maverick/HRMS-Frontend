"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Plus, Edit, Trash2, UserCheck, Shield, Briefcase } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fsGetUsers, fsCreateUserWithAuth, fsUpdateUser, fsDeleteUser } from '@/lib/firestoreApi'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<{ id?: string; name: string; email: string; role: string; department?: string; password?: string }>({ name: '', email: '', role: 'employee' })
  const [showCredentials, setShowCredentials] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{email: string, password: string} | null>(null)
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(false)

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await fsGetUsers()
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return users.filter((u) => {
      const name = (u?.name ?? '').toString().toLowerCase()
      const email = (u?.email ?? '').toString().toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [users, query])

  const save = async () => {
    if (!form.name || !form.email) return
    
    // Generate password if auto-generate is enabled
    const password = autoGeneratePassword ? generatePassword() : form.password
    if (!password) {
      alert('Please enter a password or enable auto-generation')
      return
    }
    
    try {
      if (form.id) {
        const updated = await fsUpdateUser(form.id, form)
        setUsers((prev) => prev.map((u) => (u.id === form.id ? { ...u, ...updated } : u)))
      } else {
        const created = await fsCreateUserWithAuth({ ...form, password })
        setUsers((prev) => [...prev, created])
        
        // Show credentials popup
        setCreatedCredentials({ email: form.email, password })
        setShowCredentials(true)
      }
      setOpen(false)
      setForm({ name: '', email: '', role: 'employee' })
      setAutoGeneratePassword(false)
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error creating user: ' + (error as any)?.message || 'Unknown error')
    }
  }

  const remove = async (id: string) => {
    try {
      await fsDeleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-red-400" />
      case 'hr': return <UserCheck className="h-4 w-4 text-blue-400" />
      case 'manager': return <Briefcase className="h-4 w-4 text-green-400" />
      case 'employee': return <Users className="h-4 w-4 text-orange-400" />
      default: return <Users className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-400/20 text-red-400'
      case 'hr': return 'bg-blue-400/20 text-blue-400'
      case 'manager': return 'bg-green-400/20 text-green-400'
      case 'employee': return 'bg-orange-400/20 text-orange-400'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">User Management</h2>
        <p className="text-muted-foreground">Manage system users and their roles</p>
      </div>

      {/* Search and Actions */}
      <GlassCard delay={0}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">All Users</h3>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((user, index) => (
            <div key={user.id || index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{user.name || 'Unknown'}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-muted-foreground">{user.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setForm(user); setOpen(true) }}
                      className="border-glass-border"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(user.id)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* User Statistics */}
      <GlassCard delay={0.1}>
        <h3 className="text-xl font-semibold text-foreground mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-red-400" />
              <span className="text-sm text-muted-foreground">Admins</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">HR Staff</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'hr').length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-green-400" />
              <span className="text-sm text-muted-foreground">Managers</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'manager').length}</p>
          </div>
        </div>
      </GlassCard>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                {form.id ? 'Edit User' : 'Add New User'}
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
                <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Enter email address"
                  type="email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-glass-border text-foreground"
                >
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                  <option value="candidate">Candidate</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Department (Optional)</label>
                <Input
                  value={form.department || ''}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  placeholder="Enter department"
                />
              </div>

              {!form.id && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoGenerate"
                        checked={autoGeneratePassword}
                        onChange={(e) => {
                          setAutoGeneratePassword(e.target.checked)
                          if (e.target.checked) {
                            setForm((f) => ({ ...f, password: generatePassword() }))
                          } else {
                            setForm((f) => ({ ...f, password: '' }))
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor="autoGenerate" className="text-sm text-muted-foreground">
                        Auto-generate secure password
                      </label>
                    </div>
                    {!autoGeneratePassword && (
                      <Input
                        value={form.password || ''}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="Enter password"
                        type="password"
                      />
                    )}
                    {autoGeneratePassword && (
                      <div className="p-2 bg-muted/30 border border-glass-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Password will be auto-generated</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-glass-border"
                >
                  Cancel
                </Button>
                <Button onClick={save}>
                  {form.id ? 'Update' : 'Create'} User
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Credentials Display Modal */}
      {showCredentials && createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">User Created Successfully</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCredentials(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 border border-glass-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-mono text-foreground">{createdCredentials.email}</p>
              </div>
              <div className="p-4 bg-muted/30 border border-glass-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Password</p>
                <p className="font-mono text-foreground">{createdCredentials.password}</p>
              </div>
              <p className="text-sm text-amber-500">⚠️ Save these credentials now. You won't see them again.</p>
              <Button onClick={() => setShowCredentials(false)} className="w-full">Close</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}


