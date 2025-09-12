"use client";

import { Header } from "./header";
import { Nav } from "./nav";

interface ConditionalNavbarsProps {
  locale: string;
  pathname?: string;
}

const VALID_LOCALES = ["en", "hi", "es", "pa"];

export function ConditionalNavbars({ locale, pathname }: ConditionalNavbarsProps) {
  // Determine current pathname if not provided
  if (pathname === undefined) {
    if (typeof window !== "undefined") {
      pathname = window.location.pathname;
    } else {
      pathname = "";
    }
  }

  // Hide navbars only on login and register pages
  if (pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/language')) {
    return null;
  }

  // Validate the locale and default to 'en' if invalid
  const validatedLocale = VALID_LOCALES.includes(locale) ? locale : "en";

  // Show navbars on all other pages
  return (
    <>
      <Header locale={validatedLocale} />
      <Nav locale={validatedLocale} />
    </>
  );
}