import "./globals.css";
import type { Metadata } from "next";
import { Phone, Car } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Parebrise Instant - Remplacement de pare-brise",
  description:
    "Service professionnel de remplacement de pare-brise. Mobile ou en atelier. Montréal et environs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Google Fonts - Inter */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols for confirmation page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />

        {/* Google AdSense Script - Required for validation */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3075219266385896"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-background-light text-slate-900 antialiased overflow-x-hidden">
        {/* Sticky Header */}
        <header className="glass-header sticky top-0 z-50 w-full border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/30">
                <Car className="w-5 h-5" />
              </div>
              <h1 className="text-primary text-lg font-bold tracking-tight">
                Parebrise Instant
              </h1>
            </Link>
            <a
              href="tel:+15147544607"
              className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-4 py-2 rounded-full transition-colors shadow-md shadow-emerald-500/20"
            >
              <Phone className="w-4 h-4 mr-1.5 fill-current" />
              <span className="text-sm font-bold">Appelez</span>
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-4xl mx-auto pb-12">{children}</main>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-slate-400 text-sm">
            © 2026 Parebrise Instant. Tous droits réservés.
          </p>
          <Link
            href="/admin"
            className="text-slate-400 text-xs hover:text-primary"
          >
            Admin
          </Link>
        </footer>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
