"use client"

import { useRouter } from "next/navigation"
import { NuraButton } from "@/components/ui/button/button"
import { FileQuestion } from "lucide-react"

interface NotFoundStateProps {
    title: string
    message: string
    buttonLabel?: string
    onBack?: () => void
}

export function NotFoundState({
    title,
    message,
    buttonLabel = "Back to Overview",
    onBack,
}: NotFoundStateProps) {
    const router = useRouter()

    const handleBack = onBack || (() => router.back())

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-[2.5rem] shadow-xl border border-emerald-50 text-[#075546]">
                    <FileQuestion size={64} strokeWidth={1.5} />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 max-w-md mb-10 leading-relaxed">
                {message}
            </p>

            <NuraButton
                label={buttonLabel}
                variant="primary"
                className="min-w-[200px] !rounded-full py-3 shadow-lg shadow-emerald-900/10"
                onClick={handleBack}
            />
        </div>
    )
}
