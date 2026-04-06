"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Configuration & Helpers ---
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

// --- Calendar Popover Component ---
interface CalendarPopoverProps {
    value: Date | null;
    onChange: (d: Date) => void;
    onClose: () => void;
    withTime?: boolean;
    minDate?: Date | null;
    maxDate?: Date | null;
}

function CalendarPopover({ value, onChange, onClose, withTime = true, minDate, maxDate }: CalendarPopoverProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);

    // Time State
    const [hour, setHour] = useState(value?.getHours() ?? 0);
    const [minute, setMinute] = useState(value?.getMinutes() ?? 0);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
        i < firstDay ? null : i - firstDay + 1
    );

    const handleSelectDay = (day: number) => {
        const d = new Date(viewYear, viewMonth, day, hour, minute);
        setSelectedDate(d);
        if (!withTime) {
            onChange(d);
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!selectedDate) return;
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hour, minute, 0, 0);

        if (minDate && finalDate < minDate) {
            // If it's the same day, we could show an error or just adjust to minDate
            // For now, let's block it or adjust it. 
            // Most users expect it to just work, but "cannot be before" is strict.
            // Let's just use minDate if it's before.
            onChange(minDate);
        } else if (maxDate && finalDate > maxDate) {
            onChange(maxDate);
        } else {
            onChange(finalDate);
        }
        onClose();
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-5 w-[320px] select-none animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => viewMonth === 0 ? (setViewMonth(11), setViewYear(v => v - 1)) : setViewMonth(v => v - 1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                </button>
                <span className="text-sm font-medium text-black uppercase tracking-tight">
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                    type="button"
                    onClick={() => viewMonth === 11 ? (setViewMonth(0), setViewYear(v => v + 1)) : setViewMonth(v => v + 1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {DAYS.map(d => (
                    <span key={d} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    const isSel = day === selectedDate?.getDate() && viewMonth === selectedDate?.getMonth() && viewYear === selectedDate?.getFullYear();
                    const isTod = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

                    let isDisabled = false;
                    if (day) {
                        const cellDate = new Date(viewYear, viewMonth, day);
                        if (minDate) {
                            // Set minDate to start of day for comparison
                            const compMin = new Date(minDate);
                            compMin.setHours(0, 0, 0, 0);
                            if (cellDate < compMin) isDisabled = true;
                        }
                        if (maxDate) {
                            const compMax = new Date(maxDate);
                            compMax.setHours(23, 59, 59, 999);
                            if (cellDate > compMax) isDisabled = true;
                        }
                    }

                    return (
                        <div key={i} className="flex items-center justify-center">
                            {day ? (
                                <button
                                    type="button"
                                    onClick={() => !isDisabled && handleSelectDay(day)}
                                    disabled={isDisabled}
                                    className={cn(
                                        "w-9 h-9 rounded-xl text-sm font-semibold transition-all",
                                        isSel ? "bg-black text-white" : isTod ? "bg-[#D9F55C] text-black" : "hover:bg-gray-100 text-gray-700",
                                        isDisabled && "opacity-20 cursor-not-allowed hover:bg-transparent"
                                    )}
                                >
                                    {day}
                                </button>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {/* Time Picker Logic */}
            {withTime && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> Set Time
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        {/* Hours */}
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                value={String(hour).padStart(2, '0')}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(-2);
                                    if (val === '') { setHour(0); return; }
                                    const h = parseInt(val);
                                    if (h >= 0 && h <= 23) setHour(h);
                                }}
                                className="w-14 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl font-medium tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                            <div className="flex gap-1 mt-1">
                                <button type="button" onClick={() => setHour(h => (h + 23) % 24)} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} className="-rotate-90" /></button>
                                <button type="button" onClick={() => setHour(h => (h + 1) % 24)} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} className="rotate-90" /></button>
                            </div>
                        </div>
                        <span className="text-xl font-medium text-gray-300 pb-6">:</span>
                        {/* Minutes */}
                        <div className="flex flex-col items-center">
                            <input
                                type="text"
                                value={String(minute).padStart(2, '0')}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(-2);
                                    if (val === '') { setMinute(0); return; }
                                    const m = parseInt(val);
                                    if (m >= 0 && m <= 59) setMinute(m);
                                }}
                                className="w-14 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl font-medium tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                            <div className="flex gap-1 mt-1">
                                <button type="button" onClick={() => setMinute(m => (m + 55) % 60)} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} className="-rotate-90" /></button>
                                <button type="button" onClick={() => setMinute(m => (m + 5) % 60)} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} className="rotate-90" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-black transition-colors">Cancel</button>
                        <button type="button" onClick={handleConfirm} className="px-6 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-zinc-800 shadow-sm transition-all">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main Picker Component (Themed to NuraTextInput) ---
interface M3DateTimePickerProps {
    label?: string;
    value: Date | null;
    onChange: (d: Date) => void;
    error?: string;
    required?: boolean;
    withTime?: boolean;
    className?: string;
    id?: string;
    placeholder?: string;
    minDate?: Date | null;
    maxDate?: Date | null;
    disabled?: boolean;
}

export default function M3DateTimePicker({
    label,
    value,
    onChange,
    error,
    required,
    withTime = true,
    className,
    id,
    placeholder,
    minDate,
    maxDate,
    disabled
}: M3DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const defaultPlaceholder = withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY";
    const effectivePlaceholder = placeholder || defaultPlaceholder;

    // Close on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const displayDate = value
        ? value.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            ...(withTime ? {
                hour: "2-digit",
                minute: "2-digit"
            } : {})
        })
        : "";

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {label && (
                <label className="block text-sm mb-1 text-black">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    id={id}
                    type="button"
                    onClick={() => !disabled && setOpen(!open)}
                    disabled={disabled}
                    className={cn(
                        "w-full flex items-center justify-between bg-white border px-4 py-2 text-sm transition-all text-left",
                        "rounded-xl", // Exact match to NuraTextInput
                        error
                            ? "border-red-500"
                            : open
                                ? "border-black ring-2 ring-black/5"
                                : "border-black hover:border-zinc-700",
                        disabled && "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200",
                        "focus:outline-none focus:ring-2 focus:ring-black"
                    )}
                >
                    <span className={value ? "text-black" : "text-gray-400"}>
                        {displayDate || effectivePlaceholder}
                    </span>
                    <Calendar size={16} className="text-gray-400 shrink-0" />
                </button>

                {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}

                {open && (
                    <div className="absolute z-[100] mt-2 right-0 md:left-0 md:right-auto">
                        <CalendarPopover
                            value={value}
                            withTime={withTime}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={(d) => {
                                onChange(d);
                                if (!withTime) setOpen(false);
                            }}
                            onClose={() => setOpen(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}