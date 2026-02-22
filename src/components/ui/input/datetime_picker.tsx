"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

// ─── Calendar Popover ────────────────────────────────────────────────────────

interface CalendarPopoverProps {
    value: Date | null;
    onChange: (d: Date) => void;
    onClose: () => void;
    withTime?: boolean;
}

function CalendarPopover({ value, onChange, onClose, withTime = true }: CalendarPopoverProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [hour, setHour] = useState(value?.getHours() ?? 0);
    const [minute, setMinute] = useState(value?.getMinutes() ?? 0);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
        i < firstDay ? null : i - firstDay + 1
    );

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    const selectDay = (day: number) => {
        const d = new Date(viewYear, viewMonth, day, hour, minute);
        setSelectedDate(d);
        if (!withTime) { onChange(d); onClose(); }
    };

    const confirm = () => {
        if (!selectedDate) return;
        const d = new Date(selectedDate);
        d.setHours(hour, minute, 0, 0);
        onChange(d);
        onClose();
    };

    const isSelected = (day: number) =>
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === viewMonth &&
        selectedDate?.getFullYear() === viewYear;

    const isToday = (day: number) =>
        today.getDate() === day &&
        today.getMonth() === viewMonth &&
        today.getFullYear() === viewYear;

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-5 w-[320px] select-none" style={{ fontFamily: "inherit" }}>
            {/* ── Month/Year header ── */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                    <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-semibold text-gray-800">
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* ── Day headers ── */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>
                ))}
            </div>

            {/* ── Day cells ── */}
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, i) => (
                    <div key={i} className="flex items-center justify-center">
                        {day !== null ? (
                            <button
                                onClick={() => selectDay(day)}
                                className={`w-9 h-9 rounded-full text-sm font-medium transition-all
                                    ${isSelected(day)
                                        ? "bg-[#1C3A37] text-white shadow-sm"
                                        : isToday(day)
                                            ? "bg-[#D9F55C] text-black font-semibold"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {day}
                            </button>
                        ) : <span />}
                    </div>
                ))}
            </div>

            {/* ── Time picker ── */}
            {withTime && (
                <>
                    <div className="border-t border-gray-100 mt-4 pt-4">
                        <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                            <Clock size={12} /> Time
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            {/* Hour */}
                            <div className="flex flex-col items-center">
                                <button onClick={() => setHour((h) => (h + 1) % 24)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-[-90deg]" />
                                </button>
                                <div className="w-14 h-10 bg-[#F0F5D8] rounded-xl flex items-center justify-center text-lg font-bold text-[#1C3A37] tabular-nums">
                                    {String(hour).padStart(2, "0")}
                                </div>
                                <button onClick={() => setHour((h) => (h - 1 + 24) % 24)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>
                            <span className="text-2xl font-bold text-gray-400 mb-0.5">:</span>
                            {/* Minute */}
                            <div className="flex flex-col items-center">
                                <button onClick={() => setMinute((m) => (m + 1) % 60)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-[-90deg]" />
                                </button>
                                <div className="w-14 h-10 bg-[#F0F5D8] rounded-xl flex items-center justify-center text-lg font-bold text-[#1C3A37] tabular-nums">
                                    {String(minute).padStart(2, "0")}
                                </div>
                                <button onClick={() => setMinute((m) => (m - 1 + 60) % 60)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Confirm row */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5">
                            Cancel
                        </button>
                        <button
                            onClick={confirm}
                            disabled={!selectedDate}
                            className="bg-[#1C3A37] text-white text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-[#2a504c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            OK
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Public: M3DateTimePicker ────────────────────────────────────────────────

interface M3DateTimePickerProps {
    label?: string;
    value: Date | null;
    onChange: (d: Date) => void;
    error?: string;
    required?: boolean;
}

export function M3DateTimePicker({ label, value, onChange, error, required }: M3DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const display = value
        ? value.toLocaleString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "";

    return (
        <div className="relative" ref={ref}>
            {label && (
                <label className="block text-sm font-semibold mb-1">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center justify-between rounded-full border px-4 py-2.5 text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#D9F55C] ${error ? "border-red-400" : open ? "border-[#1C3A37]" : "border-gray-300 hover:border-gray-400"}`}
            >
                <span className={value ? "text-gray-800" : "text-gray-400"}>{display || "DD/MM/YYYY HH:mm"}</span>
                <Calendar size={15} className="text-gray-400 shrink-0" />
            </button>
            {error && <p className="text-red-400 text-xs mt-1 pl-2">{error}</p>}
            {open && (
                <div className="absolute z-50 mt-2 left-0">
                    <CalendarPopover
                        value={value}
                        withTime={true}
                        onChange={(d) => { onChange(d); setOpen(false); }}
                        onClose={() => setOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

// ─── Public: M3TimePicker ────────────────────────────────────────────────────

interface M3TimePickerProps {
    label?: string;
    value: string; // "HH:mm"
    onChange: (v: string) => void;
    error?: string;
    required?: boolean;
}

export function M3TimePicker({ label, value, onChange, error, required }: M3TimePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [hour, setHour] = useState(() => value ? parseInt(value.split(":")[0]) : 0);
    const [minute, setMinute] = useState(() => value ? parseInt(value.split(":")[1]) : 0);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const confirm = () => {
        onChange(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
        setOpen(false);
    };

    const display = value || "";

    return (
        <div className="relative" ref={ref}>
            {label && (
                <label className="block text-sm font-semibold mb-1">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center justify-between rounded-full border px-4 py-2.5 text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#D9F55C] ${error ? "border-red-400" : open ? "border-[#1C3A37]" : "border-gray-300 hover:border-gray-400"}`}
            >
                <span className={value ? "text-gray-800" : "text-gray-400"}>{display || "HH:mm"}</span>
                <Clock size={15} className="text-gray-400 shrink-0" />
            </button>
            {error && <p className="text-red-400 text-xs mt-1 pl-2">{error}</p>}

            {open && (
                <div className="absolute z-50 mt-2 left-0">
                    <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-5 w-[200px] select-none">
                        <p className="text-xs font-semibold text-gray-500 mb-4 flex items-center gap-1.5">
                            <Clock size={12} /> Select Time
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            {/* Hour */}
                            <div className="flex flex-col items-center">
                                <button onClick={() => setHour((h) => (h + 1) % 24)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-[-90deg]" />
                                </button>
                                <div className="w-14 h-10 bg-[#F0F5D8] rounded-xl flex items-center justify-center text-lg font-bold text-[#1C3A37] tabular-nums">
                                    {String(hour).padStart(2, "0")}
                                </div>
                                <button onClick={() => setHour((h) => (h - 1 + 24) % 24)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>
                            <span className="text-2xl font-bold text-gray-400">:</span>
                            {/* Minute */}
                            <div className="flex flex-col items-center">
                                <button onClick={() => setMinute((m) => (m + 5) % 60)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-[-90deg]" />
                                </button>
                                <div className="w-14 h-10 bg-[#F0F5D8] rounded-xl flex items-center justify-center text-lg font-bold text-[#1C3A37] tabular-nums">
                                    {String(minute).padStart(2, "0")}
                                </div>
                                <button onClick={() => setMinute((m) => (m - 5 + 60) % 60)} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={confirm}
                                className="bg-[#1C3A37] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#2a504c] transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
