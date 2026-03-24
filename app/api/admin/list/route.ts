import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { isAuthenticated } from "@/lib/auth";

// Force dynamic rendering for this route (uses request.url)
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/list
 *
 * Récupère la liste de tous les rendez-vous pour le dashboard admin.
 *
 * Sécurité :
 * - Vérifie l'authentification admin via cookie
 * - Utilise supabaseAdmin (service_role) pour bypass RLS
 *
 * Paramètres de requête optionnels :
 * - status: filtrer par statut (ex: "Nouveau", "Confirmé")
 * - type: filtrer par type de service ("DOMICILE", "ATELIER")
 * - date: filtrer par date souhaitée (format: YYYY-MM-DD)
 * - limit: nombre maximum de résultats (défaut: tous)
 */
export async function GET(request: Request) {
  try {
    // Vérifier l'authentification admin
    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: "Non autorisé", message: "Vous devez être connecté en tant qu'administrateur" },
        { status: 401 }
      );
    }

    // Extraire les paramètres de requête
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const typeFilter = searchParams.get("type");
    const dateFilter = searchParams.get("date");
    const limitFilter = searchParams.get("limit");

    // Construction de la requête Supabase
    let query = supabaseAdmin()
      .from("commandes_pieces")
      .select("*")
      .order("created_at", { ascending: false });

    // Appliquer les filtres si présents
    if (statusFilter) {
      query = query.eq("statut", statusFilter);
    }

    if (typeFilter) {
      query = query.eq("urgence", typeFilter);
    }

    if (dateFilter) {
      query = query.gte("created_at", dateFilter).lt("created_at", dateFilter + "T23:59:59");
    }

    if (limitFilter) {
      const limit = parseInt(limitFilter, 10);
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit);
      }
    }

    // Exécuter la requête
    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          error: "Erreur de base de données",
          message: error.message,
          details: error.details,
        },
        { status: 500 }
      );
    }

    // Calculer les statistiques
    const stats = {
      total: data.length,
      nouvelles: data.filter((r) => r.statut === "Nouvelle").length,
      confirmees: data.filter((r) => r.statut === "Confirmée").length,
      en_route: data.filter((r) => r.statut === "En route").length,
      critiques: data.filter((r) => r.urgence === "critique").length,
      urgentes: data.filter((r) => r.urgence === "urgent").length,
    };

    return NextResponse.json(
      { success: true, data, stats, count: data.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Une erreur inconnue est survenue",
      },
      { status: 500 }
    );
  }
}
