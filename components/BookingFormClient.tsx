"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import AddressAutocomplete from "./AddressAutocomplete";
import {
  Building2,
  Truck,
  Calendar,
  Phone,
  Mail,
  User,
  ChevronRight,
  ChevronLeft,
  CircleDot,
  Sparkles,
  Zap,
  MapPin,
  Car,
  Check,
} from "lucide-react";
import type { FormValues, TypeService, DamageType } from "@/lib/constants";
import type { ParsedAddress } from "@/types/google-maps";

type BookingFormClientProps = {
  marques: readonly string[];
  years: number[];
  minDate: string;
};

export default function BookingFormClient({ marques, years, minDate }: BookingFormClientProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm<FormValues>();
  const [currentStep, setCurrentStep] = useState(1);
  const [typeService, setTypeService] = useState<TypeService>("DOMICILE");
  const [damageType, setDamageType] = useState<DamageType>("crack");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [parsedAddress, setParsedAddress] = useState<ParsedAddress | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);

  const totalSteps = 5;

  // Watch if "Autre" is selected
  const marqueValue = watch("marque");
  const anneeValue = watch("annee");
  const modeleValue = watch("modele");

  // Navigation handlers
  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    // Validate current step fields
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["annee", "marque", "modele"];
        if (marqueValue === "Autre") {
          fieldsToValidate.push("marque_autre");
        }
        break;
      case 2:
        // Damage type validation (always selected)
        break;
      case 3:
        if (typeService === "DOMICILE") {
          fieldsToValidate = ["adresse_intervention"];
          // Vérifier que l'adresse a été sélectionnée depuis l'autocomplete
          if (!isAddressValid) {
            setMessage({
              type: "error",
              text: "Veuillez sélectionner une adresse dans la liste déroulante Google Maps",
            });
            return;
          }
        }
        break;
      case 4:
        fieldsToValidate = ["client_nom", "client_telephone"];
        break;
      case 5:
        fieldsToValidate = ["date_souhaitee"];
        break;
    }

    // Effacer le message d'erreur si on passe à l'étape suivante
    setMessage(null);

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      // Validation finale: pour le service à domicile, vérifier qu'une adresse Google valide a été sélectionnée
      if (typeService === "DOMICILE" && !isAddressValid) {
        setMessage({
          type: "error",
          text: "Veuillez sélectionner une adresse valide dans la liste déroulante Google Maps",
        });
        setLoading(false);
        return;
      }

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
          adresseDetails: typeService === "DOMICILE" && parsedAddress ? {
            ville: parsedAddress.city,
            province: parsedAddress.province,
            codePostal: parsedAddress.postalCode,
            latitude: parsedAddress.latitude,
            longitude: parsedAddress.longitude,
            placeId: parsedAddress.placeId,
          } : null,
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

      // Redirect to confirmation page with booking details
      const vehiculeDisplay = `${marque} ${values.modele} ${values.annee}`;
      const params = new URLSearchParams({
        nom: values.client_nom,
        adresse: typeService === "DOMICILE" ? (values.adresse_intervention || "") : "",
        date: values.date_souhaitee,
        type: typeService,
        vehicule: vehiculeDisplay,
      });

      router.push(`/confirmation?${params.toString()}`);
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
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-600">
            Étape {currentStep} sur {totalSteps}
          </span>
          <span className="text-xs text-slate-500">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Success/Error Message */}
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

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Vehicle Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Informations sur votre véhicule
              </h3>
              <p className="text-sm text-slate-500">
                Commençons par identifier votre véhicule
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Année du véhicule *
                </label>
                <select
                  className="input-field !mb-0"
                  {...register("annee", { required: "L'année est requise" })}
                >
                  <option value="">Sélectionnez l'année</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.annee && (
                  <p className="text-red-600 text-xs mt-1">{errors.annee.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Marque *
                </label>
                <select
                  className="input-field !mb-0"
                  {...register("marque", { required: "La marque est requise" })}
                >
                  <option value="">Sélectionnez la marque</option>
                  {marques.map((marque) => (
                    <option key={marque} value={marque}>
                      {marque}
                    </option>
                  ))}
                </select>
                {errors.marque && (
                  <p className="text-red-600 text-xs mt-1">{errors.marque.message}</p>
                )}
              </div>

              {marqueValue === "Autre" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Précisez la marque *
                  </label>
                  <input
                    className="input-field !mb-0"
                    placeholder="Ex: Tesla, Rivian..."
                    type="text"
                    autoComplete="off"
                    {...register("marque_autre", {
                      required: marqueValue === "Autre" ? "Précisez la marque" : false
                    })}
                  />
                  {errors.marque_autre && (
                    <p className="text-red-600 text-xs mt-1">{errors.marque_autre.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Modèle *
                </label>
                <input
                  className="input-field !mb-0"
                  placeholder="Ex: Civic, Corolla, F-150..."
                  type="text"
                  autoComplete="off"
                  {...register("modele", { required: "Le modèle est requis" })}
                />
                {errors.modele && (
                  <p className="text-red-600 text-xs mt-1">{errors.modele.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Compagnie d'assurance
                  <span className="text-slate-400 ml-1">(optionnel)</span>
                </label>
                <input
                  className="input-field !mb-0"
                  placeholder="Ex: Desjardins, Intact..."
                  type="text"
                  autoComplete="off"
                  {...register("assurance")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Damage Type */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Type de dommage
              </h3>
              <p className="text-sm text-slate-500">
                Quel type de dommage avez-vous?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setDamageType("chip")}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  damageType === "chip"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    damageType === "chip"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <CircleDot className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-1">
                    Éclat (Chip)
                  </div>
                  <div className="text-sm text-slate-500">
                    Petit impact circulaire, généralement réparable
                  </div>
                </div>
                {damageType === "chip" && (
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setDamageType("crack")}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  damageType === "crack"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    damageType === "crack"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Zap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-1">
                    Fissure (Crack)
                  </div>
                  <div className="text-sm text-slate-500">
                    Ligne de fissure, peut nécessiter un remplacement
                  </div>
                </div>
                {damageType === "crack" && (
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setDamageType("shattered")}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  damageType === "shattered"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    damageType === "shattered"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-1">
                    Brisé (Shattered)
                  </div>
                  <div className="text-sm text-slate-500">
                    Pare-brise fortement endommagé, remplacement nécessaire
                  </div>
                </div>
                {damageType === "shattered" && (
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Service Location */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Lieu d'intervention
              </h3>
              <p className="text-sm text-slate-500">
                Où souhaitez-vous le service?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  typeService === "DOMICILE"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                onClick={() => setTypeService("DOMICILE")}
              >
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    typeService === "DOMICILE"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Truck className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-1">
                    Service Mobile
                  </div>
                  <div className="text-sm text-slate-500">
                    Nous venons à votre domicile, bureau ou autre lieu
                  </div>
                </div>
                {typeService === "DOMICILE" && (
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                )}
              </button>

              <button
                type="button"
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  typeService === "ATELIER"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                onClick={() => setTypeService("ATELIER")}
              >
                <div
                  className={`p-3 rounded-lg shrink-0 ${
                    typeService === "ATELIER"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base mb-1">
                    À l'Atelier
                  </div>
                  <div className="text-sm text-slate-500">
                    Vous venez à notre atelier à Montréal
                  </div>
                </div>
                {typeService === "ATELIER" && (
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                )}
              </button>
            </div>

            {typeService === "DOMICILE" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse complète *
                </label>
                <Controller
                  name="adresse_intervention"
                  control={control}
                  rules={{
                    required: typeService === "DOMICILE"
                      ? "L'adresse est requise pour le service mobile"
                      : false,
                  }}
                  render={({ field }) => (
                    <AddressAutocomplete
                      value={field.value || ""}
                      onChange={(address, parsed) => {
                        field.onChange(address);
                        if (parsed) {
                          setParsedAddress(parsed);
                        } else {
                          // Si pas de parsed, invalider l'adresse
                          setParsedAddress(null);
                        }
                      }}
                      onBlur={field.onBlur}
                      onValidationChange={(isValid) => {
                        setIsAddressValid(isValid);
                        // Effacer le message d'erreur si l'adresse devient valide
                        if (isValid && message?.text.includes("adresse")) {
                          setMessage(null);
                        }
                      }}
                      error={errors.adresse_intervention?.message}
                    />
                  )}
                />
              </div>
            )}

            {typeService === "ATELIER" && (
              <div className="mt-4 w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col gap-2">
                  <h2 className="text-slate-700 font-bold text-lg leading-tight">
                    Notre adresse
                  </h2>
                  <p className="text-slate-600 text-base font-normal">
                    1195 Rue de Royan, Laval, QC H7N 6E7
                  </p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <span>Lun-Ven: 8h-17h</span>
                    <span className="w-[1px] h-3 bg-slate-300"></span>
                    <span>Sam: 9h-13h</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Contact Information */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Vos coordonnées
              </h3>
              <p className="text-sm text-slate-500">
                Comment pouvons-nous vous contacter?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="input-field pl-10 !mb-0"
                    placeholder="Jean Dupont"
                    type="text"
                    autoComplete="name"
                    {...register("client_nom", { required: "Le nom est requis" })}
                  />
                </div>
                {errors.client_nom && (
                  <p className="text-red-600 text-xs mt-1">{errors.client_nom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Numéro de téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="input-field pl-10 !mb-0"
                    placeholder="514-555-1234"
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
                </div>
                {errors.client_telephone && (
                  <p className="text-red-600 text-xs mt-1">{errors.client_telephone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                  <span className="text-slate-400 ml-1">(optionnel)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="input-field pl-10 !mb-0"
                    placeholder="jean@exemple.com"
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
                </div>
                {errors.client_email && (
                  <p className="text-red-600 text-xs mt-1">{errors.client_email.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Date and Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Date préférée
              </h3>
              <p className="text-sm text-slate-500">
                Quand souhaitez-vous le service?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date souhaitée *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    className="input-field pl-10 !mb-0"
                    type="date"
                    min={minDate}
                    {...register("date_souhaitee", { required: "La date est requise" })}
                  />
                </div>
                {errors.date_souhaitee && (
                  <p className="text-red-600 text-xs mt-1">{errors.date_souhaitee.message}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  💡 Nous vous contacterons pour confirmer la disponibilité
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message supplémentaire
                  <span className="text-slate-400 ml-1">(optionnel)</span>
                </label>
                <textarea
                  className="input-field min-h-[100px] resize-none !mb-0"
                  placeholder="Ajoutez des détails ou des instructions spéciales..."
                  {...register("message")}
                />
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-slate-700 mb-3">Résumé</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Véhicule:</span>
                    <span className="font-medium text-slate-900">
                      {anneeValue} {marqueValue === "Autre" ? watch("marque_autre") : marqueValue} {modeleValue}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dommage:</span>
                    <span className="font-medium text-slate-900">
                      {damageType === "chip" ? "Éclat" : damageType === "crack" ? "Fissure" : "Brisé"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-medium text-slate-900">
                      {typeService === "DOMICILE" ? "Mobile" : "Atelier"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 h-12 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={currentStep === 3 && typeService === "DOMICILE" && !isAddressValid}
              className={`flex-1 h-12 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                currentStep === 3 && typeService === "DOMICILE" && !isAddressValid
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              Suivant
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 h-12 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                "Envoi en cours..."
              ) : (
                <>
                  Confirmer le rendez-vous
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {currentStep === totalSteps && (
          <p className="text-center text-xs text-slate-400 mt-3">
            En cliquant, vous acceptez nos conditions d&apos;utilisation
          </p>
        )}
      </form>
    </div>
  );
}
