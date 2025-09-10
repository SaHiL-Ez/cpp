"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ConditionalNavbars } from "@/components/ConditionalNavbars";
import i18n from "@/i18n";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FarmProvider } from "@/contexts/farm-context";

const inter = Inter({ subsets: ["latin"] });

export default function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const pathname = usePathname();

  useEffect(() => {
    // Set i18n language from URL locale
    if (!pathname) return;
    const locale = pathname.split("/")[1];
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [pathname]);

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.className} font-body antialiased`}>
        <FarmProvider>
          <div className="flex flex-col min-h-svh">
            <ConditionalNavbars locale={params.locale} />
            <main className="flex-1 pb-20 md:pb-24">{children}</main>
            <div className="fixed bottom-20 right-4 z-50">
              <Button
                asChild
                size="icon"
                className="rounded-full w-16 h-16 shadow-lg bg-accent hover:bg-accent/90 animate-pulse-glow"
              >
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
