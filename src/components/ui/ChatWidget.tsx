"use client"
import { useEffect, useRef, useState } from "react"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"

type ChatMessage = { role: "user" | "assistant"; content: string }

export default function ChatWidget() {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
    }, [messages, open])

    const send = async () => {
        if (!input.trim() || !user) return
        const msg = input.trim()
        setInput("")
        setMessages((m) => [...m, { role: "user", content: msg }])
        setLoading(true)
        try {
            const base = process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:8000"
            const res = await fetch(`${base.replace(/\/$/, '')}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.uid, query: msg, session_id: sessionId }),
            })
            const data = await res.json()
            setSessionId(data.session_id)
            setMessages((m) => [...m, { role: "assistant", content: data.response || "" }])
        } catch (e) {
            setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!open && (
                <Button
                    className="h-12 w-12 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => setOpen(true)}
                    aria-label="Open HR Assistant"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            )}
            {open && (
                <div className="w-[340px] md:w-[380px] h-[520px] rounded-xl shadow-2xl border border-blue-400/20 flex flex-col overflow-hidden bg-[#0b1220]/95 backdrop-blur">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-blue-400/20 bg-[#0b1220]">
                        <div className="font-semibold text-slate-100">HR Assistant</div>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-sm text-slate-400 text-center mt-12">
                                Ask me about leaves, policies, onboarding, benefits, attendance, and more.
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[78%] rounded-lg px-3 py-2 text-[0.94rem] leading-5 ${m.role === "user"
                                        ? "bg-orange-500 text-white"
                                        : "bg-slate-800 text-slate-100 border border-blue-400/20"
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-xs text-slate-400">Assistant is typing…</div>}
                    </div>
                    <div className="p-3 border-t border-blue-400/20 bg-[#0b1220] flex items-center gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            className="bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-blue-400/20 focus:border-orange-500"
                        />
                        <Button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className="gap-1 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            <Send className="h-4 w-4" />
                            Send
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}


