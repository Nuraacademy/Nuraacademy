"use client"

import Sidebar from "@/components/ui/sidebar/sidebar"
import { useState } from "react"

export default function SidebarWrapper() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return <Sidebar onOpenChange={setIsSidebarOpen} />
}
