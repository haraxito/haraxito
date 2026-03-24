import Link from "next/link";
import { CheckCircle2, Package, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header orange */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold mb-1">Commande reçue!</h1>
          <p className="text-orange-100 text-sm">
            Notre équipe s&apos;en occupe maintenant
          </p>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
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
            <Package className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
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
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5">
                <Phone className="w-4 h-4 mr-2 fill-current" />
                Appeler le 514-754-4607
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Passer une nouvelle commande
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
