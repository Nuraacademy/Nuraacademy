"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface NavigationContextType {
  isRedirecting: boolean;
  setIsRedirecting: (value: boolean) => void;
  startRedirect: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Reset redirecting state when pathname changes, but with a slight delay 
  // to ensure the new page content is actually visible to the user.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRedirecting(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Global Interceptor for programmatic redirects (monkey-patch history API)
  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const handleNavigation = (url: string | URL | null | undefined) => {
      if (!url) return;
      const href = url.toString();
      
      try {
        const nextUrl = new URL(href, window.location.origin);
        // Only trigger if it's an internal path change
        if (nextUrl.origin === window.location.origin && nextUrl.pathname !== window.location.pathname) {
          setTimeout(() => setIsRedirecting(true), 0);
        }
      } catch (e) {
        if (href.startsWith('/') && !href.startsWith('//')) {
          setTimeout(() => setIsRedirecting(true), 0);
        }
      }
    };

    window.history.pushState = function(...args) {
      handleNavigation(args[2]);
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      handleNavigation(args[2]);
      return originalReplaceState.apply(this, args);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const startRedirect = (href: string) => {
    setIsRedirecting(true);
    router.push(href);
  };

  return (
    <NavigationContext.Provider value={{ isRedirecting, setIsRedirecting, startRedirect }}>
      {children}
      {isRedirecting && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-6 p-12 rounded-3xl bg-white shadow-2xl border border-neutral-100">
            <Loader2 className="h-12 w-12 animate-spin text-black" strokeWidth={2.5} />
            <div className="flex flex-col items-center gap-1">
              <p className="text-lg font-bold text-neutral-900">
                Redirecting...
              </p>
              <p className="text-sm text-neutral-500 animate-pulse">
                Please wait while we load the page
              </p>
            </div>
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

export function useNuraRouter() {
  const router = useRouter();
  const { setIsRedirecting } = useNavigation();

  return {
    ...router,
    push: (href: string, options?: any) => {
      setTimeout(() => setIsRedirecting(true), 0);
      return router.push(href, options);
    },
    replace: (href: string, options?: any) => {
      setTimeout(() => setIsRedirecting(true), 0);
      return router.replace(href, options);
    },
  };
}
