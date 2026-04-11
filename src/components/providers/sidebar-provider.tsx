"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const setSidebarOpen = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}

/** Offset konten agar selaras dengan sidebar global (dipakai dari server components). */
export function SidebarLayoutPad({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(SidebarContext);
  const isOpen = ctx?.isOpen ?? false;

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isOpen ? "md:pl-80" : "md:pl-8",
        className
      )}
    >
      {children}
    </div>
  );
}
