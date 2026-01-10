import BookingFormClient from "./BookingFormClient";
import { MARQUES_POPULAIRES, getYearsArray } from "@/lib/constants";

// Server Component - Pre-calcule les données côté serveur
export default function BookingForm() {
  // Généré côté serveur lors du build/render
  const years = getYearsArray(30);
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <BookingFormClient
      marques={MARQUES_POPULAIRES}
      years={years}
      minDate={minDate}
    />
  );
}
