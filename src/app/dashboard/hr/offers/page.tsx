"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, User, Briefcase } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function HrOffersPage() {
    const [offers, setOffers] = useState<any[]>([
        { id: 'o1', candidate: 'Rahul', role: 'Frontend Engineer', status: 'Sent', email: 'rahul@example.com' },
        { id: 'o2', candidate: 'Priya', role: 'QA Analyst', status: 'Accepted', email: 'priya@example.com' },
        { id: 'o3', candidate: 'Amit', role: 'Backend Developer', status: 'Sent', email: 'amit@example.com' },
    ])
    
    const update = (id: string, status: string) => setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    const data = useMemo(() => offers, [offers])
    
    return (
        <div className="space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Job Offers</h2>
                    <p className="text-gray-300">Manage and track job offers sent to candidates</p>
                </div>
            </div>

            <GlassCard delay={0.1}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">All Offers</h3>
                    <div className="text-sm text-gray-300">
                        Total: {offers.length} offers
                    </div>
                </div>

                <div className="space-y-4">
                    {data.map((offer) => (
                        <div key={offer.id} className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:border-blue-400/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
                                        <User className="h-6 w-6 text-blue-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-lg">{offer.candidate}</h4>
                                        <p className="text-gray-300 text-sm">{offer.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-300">{offer.role}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            offer.status === 'Accepted' 
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                : offer.status === 'Declined'
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                        }`}>
                                            {offer.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                            onClick={() => update(offer.id, 'Accepted')}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-500 text-red-300 hover:bg-red-500 hover:text-white"
                                            onClick={() => update(offer.id, 'Declined')}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
}


