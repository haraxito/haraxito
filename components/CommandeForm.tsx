"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Car,
  Package,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Clock,
  Flame,
} from "lucide-react";

const MARQUES_AUTO = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia",
  "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mini",
  "Mitsubishi", "Nissan", "Pontiac", "Porsche", "Ram", "Subaru", "Tesla",
  "Toyota", "Volkswagen", "Volvo", "Autre",
];

const ANNEES = Array.from({ length: 35 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

const NIVEAUX_URGENCE = [
  {
    id: "critique",
    label: "Critique",
    description: "Client en attente, véhicule immobilisé",
    icon: Flame,
    color: "border-red-500 bg-red-50 text-red-700",
    badge: "bg-red-100 text-red-700",
  },
  {
    id: "urgent",
    label: "Urgent",
    description: "Besoin dans les prochaines heures",
    icon: AlertTriangle,
    color: "border-orange-500 bg-orange-50 text-orange-700",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: "normal",
    label: "Normal",
    description: "Avant la fin de la journée",
    icon: Clock,
    color: "border-blue-400 bg-blue-50 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
];

type FormData = {
  garage_nom: string;
  garage_telephone: string;
  garage_email: string;
  garage_adresse: string;
  garage_ville: string;
  garage_code_postal: string;
  vehicule_annee: string;
  vehicule_marque: string;
  vehicule_modele: string;
  vehicule_vin: string;
  pieces_demandees: string;
  pieces_numero_oem: string;
  quantite: string;
  urgence: string;
  notes: string;
};

const initialForm: FormData = {
  garage_nom: "",
  garage_telephone: "",
  garage_email: "",
  garage_adresse: "",
  garage_ville: "Montréal",
  garage_code_postal: "",
  vehicule_annee: "",
  vehicule_marque: "",
  vehicule_modele: "",
  vehicule_vin: "",
  pieces_demandees: "",
  pieces_numero_oem: "",
  quantite: "1",
  urgence: "urgent",
  notes: "",
};

const STEPS = [
  { id: 1, label: "Garage", icon: Building2 },
  { id: 2, label: "Véhicule", icon: Car },
  { id: 3, label: "Pièces", icon: Package },
  { id: 4, label: "Urgence", icon: Zap },
  { id: 5, label: "Confirmation", icon: CheckCircle2 },
];

export default function CommandeForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (step === 1) {
      if (!form.garage_nom.trim()) newErrors.garage_nom = "Nom du garage requis";
      if (!form.garage_telephone.trim())
        newErrors.garage_telephone = "Téléphone requis";
      if (!form.garage_adresse.trim())
        newErrors.garage_adresse = "Adresse requise";
    }
    if (step === 2) {
      if (!form.vehicule_annee) newErrors.vehicule_annee = "Année requise";
      if (!form.vehicule_marque) newErrors.vehicule_marque = "Marque requise";
      if (!form.vehicule_modele.trim())
        newErrors.vehicule_modele = "Modèle requis";
    }
    if (step === 3) {
      if (!form.pieces_demandees.trim())
        newErrors.pieces_demandees = "Description des pièces requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 5));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantite: Number(form.quantite) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la commande");
      router.push("/confirmation");
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const urgenceInfo = NIVEAUX_URGENCE.find((u) => u.id === form.urgence);
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl">
      {/* Steps header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    done
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-slate-200 text-slate-400 bg-white"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    active ? "text-orange-600" : done ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <CardContent className="p-6">
        {/* ÉTAPE 1 — Infos garage */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Votre garage</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Informations de contact pour la livraison
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="garage_nom">Nom du garage *</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="garage_nom"
                    className="pl-9"
                    placeholder="Ex: Garage Dupont"
                    value={form.garage_nom}
                    onChange={(e) => set("garage_nom", e.target.value)}
                  />
                </div>
                {errors.garage_nom && (
                  <p className="text-red-500 text-xs mt-1">{errors.garage_nom}</p>
                )}
              </div>
              <div>
                <Label htmlFor="garage_telephone">Téléphone *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="garage_telephone"
                    type="tel"
                    className="pl-9"
                    placeholder="514-XXX-XXXX"
                    value={form.garage_telephone}
                    onChange={(e) => set("garage_telephone", e.target.value)}
                  />
                </div>
                {errors.garage_telephone && (
                  <p className="text-red-500 text-xs mt-1">{errors.garage_telephone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="garage_email">
                  Courriel{" "}
                  <span className="text-slate-400 font-normal">(optionnel)</span>
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="garage_email"
                    type="email"
                    className="pl-9"
                    placeholder="contact@mongarage.com"
                    value={form.garage_email}
                    onChange={(e) => set("garage_email", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="garage_adresse">Adresse de livraison *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="garage_adresse"
                    className="pl-9"
                    placeholder="123 Rue Principale, Montréal"
                    value={form.garage_adresse}
                    onChange={(e) => set("garage_adresse", e.target.value)}
                  />
                </div>
                {errors.garage_adresse && (
                  <p className="text-red-500 text-xs mt-1">{errors.garage_adresse}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="garage_ville">Ville</Label>
                  <Input
                    id="garage_ville"
                    className="mt-1"
                    placeholder="Montréal"
                    value={form.garage_ville}
                    onChange={(e) => set("garage_ville", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="garage_code_postal">Code postal</Label>
                  <Input
                    id="garage_code_postal"
                    className="mt-1"
                    placeholder="H1A 2B3"
                    value={form.garage_code_postal}
                    onChange={(e) =>
                      set("garage_code_postal", e.target.value.toUpperCase())
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — Véhicule */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Le véhicule</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Informations sur le véhicule à réparer
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Année *</Label>
                <Select
                  value={form.vehicule_annee}
                  onValueChange={(v) => v && set("vehicule_annee", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner l'année" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANNEES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicule_annee && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicule_annee}</p>
                )}
              </div>
              <div>
                <Label>Marque *</Label>
                <Select
                  value={form.vehicule_marque}
                  onValueChange={(v) => v && set("vehicule_marque", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner la marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARQUES_AUTO.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicule_marque && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicule_marque}</p>
                )}
              </div>
              <div>
                <Label htmlFor="vehicule_modele">Modèle *</Label>
                <Input
                  id="vehicule_modele"
                  className="mt-1"
                  placeholder="Ex: Civic, F-150, RAV4"
                  value={form.vehicule_modele}
                  onChange={(e) => set("vehicule_modele", e.target.value)}
                />
                {errors.vehicule_modele && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicule_modele}</p>
                )}
              </div>
              <div>
                <Label htmlFor="vehicule_vin">
                  NIV (VIN){" "}
                  <span className="text-slate-400 font-normal">(optionnel)</span>
                </Label>
                <Input
                  id="vehicule_vin"
                  className="mt-1 uppercase"
                  placeholder="Ex: 1HGCM82633A004352"
                  maxLength={17}
                  value={form.vehicule_vin}
                  onChange={(e) => set("vehicule_vin", e.target.value.toUpperCase())}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Aide à trouver la pièce exacte
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Pièces */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pièces requises</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Décrivez les pièces dont vous avez besoin
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="pieces_demandees">Description des pièces *</Label>
                <Textarea
                  id="pieces_demandees"
                  className="mt-1 min-h-[120px] resize-none"
                  placeholder={`Ex: Plaquettes de frein avant\nFiltre à huile\nCourroie de distribution`}
                  value={form.pieces_demandees}
                  onChange={(e) => set("pieces_demandees", e.target.value)}
                />
                {errors.pieces_demandees && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pieces_demandees}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Listez toutes les pièces nécessaires, une par ligne
                </p>
              </div>
              <div>
                <Label htmlFor="pieces_numero_oem">
                  Numéro de pièce OEM{" "}
                  <span className="text-slate-400 font-normal">(optionnel)</span>
                </Label>
                <Input
                  id="pieces_numero_oem"
                  className="mt-1"
                  placeholder="Ex: 04465-06180"
                  value={form.pieces_numero_oem}
                  onChange={(e) => set("pieces_numero_oem", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quantite">Quantité</Label>
                <Select
                  value={form.quantite}
                  onValueChange={(v) => v && set("quantite", v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                      (q) => (
                        <SelectItem key={q} value={q}>
                          {q}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 — Urgence */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Niveau d&apos;urgence</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Cela nous aide à prioriser votre livraison
              </p>
            </div>
            <div className="space-y-3">
              {NIVEAUX_URGENCE.map((niveau) => {
                const Icon = niveau.icon;
                const selected = form.urgence === niveau.id;
                return (
                  <button
                    key={niveau.id}
                    type="button"
                    onClick={() => set("urgence", niveau.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? niveau.color
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-6 h-6 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{niveau.label}</p>
                      <p className="text-xs opacity-75 mt-0.5">
                        {niveau.description}
                      </p>
                    </div>
                    {selected && (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            <div>
              <Label htmlFor="notes">
                Notes supplémentaires{" "}
                <span className="text-slate-400 font-normal">(optionnel)</span>
              </Label>
              <Textarea
                id="notes"
                className="mt-1 resize-none"
                placeholder="Informations additionnelles pour le livreur..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 5 — Récapitulatif */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Récapitulatif</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Vérifiez votre commande avant d&apos;envoyer
              </p>
            </div>

            <div className="space-y-3">
              {/* Garage */}
              <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  Garage
                </div>
                <p className="text-sm text-slate-800 font-medium">{form.garage_nom}</p>
                <p className="text-sm text-slate-600">{form.garage_telephone}</p>
                <p className="text-sm text-slate-600">
                  {form.garage_adresse}, {form.garage_ville}{" "}
                  {form.garage_code_postal}
                </p>
              </div>

              {/* Véhicule */}
              <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Car className="w-4 h-4 text-orange-500" />
                  Véhicule
                </div>
                <p className="text-sm text-slate-800 font-medium">
                  {form.vehicule_annee} {form.vehicule_marque} {form.vehicule_modele}
                </p>
                {form.vehicule_vin && (
                  <p className="text-sm text-slate-500">NIV: {form.vehicule_vin}</p>
                )}
              </div>

              {/* Pièces */}
              <div className="rounded-xl bg-slate-50 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  Pièces — Qté: {form.quantite}
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-line">
                  {form.pieces_demandees}
                </p>
                {form.pieces_numero_oem && (
                  <p className="text-sm text-slate-500">
                    OEM: {form.pieces_numero_oem}
                  </p>
                )}
              </div>

              {/* Urgence */}
              {urgenceInfo && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Urgence
                  </div>
                  <Badge className={`${urgenceInfo.badge} border-0`}>
                    {urgenceInfo.label} — {urgenceInfo.description}
                  </Badge>
                </div>
              )}
            </div>

            {submitError && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={prev}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Retour
            </Button>
          )}
          {step < 5 ? (
            <Button
              type="button"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold"
              onClick={next}
            >
              Suivant <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base py-5"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Envoi en cours...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" /> Envoyer la commande
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
