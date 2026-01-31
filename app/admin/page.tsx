import { supabaseAdmin } from "@/lib/supabaseClient";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Truck,
  Building2,
  MapPin,
  RefreshCw,
  PlusCircle,
  Clock,
  Calendar,
  Car,
  Phone,
  Pencil,
  Wrench,
  Shield,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RendezVous = {
  id: number;
  created_at: string;
  client_nom: string;
  client_telephone: string;
  client_email: string | null;
  vehicule_infos: string;
  type_service: "DOMICILE" | "ATELIER";
  adresse_intervention: string | null;
  date_souhaitee: string;
  statut: string;
};

export default async function AdminPage() {
  // Check authentication - redirect to login if not authenticated
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("rendez_vous")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="px-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Admin - Leads</h2>
        <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
          <p className="text-red-700 font-medium">Erreur: {error.message}</p>
          <p className="text-slate-600 mt-2 text-sm">
            Vérifiez que la clé de service et les politiques RLS sont
            configurées.
          </p>
        </div>
      </div>
    );
  }

  const rendezVous = (data as RendezVous[]) || [];
  const nouveauCount = rendezVous.filter((r) => r.statut === "Nouveau").length;
  const confirmeCount = rendezVous.filter(
    (r) => r.statut === "Confirmé"
  ).length;
  const domicileCount = rendezVous.filter(
    (r) => r.type_service === "DOMICILE"
  ).length;

  return (
    <>
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-primary text-white shadow-md -mx-4 md:-mx-0">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">
              Parebrise Instant
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/technicien"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition text-sm font-medium"
              title="Espace Technicien"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Technicien</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/10"
              title="Rafraîchir"
            >
              <RefreshCw className="w-5 h-5" />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-6 pt-6 px-4">
        {/* Stats Overview */}
        <section>
          <h2 className="sr-only">Statistiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Stat Card 1 */}
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  Nouveaux
                </p>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-slate-900 text-2xl font-bold leading-none">
                  {nouveauCount}
                </p>
                <p className="text-emerald-600 text-xs font-medium mb-1">
                  leads
                </p>
              </div>
            </div>
            {/* Stat Card 2 */}
            <div className="flex flex-col gap-1 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  À domicile
                </p>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-slate-900 text-2xl font-bold leading-none">
                  {domicileCount}
                </p>
                <p className="text-slate-500 text-xs font-medium mb-1">
                  mobile
                </p>
              </div>
            </div>
            {/* Stat Card 3 */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-1 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  Confirmés
                </p>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-slate-900 text-2xl font-bold leading-none">
                  {confirmeCount}
                </p>
                <p className="text-emerald-600 text-xs font-medium mb-1">
                  bookés
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Leads Section */}
        <section className="flex flex-col gap-4">
          {/* Section Header & Filters */}
          <div className="flex flex-col gap-3 sticky top-[60px] z-30 bg-background-light py-2">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 text-lg font-bold leading-tight">
                Leads récents
              </h3>
              <Link href="/" className="text-primary text-sm font-semibold">
                + Nouveau
              </Link>
            </div>
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button className="flex shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white h-8 px-4 border border-primary transition shadow-sm">
                <p className="text-sm font-medium">Tous</p>
              </button>
              <button className="flex shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 h-8 px-4 transition">
                <Truck className="w-4 h-4 text-emerald-600" />
                <p className="text-slate-700 text-sm font-medium">Domicile</p>
              </button>
              <button className="flex shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 h-8 px-4 transition">
                <Building2 className="w-4 h-4 text-blue-600" />
                <p className="text-slate-700 text-sm font-medium">Atelier</p>
              </button>
            </div>
          </div>

          {/* Lead Cards */}
          <div className="flex flex-col gap-4 pb-8">
            {rendezVous.map((row) => (
              <article
                key={row.id}
                className="flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200 relative overflow-hidden group"
              >
                {/* Status Strip */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    row.type_service === "DOMICILE"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }`}
                />

                <div className="pl-2 flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-slate-900 font-bold text-base">
                      {row.client_nom}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ID: #AG-{row.id}
                    </p>
                  </div>
                  {row.type_service === "DOMICILE" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <Truck className="w-3 h-3" />
                      DOMICILE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      <Building2 className="w-3 h-3" />
                      ATELIER
                    </span>
                  )}
                </div>

                <div className="pl-2 flex flex-col gap-2 my-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span>{row.vehicule_infos}</span>
                  </div>

                  {row.type_service === "DOMICILE" &&
                    row.adresse_intervention && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-700 font-medium">
                          {row.adresse_intervention}
                        </span>
                      </div>
                    )}

                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      Date souhaitée: <strong>{row.date_souhaitee}</strong>
                    </span>
                  </div>
                </div>

                <div className="pl-2 mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(row.created_at).toLocaleDateString("fr-CA")}{" "}
                      {new Date(row.created_at).toLocaleTimeString("fr-CA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 text-primary hover:bg-gray-200 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <a
                      href={`tel:${row.client_telephone}`}
                      className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Appeler</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {rendezVous.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">Aucun lead pour le moment.</p>
                <p className="text-sm mt-2">
                  Les nouvelles demandes apparaîtront ici.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-blue-900/20 flex items-center justify-center hover:bg-primary-dark transition-transform hover:scale-105 active:scale-95 z-50"
      >
        <PlusCircle className="w-7 h-7" />
      </Link>
    </>
  );
}
