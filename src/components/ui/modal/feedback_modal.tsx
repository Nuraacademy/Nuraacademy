"use client";

import { CheckCircle, AlertCircle, X } from "lucide-react";
import { NuraButton } from "../button/button";

interface FeedbackModalProps {
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: React.ReactNode;
    errors?: string[];
    onClose: () => void;
    /** Only shown on success type */
    onConfirm?: () => void;
    confirmText?: string;
    closeText?: string;
}

export function FeedbackModal({
    isOpen,
    type,
    title,
    message,
    errors,
    onClose,
    onConfirm,
    confirmText = "OK",
    closeText = "Close",
}: FeedbackModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Card */}
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                {/* Close X */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${type === "success" ? "bg-[#D9F55C]" : "bg-red-50"}`}>
                    {type === "success"
                        ? <CheckCircle size={32} className="text-[#1C3A37]" />
                        : <AlertCircle size={32} className="text-red-500" />
                    }
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>

                {/* Message */}
                <div className="text-sm text-gray-600 mb-4 leading-relaxed">{message}</div>

                {/* Error list */}
                {errors && errors.length > 0 && (
                    <ul className="w-full text-left bg-red-50 border border-red-100 rounded-2xl p-4 mb-5 space-y-1">
                        {errors.map((e, i) => (
                            <li key={i} className="text-xs text-red-600 flex items-start gap-2">
                                <span className="mt-0.5 shrink-0">•</span>
                                <span>{e}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Buttons */}
                <div className="flex gap-3 w-full justify-center mt-1">
                    {type === "success" && onConfirm ? (
                        <>
                            <NuraButton label={closeText} variant="secondary" onClick={onClose} />
                            <NuraButton label={confirmText} variant="primary" onClick={onConfirm} />
                        </>
                    ) : (
                        <NuraButton label={closeText} variant={type === "success" ? "primary" : "secondary"} onClick={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
}
