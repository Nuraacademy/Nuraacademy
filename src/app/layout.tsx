import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/ui/header/header";
import Footer from "@/components/ui/footer/footer";


import { NavigationProvider } from "@/components/providers/navigation-provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Nura Academy",
  description: "NuraAcademy",
  icons: {
    icon: "/logo/favicon.svg"
  },
  manifest: "/manifest.json"
};

import { getSession } from "@/app/actions/auth";
import SidebarWrapper from "@/app/classes/sidebar_wrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSession();

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased min-h-screen`}
      >
        <NavigationProvider>
          <Header initialIsLoggedIn={!!userId} />

          {userId && <SidebarWrapper />}
          
          <main className="transition-all duration-300">
            {children}
          </main>

          <Toaster position="bottom-right" richColors />

          <Footer instagram="www.instagram.com" youtube="www.youtube.com" x="www.x.com" />
        </NavigationProvider>
      </body>
    </html>
  );
}
