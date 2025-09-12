"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Languages,
  ScanEye,
  LineChart,
  Map,
  BookUser
} from "lucide-react";

interface NavProps {
  locale: string;
  pathname?: string;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crop-advisory", label: "Advisory", icon: Languages },
  { href: "/pest-detection", label: "Detection", icon: ScanEye },
  { href: "/crop-health", label: "Health Map", icon: Map },
  { href: "/kisan-yojana", label: "Yojana", icon: BookUser },
  { href: "/market-prices", label: "Markets", icon: LineChart },
];

const VALID_LOCALES = ["en", "hi", "es", "pa"];

export function Nav({ locale, pathname }: NavProps) {
  if (pathname === undefined) {
    if (typeof window !== "undefined") {
      pathname = window.location.pathname;
    } else {
      pathname = "";
    }
  }
  
  // Validate the locale and default to 'en' if invalid
  const validatedLocale = VALID_LOCALES.includes(locale) ? locale : "en";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const href = item.href === "/" ? `/${validatedLocale}/dashboard` : `/${validatedLocale}${item.href}`;
            return (
              <li key={item.href}>
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary p-2",
                    pathname === href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}