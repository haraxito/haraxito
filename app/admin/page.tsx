import { supabaseAdmin } from "@/lib/supabaseClient";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Package,
  Building2,
  MapPin,
  RefreshCw,
  PlusCircle,
  Clock,
  Car,
  Phone,
  Flame,
  AlertTriangle,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CommandePiece = {
  id: string;
  created_at: string;
  garage_nom: string;
  garage_telephone: string;
  garage_email: string | null;
  garage_adresse: string;
  garage_ville: string;
  vehicule_annee: string;
  vehicule_marque: string;
  vehicule_modele: string;
  pieces_demandees: string;
  pieces_numero_oem: string | null;
  quantite: number;
  urgence: "critique" | "urgent" | "normal";
  notes: string | null;
  statut: string;
};

const URGENCE_CONFIG = {
  critique: {
    label: "CRITIQUE",
    icon: Flame,
    bar: "bg-red-500",
    badge: "bg-red-100 text-red-800",
  },
  urgent: {
    label: "URGENT",
    icon: AlertTriangle,
    bar: "bg-orange-500",
    badge: "bg-orange-100 text-orange-800",
  },
  normal: {
    label: "NORMAL",
    icon: Clock,
    bar: "bg-blue-400",
    badge: "bg-blue-100 text-blue-800",
  },
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("commandes_pieces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="px-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Erreur de connexion
        </h2>
        <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
          <p className="text-red-700 font-medium">{error.message}</p>
          <p className="text-slate-600 mt-2 text-sm">
            Vérifiez la configuration Supabase et les politiques RLS.
          </p>
        </div>
      </div>
    );
  }

  const commandes = (data as CommandePiece[]) || [];
  const nouvellesCount = commandes.filter((c) => c.statut === "Nouvelle").length;
  const critiquesCount = commandes.filter((c) => c.urgence === "critique").length;
  const urgentesCount = commandes.filter((c) => c.urgence === "urgent").length;

  return (
    <>
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-orange-600 text-white shadow-md -mx-4 md:-mx-0">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">PièceFlash MTL</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/10"
              title="Rafraîchir"
            >
              <RefreshCw className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-6 pt-6 px-4">
        {/* Stats */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-500" />
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  Nouvelles
                </p>
              </div>
              <p className="text-slate-900 text-2xl font-bold">{nouvellesCount}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  Critiques
                </p>
              </div>
              <p className="text-slate-900 text-2xl font-bold">{critiquesCount}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  Urgentes
                </p>
              </div>
              <p className="text-slate-900 text-2xl font-bold">{urgentesCount}</p>
            </div>
          </div>
        </section>

        {/* Commandes */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 text-lg font-bold">
              Commandes récentes
            </h3>
            <span className="text-slate-500 text-sm">
              {commandes.length} au total
            </span>
          </div>

          <div className="flex flex-col gap-4 pb-8">
            {commandes.map((commande) => {
              const urgConf =
                URGENCE_CONFIG[commande.urgence] || URGENCE_CONFIG.normal;
              const UrgIcon = urgConf.icon;
              return (
                <article
                  key={commande.id}
                  className="flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200 relative overflow-hidden"
                >
                  {/* Urgence strip */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${urgConf.bar}`}
                  />

                  <div className="pl-2 flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-slate-900 font-bold text-base">
                        {commande.garage_nom}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {commande.garage_ville} · {commande.garage_adresse}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${urgConf.badge}`}
                    >
                      <UrgIcon className="w-3 h-3" />
                      {urgConf.label}
                    </span>
                  </div>

                  <div className="pl-2 flex flex-col gap-2 my-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span>
                        {commande.vehicule_annee} {commande.vehicule_marque}{" "}
                        {commande.vehicule_modele}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-700">
                      <Package className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line leading-snug">
                        {commande.pieces_demandees}
                      </span>
                    </div>
                    {commande.pieces_numero_oem && (
                      <p className="text-xs text-slate-500 pl-6">
                        OEM: {commande.pieces_numero_oem}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{commande.garage_adresse}, {commande.garage_ville}</span>
                    </div>
                  </div>

                  <div className="pl-2 mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(commande.created_at).toLocaleDateString(
                          "fr-CA"
                        )}{" "}
                        {new Date(commande.created_at).toLocaleTimeString(
                          "fr-CA",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          commande.statut === "Nouvelle"
                            ? "bg-yellow-100 text-yellow-800"
                            : commande.statut === "En route"
                            ? "bg-blue-100 text-blue-800"
                            : commande.statut === "Livrée"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {commande.statut}
                      </span>
                      <a
                        href={`tel:${commande.garage_telephone}`}
                        className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-medium">Appeler</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}

            {commandes.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Aucune commande pour le moment.</p>
                <p className="text-sm mt-1">
                  Les nouvelles commandes apparaîtront ici.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center hover:bg-orange-600 transition-transform hover:scale-105 active:scale-95 z-50"
      >
        <PlusCircle className="w-7 h-7" />
      </Link>
    </>
  );
}
