"use client"
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JDModalProps {
    job: any
    isOpen: boolean
    onClose: () => void
}

export default function JDModal({ job, isOpen, onClose }: JDModalProps) {
    if (!isOpen || !job) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-blue-400/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-100">{job.title}</h2>
                        <p className="text-sm text-slate-400">
                            {job.department} • {job.location} • {job.type}
                            {job.openings && ` • Openings: ${job.openings}`}
                            {job.status && ` • ${job.status}`}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-slate-300 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {job.jdText || job.description ? (
                        <div className="bg-slate-800 border border-blue-400/20 rounded p-4 whitespace-pre-wrap text-slate-100">
                            {job.jdText || job.description}
                        </div>
                    ) : (
                        <div className="text-slate-300 text-center py-8">No JD content available.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
