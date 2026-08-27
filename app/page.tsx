import BookingForm from "@/components/BookingForm";
import AdBanner, {
  AdBannerHorizontal,
  AdBannerInFeed,
  AdBannerNative,
  AdBannerInterstitial,
  AdBannerMultiplex,
  AdBannerSticky,
} from "@/components/AdBanner";
import {
  Shield,
  Wrench,
  Award,
  MapPin,
  Clock,
  Phone,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Top Banner Ad - Above Hero */}
      {/* <section className="px-4 pt-2">
        <AdBannerHorizontal adSlot="1111111111" />
      </section> */}

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-5 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-primary/20 via-blue-400/10 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gradient-to-tr from-emerald-400/10 via-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>

        <h1 className="animate-fade-in-up text-slate-900 text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 relative">
          Remplacement de <br />
          <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent animate-gradient">
            Pare-Brise Rapide
          </span>
        </h1>
        <p className="animate-fade-in-up delay-200 text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-8 max-w-lg">
          On se déplace chez vous. Prenez rendez-vous gratuitement en quelques
          minutes.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-primary/5 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-primary text-sm font-bold">Garantie à vie</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-emerald-500/5 rounded-full border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Wrench className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-emerald-700 text-sm font-bold">Techniciens certifiés</span>
          </div>
        </div>
      </section>

      {/* Quote Form Card */}
      <section className="px-4 -mt-4">
        <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-slate-100 overflow-hidden relative">
          {/* Decorative gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

          {/* Card Header */}
          <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-slate-800 font-black text-xl">
              Rendez-vous gratuit
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 rounded-full shadow-sm border border-emerald-200">
              Sans engagement
            </span>
          </div>
          <div className="p-6">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Ad Banner - After Form */}
      <section className="px-4 mt-6">
        <AdBannerNative adSlot="2222222222" />
      </section>

      {/* Trust Indicators Section */}
      <section className="mt-8 px-5">
        <h3 className="text-slate-800 font-black text-2xl mb-6 text-center">
          Pourquoi choisir Parebrise Instant?
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Trust Item 1 */}
          <div className="scroll-animate group flex items-center p-5 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <div className="ml-4">
              <h4 className="text-slate-900 font-bold text-base">
                Approuvé par les assurances
              </h4>
              <p className="text-slate-600 text-sm mt-1">
                On s'occupe de la paperasse pour vous
              </p>
            </div>
          </div>

          {/* In-Feed Ad - Between Trust Items */}
          <AdBannerInFeed adSlot="3333333333" />

          {/* Trust Item 2 */}
          <div className="scroll-animate group flex items-center p-5 bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl border border-emerald-100 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Wrench className="w-7 h-7" />
            </div>
            <div className="ml-4">
              <h4 className="text-slate-900 font-bold text-base">
                Techniciens certifiés
              </h4>
              <p className="text-slate-600 text-sm mt-1">
                Personnel hautement qualifié
              </p>
            </div>
          </div>

          {/* Trust Item 3 */}
          <div className="scroll-animate group flex items-center p-5 bg-gradient-to-br from-white to-amber-50/30 rounded-2xl border border-amber-100 shadow-lg shadow-amber-100/50 hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>
            <div className="ml-4">
              <h4 className="text-slate-900 font-bold text-base">
                Garantie à vie
              </h4>
              <p className="text-slate-600 text-sm mt-1">
                Qualité de travail garantie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interstitial Ad - Between Sections */}
      <AdBannerInterstitial adSlot="4444444444" />

      {/* Services Section - NEW */}
      <section className="mt-8 px-5">
        <h3 className="text-slate-800 font-black text-2xl mb-6 text-center">
          Nos Services
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="scroll-animate group p-5 bg-gradient-to-br from-white to-blue-50/40 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Remplacement</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Pare-brise complet
            </p>
          </div>
          <div className="scroll-animate group p-5 bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Wrench className="w-7 h-7" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Réparation</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Éclats et fissures
            </p>
          </div>
          <div className="scroll-animate group p-5 bg-gradient-to-br from-white to-amber-50/40 rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Service rapide</h4>
            <p className="text-slate-600 text-xs leading-relaxed">En 1 heure</p>
          </div>
          <div className="scroll-animate group p-5 bg-gradient-to-br from-white to-purple-50/40 rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:-translate-y-1 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">À domicile</h4>
            <p className="text-slate-600 text-xs leading-relaxed">On se déplace</p>
          </div>
        </div>
      </section>

      {/* In-Feed Ad */}
      <section className="px-5 mt-4">
        <AdBannerInFeed adSlot="5555555555" />
      </section>

      {/* Testimonials Section - NEW */}
      <section className="mt-8 px-5">
        <h3 className="text-slate-800 font-black text-2xl mb-6 text-center">
          Avis de nos clients
        </h3>
        <div className="space-y-4">
          <div className="scroll-animate relative p-6 bg-gradient-to-br from-white via-amber-50/30 to-white rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <div className="flex items-center gap-1 mb-3 ml-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm"
                />
              ))}
            </div>
            <p className="text-slate-700 text-base leading-relaxed font-medium italic">
              "Service impeccable! Le technicien est venu chez moi et a remplacé
              mon pare-brise en moins d'une heure."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                ML
              </div>
              <p className="text-slate-500 text-sm font-semibold">Marie L., Montréal</p>
            </div>
          </div>

          {/* In-Feed Ad - Between Testimonials */}
          <AdBannerInFeed adSlot="6666666666" />

          <div className="scroll-animate relative p-6 bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            <div className="flex items-center gap-1 mb-3 ml-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm"
                />
              ))}
            </div>
            <p className="text-slate-700 text-base leading-relaxed font-medium italic">
              "Excellent rapport qualité-prix. L'assurance a tout couvert!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                JP
              </div>
              <p className="text-slate-500 text-sm font-semibold">Jean P., Laval</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="mt-8 px-5">
        <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px"}}></div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 shadow-xl">
              <MapPin className="w-9 h-9 text-white drop-shadow-lg" />
            </div>
            <h4 className="text-white font-black text-2xl mb-2 drop-shadow-lg">
              Service dans votre région
            </h4>
            <p className="text-slate-200 text-base max-w-sm drop-shadow-md">
              Nous offrons un service mobile à votre emplacement.
            </p>
          </div>
        </div>
      </section>

      {/* Multiplex Ad - Related Content Style */}
      <section className="px-5">
        <AdBannerMultiplex adSlot="7777777777" />
      </section>

      {/* FAQ Section - NEW */}
      <section className="mt-8 px-5">
        <h3 className="text-slate-800 font-black text-2xl mb-6 text-center">
          Questions fréquentes
        </h3>
        <div className="space-y-4">
          <div className="scroll-animate group p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-primary/30 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md group-hover:scale-110 transition-transform">
                ?
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-2">
                  Combien coûte un remplacement?
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Souvent couvert à 100% par votre assurance sans franchise.
                </p>
              </div>
            </div>
          </div>
          <div className="scroll-animate group p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-500/30 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md group-hover:scale-110 transition-transform">
                ?
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-2">
                  Combien de temps ça prend?
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  En général, 45 minutes à 1 heure pour un remplacement complet.
                </p>
              </div>
            </div>
          </div>
          <div className="scroll-animate group p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-purple-500/30 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md group-hover:scale-110 transition-transform">
                ?
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-base mb-2">
                  Vous vous déplacez où?
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Partout dans la grande région de Montréal et environs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Ad */}
      <section className="mt-8 px-5">
        <div className="relative bg-gradient-to-br from-primary via-blue-600 to-primary rounded-3xl p-8 text-center overflow-hidden shadow-2xl shadow-primary/30">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px"}}></div>
          </div>

          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <Phone className="w-9 h-9 text-white drop-shadow-lg" />
            </div>
            <h3 className="text-white font-black text-2xl mb-2 drop-shadow-lg">
              Besoin d'aide immédiate?
            </h3>
            <p className="text-blue-100 text-base mb-6 drop-shadow-md">Appelez-nous maintenant</p>
            <a
              href="tel:+15147544607"
              className="inline-flex items-center gap-2 bg-white text-primary font-black py-4 px-8 rounded-2xl hover:bg-slate-50 transition-all shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-105 transform duration-200"
            >
              <Phone className="w-5 h-5 fill-current" />
              514-754-4607
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Ad Banner */}
      <section className="mt-8 px-5">
        <AdBannerHorizontal adSlot="8888888888" />
      </section>

      {/* Native Ad - Bottom */}
      <section className="px-5 mb-8">
        <AdBannerNative adSlot="9999999999" />
      </section>
    </>
  );
}
