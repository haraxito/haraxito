import Link from "next/link";
import { CheckCircle2, Package, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-32 -left-16 w-64 h-64 bg-red-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-xl shadow-orange-500/10 border border-orange-100/60 overflow-hidden animate-fade-in-up">
        {/* Header orange */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 ring-4 ring-white/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-100 animate-gradient">
              Commande reçue!
            </span>
          </h1>
          <p className="text-orange-100 text-sm">
            Notre équipe s&apos;en occupe maintenant
          </p>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 rounded-full px-4 py-1.5 text-sm font-semibold self-center">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Traitement en cours
          </div>

          <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 flex gap-3">
            <Zap className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Que se passe-t-il maintenant?
              </p>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                Notre équipe vérifie la disponibilité de la pièce et vous
                rappelle sous peu pour confirmer la livraison.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex gap-3">
            <Package className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Livraison à votre garage
              </p>
              <p className="text-slate-500 text-sm mt-1">
                La pièce sera livrée directement à l&apos;adresse indiquée dans votre
                commande.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a href="tel:+15147544607">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-5 shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 active:scale-100 transition-all">
                <Phone className="w-4 h-4 mr-2 fill-current" />
                Appeler le 514-754-4607
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all">
                Passer une nouvelle commande
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
