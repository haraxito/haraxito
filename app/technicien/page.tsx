import { supabaseAdmin } from "@/lib/supabaseClient";
import { isTechnicienAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Truck,
  Building2,
  MapPin,
  RefreshCw,
  Calendar,
  Car,
  Phone,
  Wrench,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import FilterChips from "./FilterChips";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RendezVous = {
  id: number;
  created_at: string;
  client_nom: string;
  client_telephone: string;
  vehicule_infos: string;
  type_service: "DOMICILE" | "ATELIER";
  adresse_intervention: string | null;
  date_souhaitee: string;
};

export default async function TechnicienPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  // Check authentication - redirect to login if not authenticated
  const authenticated = await isTechnicienAuthenticated();
  if (!authenticated) {
    redirect("/technicien/login");
  }

  const params = await searchParams;
  const filter = params.filter || "tous";

  const admin = supabaseAdmin();
  let query = admin
    .from("rendez_vous")
    .select("id, created_at, client_nom, client_telephone, vehicule_infos, type_service, adresse_intervention, date_souhaitee")
    .order("date_souhaitee", { ascending: true });

  // Apply filter
  if (filter === "domicile") {
    query = query.eq("type_service", "DOMICILE");
  } else if (filter === "atelier") {
    query = query.eq("type_service", "ATELIER");
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Technicien - Réservations</h2>
          <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
            <p className="text-red-700 font-medium">Erreur: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const rendezVous = (data as RendezVous[]) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 bg-emerald-600 text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6" />
            <h1 className="text-lg font-bold tracking-tight">
              Parebrise Instant
            </h1>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Technicien
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/technicien"
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/10"
              title="Rafraîchir"
            >
              <RefreshCw className="w-5 h-5" />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4 pt-4 px-4 max-w-4xl mx-auto pb-8">
        {/* Filters */}
        <FilterChips currentFilter={filter} />

        {/* Reservations Count */}
        <p className="text-sm text-slate-500">
          {rendezVous.length} réservation{rendezVous.length !== 1 ? "s" : ""}
        </p>

        {/* Lead Cards */}
        <div className="flex flex-col gap-4">
          {rendezVous.map((row) => (
            <article
              key={row.id}
              className="flex flex-col bg-white rounded-xl p-4 shadow-sm border border-gray-200 relative overflow-hidden"
            >
              {/* Status Strip */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  row.type_service === "DOMICILE"
                    ? "bg-emerald-500"
                    : "bg-blue-500"
                }`}
              />

              <div className="pl-3">
                {/* Header with badge */}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-slate-900 font-bold text-lg">
                    {row.client_nom}
                  </h4>
                  {row.type_service === "DOMICILE" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <Truck className="w-3.5 h-3.5" />
                      DOMICILE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      <Building2 className="w-3.5 h-3.5" />
                      ATELIER
                    </span>
                  )}
                </div>

                {/* Info rows */}
                <div className="flex flex-col gap-2.5">
                  {/* Phone */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{row.client_telephone}</span>
                    </div>
                    <a
                      href={`tel:${row.client_telephone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </a>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      Date souhaitée: <strong>{row.date_souhaitee}</strong>
                    </span>
                  </div>

                  {/* Vehicle */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span>{row.vehicule_infos}</span>
                  </div>

                  {/* Address (only for DOMICILE) */}
                  {row.type_service === "DOMICILE" && row.adresse_intervention && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-start gap-2 text-slate-700 flex-1 min-w-0">
                        <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-emerald-700 font-medium truncate">
                          {row.adresse_intervention}
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.adresse_intervention)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition flex-shrink-0"
                      >
                        <Navigation className="w-4 h-4" />
                        Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}

          {rendezVous.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-gray-200">
              <Wrench className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-lg">Aucune réservation pour le moment.</p>
              <p className="text-sm mt-2">
                Les nouvelles demandes apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
