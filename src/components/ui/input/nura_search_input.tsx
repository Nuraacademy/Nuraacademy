"use client"

import React from "react";
import { Search } from "lucide-react";

interface NuraSearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

export const NuraSearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    className = ""
}: NuraSearchInputProps) => {
    return (
        <div className={`relative isolate flex items-center ${className}`}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 bg-white py-1.5 pl-4 pr-10 text-base font-medium shadow-sm transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-800">
                <Search size={20} strokeWidth={1.5} />
            </div>
        </div>
    );
};
