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
    <div className="w-full bg-slate-100 rounded-lg overflow-hidden my-4">
      <AdBanner adSlot={adSlot} adFormat="horizontal" />
    </div>
  );
}

// Composant pour pub carrée/rectangle (sidebar)
export function AdBannerSquare({ adSlot }: { adSlot: string }) {
  return (
    <div className="bg-slate-100 rounded-lg overflow-hidden">
      <AdBanner adSlot={adSlot} adFormat="rectangle" fullWidth={false} />
    </div>
  );
}
