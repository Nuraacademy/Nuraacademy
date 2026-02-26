"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Option {
    label: string
    value: string
}

interface NuraSelectProps {
    options: Option[]
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    label?: string
    className?: string
}

export const NuraSelect = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    label,
    className = ""
}: NuraSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center justify-between rounded-[1rem] border border-gray-300 bg-white px-5 py-2 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-black ${isOpen ? "ring-2 ring-black" : ""}`}
            >
                <span className="text-base font-medium">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-800" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-800" />
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-[1rem] bg-white border border-gray-200 shadow-xl">
                    <div className="py-2">
                        {options.map((option, index) => (
                            <div key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange?.(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full px-6 py-2 text-left text-base font-medium transition-colors hover:bg-gray-50 ${option.value === value ? "bg-gray-100" : ""
                                        }`}
                                >
                                    {option.label}
                                </button>
                                {index < options.length - 1 && (
                                    <div className="mx-6 border-b border-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
