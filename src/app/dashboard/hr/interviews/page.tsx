"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Video, MapPin, Users } from 'lucide-react'

const interviews = [
    {
        candidate: "Alex Thompson",
        position: "Senior Developer",
        date: "Jan 18, 2025",
        time: "10:00 AM",
        interviewer: "John Manager",
        type: "Technical",
        mode: "Video Call",
        status: "scheduled"
    },
    {
        candidate: "Emma Wilson",
        position: "UI Designer",
        date: "Jan 18, 2025",
        time: "2:00 PM",
        interviewer: "Sarah Lead",
        type: "Design Review",
        mode: "In-person",
        status: "scheduled"
    },
    {
        candidate: "Michael Chen",
        position: "Product Manager",
        date: "Jan 19, 2025",
        time: "11:00 AM",
        interviewer: "Mike Director",
        type: "Behavioral",
        mode: "Video Call",
        status: "scheduled"
    },
    {
        candidate: "Sarah Brown",
        position: "Data Scientist",
        date: "Jan 19, 2025",
        time: "3:00 PM",
        interviewer: "David Tech",
        type: "Technical",
        mode: "Video Call",
        status: "scheduled"
    },
]
 

export default function HRInterviewsPage() {
    return (
        <div className="space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Interview Schedule</h2>
                    <p className="text-muted-foreground">Manage and track all interviews</p>
                </div>
                <Button className="gap-2" onClick={() => window.open('https://ai-interview-bot-seven.vercel.app/sign-in', '_blank')}>
                    <Calendar className="h-4 w-4" />
                    Schedule Interview
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard delay={0.1}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Today</p>
                        <p className="text-3xl font-bold text-accent">4</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.15}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">This Week</p>
                        <p className="text-3xl font-bold text-foreground">23</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.2}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-400">187</p>
                    </div>
                </GlassCard>
                <GlassCard delay={0.25}>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                        <p className="text-3xl font-bold text-secondary">68%</p>
                    </div>
                </GlassCard>
            </div>

            {/* Upcoming Interviews */}
            <GlassCard delay={0.3}>
                <h3 className="text-xl font-semibold text-foreground mb-4">Upcoming Interviews</h3>
                <div className="space-y-4">
                    {interviews.map((interview, index) => (
                        <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-accent/50 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-foreground text-lg">{interview.candidate}</h4>
                                            <p className="text-sm text-muted-foreground">{interview.position}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                                            {interview.type}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4 text-accent" />
                                            <span>{interview.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4 text-accent" />
                                            <span>{interview.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4 text-accent" />
                                            <span>{interview.interviewer}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            {interview.mode === 'Video Call' ? (
                                                <><Video className="h-4 w-4 text-accent" /><span>{interview.mode}</span></>
                                            ) : (
                                                <><MapPin className="h-4 w-4 text-accent" /><span>{interview.mode}</span></>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-glass-border">
                                        Reschedule
                                    </Button>
                                    {interview.mode === 'Video Call' && (
                                        <Button size="sm" className="gap-2">
                                            <Video className="h-4 w-4" />
                                            Join Call
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}