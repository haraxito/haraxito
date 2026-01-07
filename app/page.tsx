import BookingForm from "@/components/BookingForm";
import AdBanner from "@/components/AdBanner";
import { Shield, Wrench, Award, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-5 bg-gradient-to-b from-white to-transparent">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>

        <h1 className="text-slate-900 text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-3">
          Remplacement de <br />
          <span className="text-primary">Pare-Brise Rapide</span>
        </h1>
        <p className="text-slate-600 text-lg font-medium leading-relaxed mb-6">
          On se déplace chez vous. Obtenez une soumission gratuite en quelques
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
              Soumission gratuite
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

      {/* Trust Indicators Section */}
      <section className="mt-10 px-5">
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

      {/* Ad Banner - Bottom of page */}
      <section className="mt-8 px-5">
        <AdBanner adSlot="1234567890" adFormat="horizontal" />
      </section>
    </>
  );
}
