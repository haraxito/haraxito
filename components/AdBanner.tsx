"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  fullWidth?: boolean;
  className?: string;
}

export default function AdBanner({
  adSlot,
  adFormat = "auto",
  fullWidth = true,
  className = "",
}: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`ad-container my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidth ? "true" : "false"}
      />
    </div>
  );
}

// Composant pour bannière horizontale (header/footer)
export function AdBannerHorizontal({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg overflow-hidden my-4 p-1">
      <AdBanner adSlot={adSlot} adFormat="horizontal" />
    </div>
  );
}

// Composant pour pub carrée/rectangle (sidebar)
export function AdBannerSquare({ adSlot }: { adSlot: string }) {
  return (
    <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
      <AdBanner adSlot={adSlot} adFormat="rectangle" fullWidth={false} />
    </div>
  );
}

// Bannière In-Feed (entre les éléments de liste)
export function AdBannerInFeed({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden my-4 p-3">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
        Publicité
      </p>
      <AdBanner adSlot={adSlot} adFormat="fluid" />
    </div>
  );
}

// Bannière Native/Article (style article sponsorisé)
export function AdBannerNative({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100 overflow-hidden my-6 p-4">
      <p className="text-[10px] text-blue-400 uppercase tracking-wider font-medium mb-2">
        Contenu sponsorisé
      </p>
      <AdBanner adSlot={adSlot} adFormat="fluid" />
    </div>
  );
}

// Bannière Sticky (fixée en bas de l'écran)
export function AdBannerSticky({ adSlot }: { adSlot: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg p-2 safe-area-inset-bottom">
      <div className="max-w-lg mx-auto">
        <AdBanner adSlot={adSlot} adFormat="horizontal" className="my-0" />
      </div>
    </div>
  );
}

// Bannière Interstitiel (entre sections)
export function AdBannerInterstitial({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full bg-gradient-to-r from-primary/5 via-white to-primary/5 py-6 px-4 my-8">
      <div className="max-w-md mx-auto">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider text-center mb-2">
          Nos partenaires
        </p>
        <AdBanner adSlot={adSlot} adFormat="auto" />
      </div>
    </div>
  );
}

// Bannière verticale (sidebar mobile)
export function AdBannerVertical({ adSlot }: { adSlot: string }) {
  return (
    <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100 p-2">
      <AdBanner adSlot={adSlot} adFormat="vertical" fullWidth={false} />
    </div>
  );
}

// Bannière Multiplex (grille de pubs)
export function AdBannerMultiplex({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full bg-slate-50 rounded-xl border border-slate-100 overflow-hidden my-6 p-4">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-3">
        Vous pourriez aimer
      </p>
      <AdBanner adSlot={adSlot} adFormat="auto" />
    </div>
  );
}

// Bannière après formulaire (post-conversion)
export function AdBannerPostForm({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full bg-emerald-50 rounded-xl border border-emerald-100 overflow-hidden mt-6 p-4">
      <p className="text-[10px] text-emerald-500 uppercase tracking-wider mb-2">
        En attendant votre confirmation
      </p>
      <AdBanner adSlot={adSlot} adFormat="auto" />
    </div>
  );
}
