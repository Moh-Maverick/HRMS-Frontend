"use client"
import ChatWidget from "@/components/ui/ChatWidget"

export default function EmployeeSectionLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            {children}
            <ChatWidget />
        </div>
    )
}


