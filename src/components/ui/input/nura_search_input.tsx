"use client"

import React from "react";
import Image from "next/image";

interface NuraSearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

export const NuraSearchInput = ({
    value,
    onChange,
    placeholder = "Search",
    className = ""
}: NuraSearchInputProps) => {
    return (
        <div className={`relative group flex items-center ${className}`}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-11 text-sm md:text-base 
                           transition-all duration-200 
                           hover:border-gray-300
                           focus:border-black focus:outline-none focus:ring-1 focus:ring-black
                           placeholder:text-gray-400 text-black"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none 
                            transition-opacity duration-200 group-focus-within:opacity-100 opacity-70">
                <Image 
                    src="/icons/Search.svg" 
                    alt="" 
                    width={18} 
                    height={18} 
                    className="grayscale brightness-0" // Ensures icon matches text color if it's colorful
                />
            </div>
        </div>
    );
};