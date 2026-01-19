"use client";

import { useEffect, useState } from "react";

interface UseGoogleMapsLoaderReturn {
  isLoaded: boolean;
  loadError: Error | null;
}

let isScriptLoaded = false;
let isScriptLoading = false;
let loadPromise: Promise<void> | null = null;

export function useGoogleMapsLoader(): UseGoogleMapsLoaderReturn {
  const [isLoaded, setIsLoaded] = useState(isScriptLoaded);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (isScriptLoaded) {
      setIsLoaded(true);
      return;
    }

    if (isScriptLoading && loadPromise) {
      loadPromise
        .then(() => setIsLoaded(true))
        .catch((err) => setLoadError(err));
      return;
    }

    isScriptLoading = true;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setLoadError(new Error("Google Maps API key not configured"));
      return;
    }

    loadPromise = new Promise<void>((resolve, reject) => {
      if (window.google?.maps?.places) {
        isScriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=fr&region=CA`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        isScriptLoaded = true;
        isScriptLoading = false;
        resolve();
      };

      script.onerror = () => {
        isScriptLoading = false;
        reject(new Error("Failed to load Google Maps script"));
      };

      document.head.appendChild(script);
    });

    loadPromise
      .then(() => setIsLoaded(true))
      .catch((err) => setLoadError(err));
  }, []);

  return { isLoaded, loadError };
}
