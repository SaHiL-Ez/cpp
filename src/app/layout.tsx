
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Nav } from "@/components/nav";
import { Toaster } from "@/components/ui/toaster";
import { Bot, Leaf } from "lucide-react";
import "./globals.css";
import { FarmProvider } from "@/contexts/farm-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AgriMitra",
  description: "Smart Crop Advisory System for Small and Marginal Farmers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
         <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className="font-body antialiased">
        <FarmProvider>
            <div className="flex flex-col min-h-svh">
                <Header />
                <main className="flex-1 pb-20 md:pb-24">{children}</main>
                <Nav />
                <div className="fixed bottom-20 right-4 z-50">
                   <Button asChild size="icon" className="rounded-full w-16 h-16 shadow-lg bg-accent hover:bg-accent/90 animate-pulse-glow">
                        <Link href="/ai-chatbot">
                            <Bot className="h-8 w-8 text-accent-foreground" />
                            <span className="sr-only">Open AI Chatbot</span>
                        </Link>
                    </Button>
                </div>
            </div>
            <Toaster />
        </FarmProvider>
      </body>
    </html>
  );
}
