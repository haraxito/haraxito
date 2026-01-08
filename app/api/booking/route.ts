import { NextResponse } from "next/server";
import {
  supabaseAdmin,
  envValidation,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";
import { sendBookingEmails, isResendConfigured } from "@/lib/resend";

// Validate environment on module load
const isEnvValid = envValidation.valid;

export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error("Supabase not configured:", envValidation.errors);
      return NextResponse.json(
        {
          error: "Configuration error",
          details:
            "Database connection not configured. Please check environment variables.",
          errors: envValidation.errors,
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      nom,
      email,
      telephone,
      vehicule,
      typeService,
      adresse,
      message,
      damageType,
      preferredDate,
    } = body;

    // Validate required fields
    if (!nom || !email || !telephone || !vehicule || !typeService) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Validate service type
    if (!["DOMICILE", "ATELIER"].includes(typeService)) {
      return NextResponse.json(
        { error: "Type de service invalide" },
        { status: 400 }
      );
    }

    // Validate required address for DOMICILE service
    if (typeService === "DOMICILE" && !adresse) {
      return NextResponse.json(
        { error: "L'adresse est requise pour le service à domicile" },
        { status: 400 }
      );
    }

    // Insert into Supabase using admin client
    const { data: booking, error: dbError } = await supabaseAdmin()
      .from("rendez_vous")
      .insert([
        {
          client_nom: nom,
          client_email: email || null,
          client_telephone: telephone,
          vehicule_infos: vehicule,
          type_service: typeService,
          adresse_intervention: typeService === "DOMICILE" ? adresse : null,
          date_souhaitee:
            preferredDate || new Date().toISOString().split("T")[0],
          statut: "Nouveau",
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

    // Send confirmation emails via Resend (non-blocking)
    if (isResendConfigured()) {
      try {
        const emailResults = await sendBookingEmails({
          clientName: nom,
          clientEmail: email,
          clientPhone: telephone,
          vehicleInfo: vehicule,
          damageType: damageType || "other",
          serviceType: typeService,
          address: adresse,
          preferredDate: preferredDate,
          message: message,
        });

        console.log("Email results:", {
          clientSuccess: emailResults.clientEmail.success,
          adminSuccess: emailResults.adminEmail.success,
        });
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error("Email sending error:", emailError);
      }
    } else {
      console.warn("Resend not configured, skipping emails");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Demande enregistrée avec succès",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
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

// Add GET handler for health checks
export async function GET() {
  return NextResponse.json({
    status: "ok",
    supabase: isSupabaseConfigured() ? "configured" : "not configured",
    resend: isResendConfigured() ? "configured" : "not configured",
    envValid: isEnvValid,
  });
}
