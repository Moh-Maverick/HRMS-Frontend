"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    icon: LucideIcon
    title: string
    value: string | number
    subtitle?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    delay?: number
}

export const StatsCard = ({ icon: Icon, title, value, subtitle, trend, delay = 0 }: StatsCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-card/40 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {trend && (
                        <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.isPositive ? '+' : ''}{trend.value}%
                        </span>
                    )}
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
        </motion.div>
    )
}
