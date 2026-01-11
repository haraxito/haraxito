"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  Truck,
  Calendar,
  Phone,
  Mail,
  User,
  ChevronRight,
  CircleDot,
  Sparkles,
  Zap,
  MapPin,
} from "lucide-react";
import type { FormValues, TypeService, DamageType } from "@/lib/constants";

type BookingFormClientProps = {
  marques: readonly string[];
  years: number[];
  minDate: string;
};

export default function BookingFormClient({ marques, years, minDate }: BookingFormClientProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const [typeService, setTypeService] = useState<TypeService>("DOMICILE");
  const [damageType, setDamageType] = useState<DamageType>("crack");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Watch if "Autre" is selected
  const marqueValue = watch("marque");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      // Si "Autre" est sélectionné, utiliser marque_autre
      const marque = values.marque === "Autre" ? values.marque_autre : values.marque;

      const vehicule_infos =
        `${marque} ${values.modele} ${values.annee}` +
        (values.assurance ? ` | Assurance: ${values.assurance}` : "") +
        ` | Dommage: ${damageType}`;

      // Call API route that handles both database and email
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: values.client_nom,
          email: values.client_email || "",
          telephone: values.client_telephone,
          vehicule: vehicule_infos,
          typeService: typeService,
          adresse:
            typeService === "DOMICILE" ? values.adresse_intervention : null,
          message: values.message || null,
          damageType: damageType,
          preferredDate: values.date_souhaitee,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.details || "Une erreur est survenue"
        );
      }

      setMessage({
        type: "success",
        text: "✓ Votre demande a été enregistrée ! Un email de confirmation vous a été envoyé.",
      });
      reset();
      setTypeService("DOMICILE");
      setDamageType("crack");
    } catch (err: any) {
      console.error("Form submission error:", err);
      setMessage({
        type: "error",
        text: err?.message ?? "Une erreur est survenue. Réessayez plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Step 1: Contact Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            1
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Informations de contact
          </h4>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="input-field pl-10 !mb-0"
              placeholder="Nom complet *"
              type="text"
              {...register("client_nom", { required: "Le nom est requis" })}
            />
            {errors.client_nom && (
              <p className="text-red-600 text-xs mt-1 !mb-2">
                {errors.client_nom.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="input-field pl-10 !mb-0"
                placeholder="Téléphone *"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                {...register("client_telephone", {
                  required: "Le téléphone est requis",
                  pattern: {
                    value: /^[\d\s\-\+\(\)]+$/,
                    message: "Numéro de téléphone invalide"
                  }
                })}
              />
              {errors.client_telephone && (
                <p className="text-red-600 text-xs mt-1 !mb-2">
                  {errors.client_telephone.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="input-field pl-10 !mb-0"
                placeholder="Email (optionnel)"
                type="email"
                inputMode="email"
                autoComplete="email"
                {...register("client_email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Format d'email invalide"
                  }
                })}
              />
              {errors.client_email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.client_email.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Step 2: Vehicle Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            2
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Détails du véhicule
          </h4>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select
              className="input-field !mb-0"
              {...register("annee", { required: "L'année est requise" })}
            >
              <option value="">Année *</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              className="input-field !mb-0"
              {...register("marque", { required: "La marque est requise" })}
            >
              <option value="">Marque *</option>
              {marques.map((marque) => (
                <option key={marque} value={marque}>
                  {marque}
                </option>
              ))}
            </select>
          </div>
          {(errors.annee || errors.marque) && (
            <p className="text-red-600 text-xs -mt-1 mb-2">
              {errors.annee?.message || errors.marque?.message}
            </p>
          )}

          {marqueValue === "Autre" && (
            <input
              className="input-field !mb-0"
              placeholder="Précisez la marque *"
              type="text"
              autoComplete="off"
              {...register("marque_autre", {
                required: marqueValue === "Autre" ? "Précisez la marque" : false
              })}
            />
          )}

          <input
            className="input-field !mb-0"
            placeholder="Modèle (ex: Civic, Corolla) *"
            type="text"
            autoComplete="off"
            {...register("modele", { required: "Le modèle est requis" })}
          />
          {errors.modele && (
            <p className="text-red-600 text-xs -mt-1 mb-2">{errors.modele.message}</p>
          )}

          <input
            className="input-field !mb-0"
            placeholder="Compagnie d'assurance (optionnel)"
            type="text"
            autoComplete="off"
            {...register("assurance")}
          />
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Step 3: Damage & Service Type */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            3
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Type de dommage
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Crack */}
          <button
            type="button"
            onClick={() => setDamageType("crack")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
              damageType === "crack"
                ? "border-primary bg-primary/5 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Fissure</span>
          </button>
          {/* Chip */}
          <button
            type="button"
            onClick={() => setDamageType("chip")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
              damageType === "chip"
                ? "border-primary bg-primary/5 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CircleDot className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Éclat</span>
          </button>
          {/* Shattered */}
          <button
            type="button"
            onClick={() => setDamageType("shattered")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
              damageType === "shattered"
                ? "border-primary bg-primary/5 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Brisé</span>
          </button>
        </div>

        {/* Service Type Cards */}
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Lieu d&apos;intervention
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
              typeService === "DOMICILE"
                ? "border-primary bg-primary/5"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
            onClick={() => setTypeService("DOMICILE")}
          >
            <div
              className={`p-2 rounded-lg ${
                typeService === "DOMICILE"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">
                Service Mobile
              </div>
              <div className="text-xs text-slate-500">On vient à vous</div>
            </div>
          </button>

          <button
            type="button"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
              typeService === "ATELIER"
                ? "border-primary bg-primary/5"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
            onClick={() => setTypeService("ATELIER")}
          >
            <div
              className={`p-2 rounded-lg ${
                typeService === "ATELIER"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">
                À l&apos;Atelier
              </div>
              <div className="text-xs text-slate-500">Vous venez à nous</div>
            </div>
          </button>
        </div>

        {/* Conditional Address */}
        {typeService === "DOMICILE" && (
          <div className="mt-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="input-field pl-10 !mb-0"
                placeholder="Adresse complète de l'intervention *"
                type="text"
                autoComplete="street-address"
                {...register("adresse_intervention", {
                  required:
                    typeService === "DOMICILE"
                      ? "L'adresse est requise pour le service mobile"
                      : false,
                })}
              />
            </div>
            {errors.adresse_intervention && (
              <p className="text-red-600 text-xs mt-1">
                {errors.adresse_intervention.message}
              </p>
            )}
          </div>
        )}

        {typeService === "ATELIER" && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-700">
              <strong>Notre adresse :</strong> 123 Rue du Pare-Brise, Montréal
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Lun-Ven 8h-17h, Sam 9h-13h
            </p>
          </div>
        )}

        {/* Optional Message Field */}
        <div className="mt-3">
          <textarea
            className="input-field min-h-[80px] resize-none"
            placeholder="Message supplémentaire (optionnel)"
            {...register("message")}
          />
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full"></div>

      {/* Step 4: Date */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            4
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Date souhaitée
          </h4>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            className="input-field pl-10 !mb-0"
            type="date"
            min={minDate}
            {...register("date_souhaitee", { required: "La date est requise" })}
          />
          {errors.date_souhaitee && (
            <p className="text-red-600 text-xs mt-1 !mb-2">
              {errors.date_souhaitee.message}
            </p>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          💡 Nous vous contacterons pour confirmer la disponibilité
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* CTA Button */}
      <button
        type="submit"
        className="w-full h-14 btn-emerald text-lg flex items-center justify-center gap-2"
        disabled={loading}
      >
        <span>
          {loading ? "Envoi en cours…" : "Prendre rendez-vous gratuitement"}
        </span>
        {!loading && <ChevronRight className="w-5 h-5" />}
      </button>

      <p className="text-center text-xs text-slate-400">
        En cliquant, vous acceptez nos conditions d&apos;utilisation.
      </p>
    </form>
  );
}
