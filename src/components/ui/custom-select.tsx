"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    options: Array<{ id: string; name: string }>
    className?: string
    icon?: React.ReactNode
}

export const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
    ({ value, onChange, placeholder = "Select an option", options, className, icon }, ref) => {
        const [isOpen, setIsOpen] = useState(false)
        const [highlightedIndex, setHighlightedIndex] = useState(-1)
        const selectRef = useRef<HTMLDivElement>(null)
        const optionRefs = useRef<(HTMLDivElement | null)[]>([])

        const selectedOption = options.find(option => option.name === value)

        // Close dropdown on outside click
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                    setIsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        // Keyboard navigation
        const handleKeyDown = (event: React.KeyboardEvent) => {
            switch (event.key) {
                case 'Enter':
                case ' ':
                    event.preventDefault()
                    if (!isOpen) {
                        setIsOpen(true)
                    } else if (highlightedIndex >= 0) {
                        onChange(options[highlightedIndex].name)
                        setIsOpen(false)
                    }
                    break
                case 'ArrowDown':
                    event.preventDefault()
                    setIsOpen(true)
                    setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0))
                    break
                case 'ArrowUp':
                    event.preventDefault()
                    setIsOpen(true)
                    setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1))
                    break
                case 'Escape':
                    event.preventDefault()
                    setIsOpen(false)
                    break
            }
        }

        // Scroll highlighted option into view
        useEffect(() => {
            if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
                optionRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
            }
        }, [highlightedIndex])

        return (
            <div ref={ref} className={cn("relative w-full", className)}>
                {/* Select Box */}
                <div
                    ref={selectRef}
                    className={cn(
                        "flex h-12 w-full items-center justify-between rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white cursor-pointer hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-accent transition-colors",
                        isOpen && "ring-2 ring-accent"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className={value ? "text-white" : "text-white/50"}>
                            {value || placeholder}
                        </span>
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform text-white/60",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>

                {/* Options List */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-900/80 border border-white/20 rounded-lg shadow-lg max-h-60 overflow-auto backdrop-blur-md">
                        {options.map((option, index) => {
                            const isSelected = option.name === value
                            const isHighlighted = index === highlightedIndex
                            return (
                                <div
                                    key={option.id}
                                    ref={el => { optionRefs.current[index] = el }}

                                    className={cn(
                                        "px-3 py-2 text-sm cursor-pointer transition-colors",
                                        isSelected && "bg-accent/30 text-accent font-medium",
                                        isHighlighted && "bg-white/20 text-white font-medium"
                                    )}
                                    onClick={() => {
                                        onChange(option.name)
                                        setIsOpen(false)
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    {option.name}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }
)

CustomSelect.displayName = "CustomSelect"
