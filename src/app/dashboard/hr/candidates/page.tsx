"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Filter, UserCheck, CheckCircle, XCircle, Clock, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fsGetCandidates, fsUpdateCandidateStatus } from '@/lib/firestoreApi'

export default function HrCandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [filterJob, setFilterJob] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidatesData = await fsGetCandidates()
        // const jobsData = await fsGetJobs() // Uncomment when jobs API is available
        setCandidates(candidatesData)
        setJobs([]) // Will be populated when jobs API is available
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    let filtered = candidates

    // Filter by job
    if (filterJob !== 'all') {
      filtered = filtered.filter(c => c.jobId === filterJob)
    }

    // Filter by search query
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.position?.toLowerCase().includes(q)
      )
    }

    return filtered
  }, [candidates, filterJob, query])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fsUpdateCandidateStatus(id, status)
      setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
    } catch (error) {
      console.error('Error updating candidate status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied': return <Clock className="h-4 w-4 text-blue-400" />
      case 'screening': return <UserCheck className="h-4 w-4 text-yellow-400" />
      case 'interview': return <Users className="h-4 w-4 text-purple-400" />
      case 'offer': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied': return 'bg-blue-400/20 text-blue-400'
      case 'screening': return 'bg-yellow-400/20 text-yellow-400'
      case 'interview': return 'bg-purple-400/20 text-purple-400'
      case 'offer': return 'bg-green-400/20 text-green-400'
      case 'rejected': return 'bg-red-400/20 text-red-400'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Candidate Management</h2>
        <p className="text-muted-foreground">Track and manage candidate applications</p>
      </div>

      {/* Search and Filters */}
      <GlassCard delay={0}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">All Candidates</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{filtered.length} candidates</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidates by name, email, or position..."
              className="pl-10"
            />
          </div>
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="px-3 py-2 rounded-lg bg-card border border-glass-border text-foreground"
          >
            <option value="all">All Jobs</option>
            <option value="j1">Frontend Engineer</option>
            <option value="j2">QA Analyst</option>
            <option value="j3">Backend Developer</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((candidate, index) => (
            <div key={candidate.id || index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{candidate.name || 'Unknown'}</h4>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    <p className="text-xs text-muted-foreground">{candidate.position || 'Position not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(candidate.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status?.charAt(0).toUpperCase() + candidate.status?.slice(1)}
                    </span>
                  </div>

                  {candidate.score && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-foreground">{candidate.score}/10</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(candidate.id, 'Interview')}
                      className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Interview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(candidate.id, 'Offer')}
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Offer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(candidate.id, 'Rejected')}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Candidate Statistics */}
      <GlassCard delay={0.1}>
        <h3 className="text-xl font-semibold text-foreground mb-4">Candidate Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Applied</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {candidates.filter(c => c.status?.toLowerCase() === 'applied').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-muted-foreground">Screening</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {candidates.filter(c => c.status?.toLowerCase() === 'screening').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-muted-foreground">Interview</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {candidates.filter(c => c.status?.toLowerCase() === 'interview').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-muted-foreground">Offers</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {candidates.filter(c => c.status?.toLowerCase() === 'offer').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-muted-foreground">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {candidates.filter(c => c.status?.toLowerCase() === 'rejected').length}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}


