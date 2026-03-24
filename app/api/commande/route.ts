import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseClient";
import { sendCommandeEmails, isResendConfigured } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Configuration de la base de données manquante" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      garage_nom,
      garage_telephone,
      garage_email,
      garage_adresse,
      garage_ville,
      garage_code_postal,
      vehicule_annee,
      vehicule_marque,
      vehicule_modele,
      vehicule_vin,
      pieces_demandees,
      pieces_numero_oem,
      quantite,
      urgence,
      notes,
    } = body;

    // Validation des champs requis
    if (!garage_nom || !garage_telephone || !garage_adresse) {
      return NextResponse.json(
        { error: "Informations du garage manquantes" },
        { status: 400 }
      );
    }
    if (!vehicule_annee || !vehicule_marque || !vehicule_modele) {
      return NextResponse.json(
        { error: "Informations du véhicule manquantes" },
        { status: 400 }
      );
    }
    if (!pieces_demandees) {
      return NextResponse.json(
        { error: "Description des pièces manquante" },
        { status: 400 }
      );
    }

    // Insertion dans Supabase
    const { data: commande, error: dbError } = await supabaseAdmin()
      .from("commandes_pieces")
      .insert([
        {
          garage_nom,
          garage_telephone,
          garage_email: garage_email || null,
          garage_adresse,
          garage_ville: garage_ville || "Montréal",
          garage_province: "QC",
          garage_code_postal: garage_code_postal || null,
          vehicule_annee,
          vehicule_marque,
          vehicule_modele,
          vehicule_vin: vehicule_vin || null,
          pieces_demandees,
          pieces_numero_oem: pieces_numero_oem || null,
          quantite: quantite || 1,
          urgence: urgence || "urgent",
          notes: notes || null,
          statut: "Nouvelle",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement", details: dbError.message },
        { status: 500 }
      );
    }

    // Envoi des emails (non-bloquant)
    if (isResendConfigured()) {
      sendCommandeEmails({
        garage_nom,
        garage_telephone,
        garage_email,
        garage_adresse,
        garage_ville: garage_ville || "Montréal",
        vehicule: `${vehicule_annee} ${vehicule_marque} ${vehicule_modele}`,
        pieces_demandees,
        pieces_numero_oem,
        quantite,
        urgence: urgence || "urgent",
        notes,
      }).catch(console.error);
    }

    return NextResponse.json(
      { success: true, message: "Commande enregistrée avec succès", commande },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Format de requête invalide" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "PièceFlash MTL - API Commandes",
    supabase: isSupabaseConfigured() ? "configured" : "not configured",
    resend: isResendConfigured() ? "configured" : "not configured",
  });
}
