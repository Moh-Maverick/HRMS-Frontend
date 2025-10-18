"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, MessageSquare, Users, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fsGetFeedback, fsCreateFeedback } from '@/lib/firestoreApi'

export default function EmployeeFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    recipientId: '',
    recipientName: '',
    rating: 5,
    message: '',
    type: 'peer'
  })

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackData = await fsGetFeedback()
        setFeedback(feedbackData)
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await fsCreateFeedback(formData)
      setFormData({
        recipientId: '',
        recipientName: '',
        rating: 5,
        message: '',
        type: 'peer'
      })
      // Refresh feedback data
      const feedbackData = await fsGetFeedback()
      setFeedback(feedbackData)
    } catch (error) {
      console.error('Error creating feedback:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Feedback System</h2>
        <p className="text-muted-foreground">Give and receive feedback from your team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Give Feedback Form */}
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <MessageSquare className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Give Feedback</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-foreground">Recipient</Label>
              <Input
                id="recipient"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="bg-background/50 border-glass-border"
                placeholder="Enter colleague's name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-foreground">Feedback Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-background/50 border border-glass-border rounded-md text-foreground"
              >
                <option value="peer">Peer Feedback</option>
                <option value="manager">Manager Feedback</option>
                <option value="subordinate">Subordinate Feedback</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${rating <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-background/50 border-glass-border min-h-[120px]"
                placeholder="Share your feedback..."
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full gap-2">
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </GlassCard>

        {/* Received Feedback */}
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Received Feedback</h3>
          </div>

          <div className="space-y-4">
            {feedback.length > 0 ? (
              feedback.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{item.from}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <div className="flex gap-1">
                      {getRatingStars(item.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{item.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No feedback received yet</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Given Feedback */}
      <GlassCard delay={0.3}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Given Feedback</h3>
        </div>

        <div className="space-y-4">
          {feedback.filter(f => f.given).length > 0 ? (
            feedback.filter(f => f.given).map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">To: {item.recipientName}</p>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="flex gap-1">
                    {getRatingStars(item.rating)}
                  </div>
                </div>
                <p className="text-sm text-foreground">{item.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No feedback given yet</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}