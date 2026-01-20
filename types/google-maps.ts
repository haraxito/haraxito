export interface ParsedAddress {
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  placeName?: string;
}

export interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, parsedAddress?: ParsedAddress) => void;
  onBlur?: () => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}
