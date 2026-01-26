"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import type { ParsedAddress, AddressAutocompleteProps } from "@/types/google-maps";

export default function AddressAutocomplete({
  value,
  onChange,
  onBlur,
  onValidationChange,
  placeholder = "123 Rue Exemple, Montréal, QC H1X 1X1",
  error,
  disabled = false,
  className = "",
}: AddressAutocompleteProps) {
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [isValidSelection, setIsValidSelection] = useState(false);
  const lastValidAddressRef = useRef<string>("");

  const parseAddressComponents = useCallback(
    (place: google.maps.places.PlaceResult): ParsedAddress => {
      const components = place.address_components || [];
      const parsed: ParsedAddress = {
        formattedAddress: place.formatted_address || "",
        placeName: place.name,
        placeId: place.place_id,
      };

      if (place.geometry?.location) {
        parsed.latitude = place.geometry.location.lat();
        parsed.longitude = place.geometry.location.lng();
      }

      for (const component of components) {
        const types = component.types;

        if (types.includes("street_number")) {
          parsed.streetNumber = component.long_name;
        }
        if (types.includes("route")) {
          parsed.streetName = component.long_name;
        }
        if (types.includes("locality")) {
          parsed.city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          parsed.province = component.short_name;
        }
        if (types.includes("postal_code")) {
          parsed.postalCode = component.long_name;
        }
        if (types.includes("country")) {
          parsed.country = component.short_name;
        }
      }

      return parsed;
    },
    []
  );

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const montrealBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(45.4, -73.9),
      new google.maps.LatLng(45.7, -73.4)
    );

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "ca" },
      fields: ["address_components", "geometry", "name", "formatted_address", "place_id"],
      bounds: montrealBounds,
      strictBounds: false,
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place && place.formatted_address) {
        const parsedAddress = parseAddressComponents(place);
        setInputValue(place.formatted_address);
        lastValidAddressRef.current = place.formatted_address;
        setIsValidSelection(true);
        onValidationChange?.(true);
        onChange(place.formatted_address, parsedAddress);
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, onChange, parseAddressComponents]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Si l'utilisateur modifie l'adresse après avoir sélectionné une option,
    // invalider la sélection pour forcer une nouvelle sélection
    if (newValue !== lastValidAddressRef.current) {
      setIsValidSelection(false);
      onValidationChange?.(false);
    }

    // NE PAS appeler onChange() ici avec le texte brut de l'utilisateur
    // onChange() sera appelé UNIQUEMENT lors de la sélection d'une adresse depuis Google Places
    // Cela garantit que seules les adresses formatées par Google sont sauvegardées
  };

  if (loadError) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field pl-10 !mb-0 ${className}`}
          autoComplete="street-address"
        />
        <p className="text-amber-600 text-xs mt-1">
          Saisie manuelle (autocomplétion indisponible)
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      {!isLoaded && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
      )}
      {isLoaded && isValidSelection && (
        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
      )}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled || !isLoaded}
        className={`input-field pl-10 pr-10 !mb-0 ${isValidSelection ? "border-emerald-300 focus:border-emerald-500" : ""} ${className}`}
        autoComplete="off"
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {!error && !isValidSelection && inputValue && inputValue.length > 0 && (
        <p className="text-amber-600 text-xs mt-1">
          Sélectionnez une adresse dans la liste déroulante
        </p>
      )}
    </div>
  );
}
