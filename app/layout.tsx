import "./globals.css";
import type { Metadata } from "next";
import { Phone, Zap } from "lucide-react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "PièceFlash MTL — Livraison de pièces auto d'urgence",
  description:
    "Livraison de pièces automobiles d'urgence pour garagistes du Grand Montréal. Commandez en ligne, livraison rapide. Disponible 7j/7.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans")}>
      <head>
      </head>
      <body className="bg-background-light text-slate-900 antialiased overflow-x-hidden">
        {/* Header */}
        <header className="glass-header sticky top-0 z-50 w-full border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-orange-600 text-lg font-bold tracking-tight leading-none">
                  PièceFlash
                </span>
                <span className="text-slate-500 text-xs block leading-none font-medium">
                  Grand Montréal
                </span>
              </div>
            </Link>
            <a
              href="tel:+15147544607"
              className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 py-2 rounded-full transition-colors shadow-md shadow-orange-500/20"
            >
              <Phone className="w-4 h-4 mr-1.5 fill-current" />
              <span className="text-sm font-bold">514-754-4607</span>
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-4xl mx-auto pb-12">{children}</main>

        {/* Footer */}
        <footer className="text-center pb-8 pt-4 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            © 2026 PièceFlash MTL. Tous droits réservés.
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Service de livraison de pièces auto · Grand Montréal
          </p>
          <Link
            href="/admin"
            className="text-slate-300 text-xs hover:text-orange-500 mt-2 block"
          >
            Admin
          </Link>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
