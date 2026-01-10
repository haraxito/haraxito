// Marques populaires en Amérique du Nord (Canada/Québec)
export const MARQUES_POPULAIRES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia",
  "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi",
  "Nissan", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo",
  "Autre"
] as const;

export type Marque = typeof MARQUES_POPULAIRES[number];

// Générer les années (appelé côté serveur)
export function getYearsArray(count: number = 30): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
}

// Types pour le formulaire
export type TypeService = "DOMICILE" | "ATELIER";
export type DamageType = "crack" | "chip" | "shattered";

export type FormValues = {
  adresse_intervention?: string;
  marque: string;
  marque_autre?: string;
  modele: string;
  annee: string;
  assurance?: string;
  client_nom: string;
  client_telephone: string;
  client_email?: string;
  date_souhaitee: string;
  message?: string;
};
