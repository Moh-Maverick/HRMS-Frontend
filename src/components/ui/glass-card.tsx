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
                "bg-white/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
