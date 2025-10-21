"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export const GlassCard = ({ children, className, delay = 0 }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className={cn(
                "bg-blue-600/20 backdrop-blur-glass border border-blue-500/30 rounded-2xl p-6",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
