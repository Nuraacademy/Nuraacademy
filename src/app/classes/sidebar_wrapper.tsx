"use client"

import Sidebar from "@/components/ui/sidebar/sidebar"
import { useState } from "react"

export default function SidebarWrapper() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // We update body style or a contextual wrapper to handle the padding shift
    // This removes the need for the entire page to be a client component.
    if (typeof window !== "undefined") {
        const mainEl = document.querySelector('main');
        if (mainEl) {
            if (isSidebarOpen) {
                mainEl.classList.add("md:pl-80");
                mainEl.classList.remove("md:pl-8");
            } else {
                mainEl.classList.add("md:pl-8");
                mainEl.classList.remove("md:pl-80");
            }
        }
    }

    return <Sidebar onOpenChange={setIsSidebarOpen} />
}
