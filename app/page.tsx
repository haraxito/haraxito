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
      <section className="relative pt-4 pb-8 px-5 bg-gradient-to-b from-white to-transparent">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>

        <h1 className="text-slate-900 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-3">
          Remplacement de <br />
          <span className="text-primary">Pare-Brise Rapide</span>
        </h1>
        <p className="text-slate-600 text-lg font-medium leading-relaxed mb-6">
          On se déplace chez vous. Prenez rendez-vous gratuitement en quelques
          minutes.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 mb-2">
          <div className="trust-badge">
            <Shield className="w-4 h-4" />
            Garantie à vie
          </div>
          <div className="trust-badge">
            <Wrench className="w-4 h-4" />
            Techniciens certifiés
          </div>
        </div>
      </section>

      {/* Quote Form Card */}
      <section className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-slate-800 font-bold text-lg">
              Rendez-vous gratuit
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              Sans engagement
            </span>
          </div>
          <div className="p-5">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Ad Banner - After Form */}
      <section className="px-4 mt-6">
        <AdBannerNative adSlot="2222222222" />
      </section>

      {/* Trust Indicators Section */}
      <section className="mt-6 px-5">
        <h3 className="text-slate-800 font-bold text-lg mb-4 text-center">
          Pourquoi choisir AutoGlass Pro?
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Trust Item 1 */}
          <div className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h4 className="text-slate-900 font-bold text-sm">
                Approuvé par les assurances
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                On s'occupe de la paperasse pour vous
              </p>
            </div>
          </div>

          {/* In-Feed Ad - Between Trust Items */}
          <AdBannerInFeed adSlot="3333333333" />

          {/* Trust Item 2 */}
          <div className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h4 className="text-slate-900 font-bold text-sm">
                Techniciens certifiés
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                Personnel hautement qualifié
              </p>
            </div>
          </div>

          {/* Trust Item 3 */}
          <div className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h4 className="text-slate-900 font-bold text-sm">
                Garantie à vie
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                Qualité de travail garantie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interstitial Ad - Between Sections */}
      <AdBannerInterstitial adSlot="4444444444" />

      {/* Services Section - NEW */}
      <section className="px-5">
        <h3 className="text-slate-800 font-bold text-lg mb-4 text-center">
          Nos Services
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold text-xs">Remplacement</h4>
            <p className="text-slate-500 text-[10px] mt-1">
              Pare-brise complet
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-2">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold text-xs">Réparation</h4>
            <p className="text-slate-500 text-[10px] mt-1">
              Éclats et fissures
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold text-xs">Service rapide</h4>
            <p className="text-slate-500 text-[10px] mt-1">En 1 heure</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold text-xs">À domicile</h4>
            <p className="text-slate-500 text-[10px] mt-1">On se déplace</p>
          </div>
        </div>
      </section>

      {/* In-Feed Ad */}
      <section className="px-5 mt-4">
        <AdBannerInFeed adSlot="5555555555" />
      </section>

      {/* Testimonials Section - NEW */}
      <section className="mt-4 px-5">
        <h3 className="text-slate-800 font-bold text-lg mb-4 text-center">
          Avis de nos clients
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-600 text-sm">
              "Service impeccable! Le technicien est venu chez moi et a remplacé
              mon pare-brise en moins d'une heure."
            </p>
            <p className="text-slate-400 text-xs mt-2">- Marie L., Montréal</p>
          </div>

          {/* In-Feed Ad - Between Testimonials */}
          <AdBannerInFeed adSlot="6666666666" />

          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-600 text-sm">
              "Excellent rapport qualité-prix. L'assurance a tout couvert!"
            </p>
            <p className="text-slate-400 text-xs mt-2">- Jean P., Laval</p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="mt-8 px-5">
        <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-slate-700 to-slate-900">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <MapPin className="w-8 h-8 text-white mb-2" />
            <h4 className="text-white font-bold text-lg">
              Service dans votre région
            </h4>
            <p className="text-slate-200 text-sm">
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
      <section className="mt-4 px-5">
        <h3 className="text-slate-800 font-bold text-lg mb-4 text-center">
          Questions fréquentes
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-slate-900 font-bold text-sm">
              Combien coûte un remplacement?
            </h4>
            <p className="text-slate-500 text-xs mt-1">
              Souvent couvert à 100% par votre assurance sans franchise.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-slate-900 font-bold text-sm">
              Combien de temps ça prend?
            </h4>
            <p className="text-slate-500 text-xs mt-1">
              En général, 45 minutes à 1 heure pour un remplacement complet.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-slate-900 font-bold text-sm">
              Vous vous déplacez où?
            </h4>
            <p className="text-slate-500 text-xs mt-1">
              Partout dans la grande région de Montréal et environs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section with Ad */}
      <section className="mt-8 px-5">
        <div className="bg-primary rounded-2xl p-6 text-center">
          <Phone className="w-10 h-10 text-white mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-2">
            Besoin d'aide immédiate?
          </h3>
          <p className="text-blue-100 text-sm mb-4">Appelez-nous maintenant</p>
          <a
            href="tel:+15141234567"
            className="inline-block bg-white text-primary font-bold py-3 px-6 rounded-xl"
          >
            514-123-4567
          </a>
        </div>
      </section>

      {/* Bottom Ad Banner */}
      <section className="mt-8 px-5">
        <AdBannerHorizontal adSlot="8888888888" />
      </section>

      {/* Native Ad - Bottom */}
      <section className="px-5 mb-20">
        <AdBannerNative adSlot="9999999999" />
      </section>

      {/* Sticky Ad - Fixed at Bottom */}
      <AdBannerSticky adSlot="1010101010" />
    </>
  );
}
