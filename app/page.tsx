import CommandeForm from "@/components/CommandeForm";
import {
  Zap,
  Clock,
  MapPin,
  Package,
  Phone,
  CheckCircle2,
  Truck,
  Shield,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative px-4 pt-10 pb-6 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute top-32 -left-16 w-64 h-64 bg-red-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 animate-fade-in-up">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Livraison express · Grand Montréal
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4 animate-fade-in-up delay-200">
            La pièce qu&apos;il vous faut,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 animate-gradient">
              livrée maintenant
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed mb-6 max-w-xl animate-fade-in-up delay-400">
            Votre client attend, le véhicule est immobilisé. Commandez la pièce
            en 2 minutes et recevez la livraison à votre garage.
          </p>

          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up delay-400">
            {[
              { icon: Zap, text: "Livraison ultra-rapide" },
              { icon: Clock, text: "7 jours sur 7" },
              { icon: MapPin, text: "Grand Montréal" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-orange-100 text-slate-700 text-xs font-semibold shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-orange-500" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ── */}
      <section className="px-4 -mt-2 mb-10 scroll-animate">
        <CommandeForm />
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="px-4 py-10 bg-white scroll-animate">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Comment ça marche?
          </h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            3 étapes simples pour recevoir votre pièce
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: Package,
                title: "Commandez en ligne",
                desc: "Remplissez le formulaire avec les infos de votre garage, le véhicule et les pièces requises.",
                color: "bg-orange-50 text-orange-600",
              },
              {
                step: "2",
                icon: Phone,
                title: "On vous confirme",
                desc: "Notre équipe valide la disponibilité et vous rappelle pour confirmer la commande.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                step: "3",
                icon: Truck,
                title: "Livraison express",
                desc: "La pièce est livrée directement à votre garage. Votre client repart vite.",
                color: "bg-green-50 text-green-600",
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-slate-100 bg-slate-50"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} font-bold text-lg shadow-sm relative`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="px-4 py-10 bg-gradient-to-br from-orange-500 to-red-600 text-white scroll-animate">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Pourquoi les garagistes nous choisissent
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: "Ultra-rapide", desc: "Délai de livraison minimal" },
              { icon: Shield, title: "Pièces fiables", desc: "Qualité OEM ou équivalent" },
              { icon: Clock, title: "7j/7", desc: "Disponible tous les jours" },
              { icon: MapPin, title: "Grand Montréal", desc: "Toute la région couverte" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
              >
                <Icon className="w-7 h-7 text-orange-200" />
                <p className="font-bold text-sm">{title}</p>
                <p className="text-xs text-orange-100">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="px-4 py-10 bg-white scroll-animate">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Ce que disent nos garagistes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                nom: "Marco D.",
                garage: "Garage Deschênes, Montréal",
                avis: "J'avais besoin d'une pompe à eau pour une Honda Civic en urgence. Livrée en moins d'une heure. Incroyable!",
              },
              {
                nom: "Jérémy L.",
                garage: "Auto Expert Laval",
                avis: "Service impeccable. Le formulaire est simple, le livreur est ponctuel. Je recommande à tous les garagistes.",
              },
            ].map(({ nom, garage, avis }) => (
              <div
                key={nom}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  &ldquo;{avis}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{nom}</p>
                  <p className="text-xs text-slate-500">{garage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-10 bg-slate-50 scroll-animate">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Questions fréquentes
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "Quelle est la zone de livraison?",
                a: "Nous livrons dans tout le Grand Montréal : Montréal, Laval, Longueuil, Brossard, Repentigny, Saint-Jean-sur-Richelieu, et les environs.",
              },
              {
                q: "Combien de temps pour la livraison?",
                a: "Le délai varie selon la disponibilité de la pièce et votre emplacement. Pour les commandes critiques, nous visons moins d'une heure dans les zones centrales.",
              },
              {
                q: "Quels types de pièces livrez-vous?",
                a: "Toutes pièces automobiles : pièces mécaniques, filtres, courroies, freins, suspensions, pièces de carrosserie, accessoires et plus encore. Si vous en avez besoin, on la trouve.",
              },
              {
                q: "Comment se fait le paiement?",
                a: "Notre équipe vous communique le prix lors de la confirmation de commande. Paiement au comptant ou par virement à la livraison.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl bg-white border border-slate-200 p-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-slate-900 text-sm list-none">
                  <span>{q}</span>
                  <span className="text-orange-500 ml-3 text-lg leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-4 py-12 bg-slate-900 text-white text-center scroll-animate">
        <div className="max-w-lg mx-auto">
          <CheckCircle2 className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            Besoin d&apos;une pièce maintenant?
          </h2>
          <p className="text-slate-400 mb-6 text-sm">
            Commandez en ligne ou appelez-nous directement. On s&apos;occupe du reste.
          </p>
          <a
            href="tel:+15147544607"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-orange-500/30 transition-all text-lg"
          >
            <Phone className="w-5 h-5 fill-current" />
            514-754-4607
          </a>
        </div>
      </section>
    </div>
  );
}
