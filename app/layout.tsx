import "./globals.css";
import type { Metadata } from "next";
import { Phone, Car } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AutoGlass Pro - Remplacement de pare-brise",
  description:
    "Service professionnel de remplacement de pare-brise. Mobile ou en atelier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
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
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <h1 className="text-primary text-lg font-bold tracking-tight">
                AutoGlass Pro
              </h1>
            </Link>
            <a
              href="tel:+15145551234"
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
            © 2024 AutoGlass Pro. Tous droits réservés.
          </p>
          <Link
            href="/admin"
            className="text-slate-400 text-xs hover:text-primary"
          >
            Admin
          </Link>
        </footer>
      </body>
    </html>
  );
}
