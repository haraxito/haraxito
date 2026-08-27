"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const nom = searchParams.get("nom") || "Client";
  const adresse = searchParams.get("adresse") || "";
  const date = searchParams.get("date") || "";
  const typeService = searchParams.get("type") || "DOMICILE";
  const vehicule = searchParams.get("vehicule") || "";

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date à confirmer";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-CA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate Google Maps URL
  const getMapsUrl = () => {
    if (!adresse) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`;
  };

  // Generate calendar event URL (Google Calendar)
  const getCalendarUrl = () => {
    const title = encodeURIComponent("Remplacement Pare-brise - Parebrise Instant");
    const details = encodeURIComponent(`Service: ${typeService === "DOMICILE" ? "À domicile" : "En atelier"}\nVéhicule: ${vehicule}\nAdresse: ${adresse}`);
    const location = encodeURIComponent(adresse || "Montréal, QC");
    const dateFormatted = date ? date.replace(/-/g, "") : "";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}/${dateFormatted}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between max-w-lg mx-auto">
        <Link href="/" className="text-primary flex size-12 shrink-0 items-center cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12 text-slate-900">
          Confirmation de RDV
        </h2>
      </div>

      {/* Success Message */}
      <div className="flex flex-col items-center justify-center py-6 px-4 max-w-lg mx-auto">
        <div className="bg-emerald-100 rounded-full p-6 mb-4 relative">
          <span className="material-symbols-outlined text-emerald-500 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-center px-4 text-slate-900">
          {typeService === "DOMICILE" ? "Adresse validée !" : "Rendez-vous confirmé !"}
        </h1>
        <p className="text-slate-500 text-sm font-normal leading-relaxed pt-2 px-8 text-center">
          Votre rendez-vous pour le remplacement de pare-brise est confirmé. Nous vous contacterons sous peu.
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="px-4 max-w-lg mx-auto mb-6">
        <div className="flex flex-col items-stretch justify-start rounded-2xl shadow-xl bg-white border border-slate-100 overflow-hidden">

          {/* Address Display */}
          {typeService === "DOMICILE" && adresse && (
            <div className="p-3 bg-white border-b border-slate-100">
              <div className="relative flex items-center bg-slate-50 shadow-sm rounded-lg px-3 py-2.5 border border-slate-200">
                <span className="material-symbols-outlined text-primary text-xl mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
                <input
                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-800 focus:ring-0 cursor-default"
                  readOnly
                  type="text"
                  value={adresse}
                />
              </div>
            </div>
          )}

          {/* Map Preview */}
          {typeService === "DOMICILE" && adresse && (
            <div className="relative w-full aspect-[4/3] bg-slate-200 overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(adresse)}&language=fr`}
              />
            </div>
          )}

          {/* Details */}
          <div className="flex w-full grow flex-col items-stretch justify-center gap-5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded">
                  Prestation
                </span>
                <p className="text-primary text-sm font-bold">Remplacement Pare-brise</p>
              </div>
              <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Confirmé
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Date & Time */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date souhaitée</p>
                  <p className="text-base font-bold leading-tight text-slate-900">{formatDate(date)}</p>
                  <p className="text-slate-600 text-sm font-medium">Horaire à confirmer</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lieu d&apos;intervention</p>
                  <p className="text-base font-bold leading-tight text-slate-900">
                    {typeService === "DOMICILE" ? "À domicile" : "En atelier"}
                  </p>
                  <p className="text-slate-600 text-sm font-medium">
                    {typeService === "DOMICILE" ? adresse : "1195 A Rue de Royan, Laval, QC H7N 6E7"}
                  </p>
                </div>
              </div>

              {/* Vehicle */}
              {vehicule && (
                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
                    <span className="material-symbols-outlined">directions_car</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Véhicule</p>
                    <p className="text-base font-bold leading-tight text-slate-900">{vehicule}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Open in Maps Button */}
            {typeService === "DOMICILE" && adresse && (
              <a
                href={getMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-4 bg-white text-primary text-sm font-bold leading-normal border border-primary/30 hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">directions</span>
                <span className="truncate">Ouvrir dans Maps</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <div className="flex flex-1 gap-3 max-w-lg flex-col items-stretch px-4 py-6">
          <a
            href={getCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide w-full shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined">event</span>
            <span className="truncate">Ajouter au calendrier</span>
          </a>
          <Link
            href="/"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-5 bg-transparent text-slate-900 text-base font-bold leading-normal tracking-wide w-full border-2 border-slate-200 active:bg-slate-100 transition-colors"
          >
            <span className="truncate">Retour à l&apos;accueil</span>
          </Link>
        </div>
      </div>

      {/* Help Link */}
      <div className="pb-8 text-center">
        <a href="tel:+15147544607" className="text-slate-500 text-sm font-bold hover:underline">
          Besoin d&apos;aide ou modifier le RDV ?
        </a>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
