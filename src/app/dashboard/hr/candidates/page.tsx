"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Mail, Phone, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fsGetCandidates } from '@/lib/firestoreApi'

export default function HRCandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesData = await fsGetCandidates()
        setCandidates(candidatesData)
      } catch (error) {
        console.error('Error fetching candidates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [])

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <p className="text-muted-foreground">Track and manage all job candidates</p>
      </div>

      {/* Search */}
      <GlassCard delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, email, or position..."
              className="pl-10 bg-background/50 border-glass-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-glass-border">Filter by Stage</Button>
          <Button variant="outline" className="border-glass-border">Sort by Score</Button>
        </div>
      </GlassCard>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate, index) => (
          <GlassCard key={index} delay={0.2 + index * 0.05}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-semibold text-lg">{candidate.name?.[0] || 'C'}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{candidate.name || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Applied for: {candidate.position || 'Position'}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {candidate.email || 'No email'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {candidate.phone || 'No phone'}
                    </span>
                    <span>Applied: {candidate.appliedDate || 'Recently'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.stage === 'Offer' ? 'bg-green-400/20 text-green-400' :
                    candidate.stage === 'Interview' ? 'bg-accent/20 text-accent' :
                      candidate.stage === 'Screening' ? 'bg-secondary/20 text-secondary' :
                        'bg-muted text-muted-foreground'
                    }`}>
                    {candidate.stage || 'Applied'}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">AI Score</p>
                    <p className="text-lg font-bold text-accent">{candidate.score || 85}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-glass-border">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-glass-border">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}