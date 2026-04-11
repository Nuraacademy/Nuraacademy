"use client";

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useSidebar } from "@/components/providers/sidebar-provider";

export default function SidebarWrapper() {
  const { setSidebarOpen } = useSidebar();

  return <Sidebar onOpenChange={setSidebarOpen} />;
}
