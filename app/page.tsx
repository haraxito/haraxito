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
      <section className="relative px-4 pt-10 pb-8 bg-gradient-to-b from-orange-50 via-amber-50/40 to-white overflow-hidden">
        {/* Blobs décoratifs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 -left-12 w-56 h-56 bg-gradient-to-br from-amber-400/15 to-orange-300/10 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-gradient-to-t from-orange-200/20 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge live */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200/80 text-orange-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 animate-fade-in-up shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse-ring" />
            Livraison express · Grand Montréal
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4 animate-fade-in-up delay-200 tracking-tight">
            La pièce qu&apos;il vous faut,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 animate-gradient">
              livrée maintenant
            </span>
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed mb-7 max-w-xl animate-fade-in-up delay-400">
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-100 text-slate-700 text-xs font-semibold shadow-sm"
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
      <section className="px-4 py-12 bg-white scroll-animate">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2 tracking-tight">
            Comment ça marche?
          </h2>
          <p className="text-center text-slate-400 mb-10 text-sm">
            3 étapes simples pour recevoir votre pièce
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                icon: Package,
                title: "Commandez en ligne",
                desc: "Remplissez le formulaire avec les infos de votre garage, le véhicule et les pièces requises.",
                gradient: "from-orange-500 to-amber-400",
                bg: "bg-orange-50",
                ring: "ring-orange-100",
              },
              {
                step: "2",
                icon: Phone,
                title: "On vous confirme",
                desc: "Notre équipe valide la disponibilité et vous rappelle pour confirmer la commande.",
                gradient: "from-sky-500 to-blue-400",
                bg: "bg-sky-50",
                ring: "ring-sky-100",
              },
              {
                step: "3",
                icon: Truck,
                title: "Livraison express",
                desc: "La pièce est livrée directement à votre garage. Votre client repart vite.",
                gradient: "from-emerald-500 to-green-400",
                bg: "bg-emerald-50",
                ring: "ring-emerald-100",
              },
            ].map(({ step, icon: Icon, title, desc, gradient, bg, ring }) => (
              <div
                key={step}
                className={`flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-slate-100 ${bg} card-lift ring-1 ${ring}`}
              >
                <div className="relative">
                  <div className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
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
      <section className="px-4 py-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white scroll-animate relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-red-800/20 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">
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
                className="flex flex-col items-center text-center gap-2.5 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-250 hover:bg-white/15 active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-sm">{title}</p>
                <p className="text-xs text-orange-100/90 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="px-4 py-12 bg-gradient-to-b from-white to-slate-50/80 scroll-animate">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10 tracking-tight">
            Ce que disent nos garagistes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card card-lift"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
                  &ldquo;{avis}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    {nom[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{nom}</p>
                    <p className="text-xs text-slate-400">{garage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-12 bg-slate-50 scroll-animate">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10 tracking-tight">
            Questions fréquentes
          </h2>
          <div className="flex flex-col gap-3">
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
                className="group rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-md"
              >
                <summary className="flex items-center justify-between font-semibold text-slate-900 text-sm list-none px-5 py-4">
                  <span>{q}</span>
                  <span className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 font-bold text-base ml-3 flex-shrink-0 group-open:bg-orange-500 group-open:text-white group-open:border-orange-500 transition-all duration-200">
                    <span className="group-open:rotate-45 transition-transform duration-200 inline-block leading-none">+</span>
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-4 py-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center scroll-animate relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-5 shadow-glow-orange">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight">
            Besoin d&apos;une pièce maintenant?
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Commandez en ligne ou appelez-nous directement. On s&apos;occupe du reste.
          </p>
          <a
            href="tel:+15147544607"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 rounded-full shadow-glow-orange transition-all duration-250 text-lg active:scale-95"
          >
            <Phone className="w-5 h-5 fill-current" />
            514-754-4607
          </a>
        </div>
      </section>
    </div>
  );
}
