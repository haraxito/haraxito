import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmails } from "@/lib/resend";

// Initialize Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
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

    // Insert into Supabase
    const { data: booking, error: dbError } = await supabase
      .from("rendez_vous")
      .insert([
        {
          client_nom: nom,
          client_email: email || null,
          client_telephone: telephone,
          vehicule_infos: vehicule,
          type_service: typeService,
          adresse_intervention: typeService === 'DOMICILE' ? adresse : null,
          date_souhaitee: preferredDate || new Date().toISOString().split('T')[0],
          statut: "Nouveau",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    // Send confirmation emails via Resend
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

      console.log("Email results:", emailResults);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Email sending error:", emailError);
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
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
