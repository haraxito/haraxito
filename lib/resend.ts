import { Resend } from "resend";
import { getEnvVar, validateEnvVars } from "./env";

// Initialize Resend client with validation
const resendApiKey = getEnvVar("RESEND_API_KEY");
const envValidation = validateEnvVars();

// Export Resend client - will be null if API key is missing
export let resend: Resend | null = null;

if (resendApiKey) {
  try {
    resend = new Resend(resendApiKey);
  } catch (error) {
    console.error("Failed to initialize Resend client:", error);
    resend = null;
  }
} else {
  if (envValidation.errors.some((e) => e.includes("RESEND_API_KEY"))) {
    console.error("Resend initialization failed: RESEND_API_KEY is missing");
  }
}

// Types
interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  vehicleInfo: string;
  damageType: string;
  serviceType: "DOMICILE" | "ATELIER";
  address?: string;
  preferredDate?: string;
  message?: string;
}

// Format damage type for display
function formatDamageType(type: string): string {
  const types: Record<string, string> = {
    crack: "Fissure",
    chip: "Éclat / Impact",
    shattered: "Pare-brise brisé",
    other: "Autre",
  };
  return types[type] || type;
}

// Generate client confirmation email HTML
function generateClientEmailHtml(data: BookingEmailData): string {
  const {
    clientName,
    vehicleInfo,
    damageType,
    serviceType,
    address,
    preferredDate,
    message,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1957b3 0%, #0d3a7d 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🚗 Parebrise Instant</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">Service de remplacement de pare-brise</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #10b981; margin: 0 0 20px 0; font-size: 20px;">✅ Demande confirmée!</h2>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Bonjour <strong>${clientName}</strong>,
      </p>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        Nous avons bien reçu votre demande de rendez-vous. Notre équipe vous contactera très bientôt pour confirmer les détails.
      </p>
      
      <!-- Details Box -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">📋 Récapitulatif</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Véhicule:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${vehicleInfo}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Type de dommage:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${formatDamageType(damageType)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Service:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${serviceType === "DOMICILE" ? "🚐 Service Mobile (À Domicile)" : "🏢 En Atelier"}</td>
          </tr>
          ${
            address
              ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Adresse:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${address}</td>
          </tr>
          `
              : ""
          }
          ${
            preferredDate
              ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date souhaitée:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${new Date(preferredDate).toLocaleDateString("fr-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
          </tr>
          `
              : ""
          }
          ${
            message
              ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Message:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${message}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        Si vous avez des questions, n'hésitez pas à nous contacter.
      </p>
      
      <p style="color: #374151; font-size: 14px; margin-top: 30px;">
        Cordialement,<br>
        <strong>L'équipe Parebrise Instant</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">© 2026 Parebrise Instant. Tous droits réservés.</p>
      <p style="margin: 8px 0 0 0;">
        <a href="https://www.parebrise-instant.com" style="color: #1957b3; text-decoration: none;">www.parebrise-instant.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Generate admin notification email HTML
function generateAdminEmailHtml(data: BookingEmailData): string {
  const {
    clientName,
    clientEmail,
    clientPhone,
    vehicleInfo,
    damageType,
    serviceType,
    address,
    preferredDate,
    message,
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 20px;">🔔 Nouvelle Demande de Rendez-vous</h1>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Service Type Badge -->
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; ${serviceType === "DOMICILE" ? "background: #dbeafe; color: #1d4ed8;" : "background: #f3e8ff; color: #7c3aed;"}">
          ${serviceType === "DOMICILE" ? "🚐 SERVICE MOBILE" : "🏢 EN ATELIER"}
        </span>
      </div>
      
      <!-- Client Info -->
      <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">👤 Informations Client</h3>
        <p style="margin: 5px 0; font-size: 16px;"><strong>${clientName}</strong></p>
        <p style="margin: 5px 0; font-size: 14px;">📱 <a href="tel:${clientPhone}" style="color: #1957b3;">${clientPhone}</a></p>
        ${clientEmail ? `<p style="margin: 5px 0; font-size: 14px;">📧 <a href="mailto:${clientEmail}" style="color: #1957b3;">${clientEmail}</a></p>` : ""}
      </div>
      
      <!-- Details -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">🚗 Détails de la Demande</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 120px;">Véhicule:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${vehicleInfo}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Dommage:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${formatDamageType(damageType)}</td>
          </tr>
          ${
            address
              ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Adresse:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${address}</td>
          </tr>
          `
              : ""
          }
          ${
            preferredDate
              ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Date souhaitée:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${new Date(preferredDate).toLocaleDateString("fr-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>
      
      ${
        message
          ? `
      <!-- Message -->
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 14px;">💬 Message du client</h3>
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">${message}</p>
      </div>
      `
          : ""
      }
      
      <!-- Action Buttons -->
      <div style="text-align: center; margin-top: 25px;">
        <a href="tel:${clientPhone}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px;">
          📞 Appeler le client
        </a>
        <a href="https://www.parebrise-instant.com/admin" style="display: inline-block; background: #1957b3; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px;">
          📊 Voir le dashboard
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 11px;">
      <p style="margin: 0;">Reçu le ${new Date().toLocaleString("fr-CA", { dateStyle: "long", timeStyle: "short" })}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Send confirmation email to client
export async function sendClientConfirmationEmail(data: BookingEmailData) {
  const { clientEmail } = data;

  if (!resend) {
    console.warn(
      "Resend client not configured, skipping client confirmation email"
    );
    return { success: false, error: new Error("Resend not configured") };
  }

  if (!clientEmail) {
    console.warn("No client email provided, skipping confirmation email");
    return { success: false, error: new Error("No client email") };
  }

  try {
    const emailHtml = generateClientEmailHtml(data);

    const { data: emailData, error } = await resend.emails.send({
      from:
        getEnvVar("RESEND_FROM_EMAIL") ||
        "Parebrise Instant <onboarding@resend.dev>",
      to: clientEmail,
      subject: "✅ Confirmation de votre demande - Parebrise Instant",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending client email:", error);
      return { success: false, error };
    }

    console.log("Client email sent successfully:", emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending client email:", error);
    return { success: false, error };
  }
}

// Send notification email to admin
export async function sendAdminNotificationEmail(data: BookingEmailData) {
  const adminEmail = getEnvVar("ADMIN_EMAIL") || "sarmadyaqoob4@gmail.com";

  if (!resend) {
    console.warn(
      "Resend client not configured, skipping admin notification email"
    );
    return { success: false, error: new Error("Resend not configured") };
  }

  try {
    const emailHtml = generateAdminEmailHtml(data);

    const { data: emailData, error } = await resend.emails.send({
      from:
        getEnvVar("RESEND_FROM_EMAIL") ||
        "Parebrise Instant <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🔔 Nouvelle demande - ${data.clientName} (${data.serviceType === "DOMICILE" ? "Domicile" : "Atelier"})`,
      html: emailHtml,
      replyTo: data.clientEmail || undefined,
    });

    if (error) {
      console.error("Error sending admin email:", error);
      return { success: false, error };
    }

    console.log("Admin email sent successfully:", emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending admin email:", error);
    return { success: false, error };
  }
}

// Send both emails
export async function sendBookingEmails(data: BookingEmailData) {
  const [clientResult, adminResult] = await Promise.all([
    sendClientConfirmationEmail(data),
    sendAdminNotificationEmail(data),
  ]);

  console.log("Email results:", {
    clientSuccess: clientResult.success,
    adminSuccess: adminResult.success,
  });

  return {
    clientEmail: clientResult,
    adminEmail: adminResult,
  };
}

// Helper function to check if Resend is configured
export function isResendConfigured(): boolean {
  return resend !== null;
}

// ─── PièceFlash MTL — Emails commandes de pièces ───────────────────────────

interface CommandeEmailData {
  garage_nom: string;
  garage_telephone: string;
  garage_email?: string;
  garage_adresse: string;
  garage_ville: string;
  vehicule: string;
  pieces_demandees: string;
  pieces_numero_oem?: string;
  quantite?: number;
  urgence: string;
  notes?: string;
}

const URGENCE_LABELS: Record<string, string> = {
  critique: "🔥 CRITIQUE",
  urgent: "⚠️ URGENT",
  normal: "🕐 Normal",
};

const URGENCE_COLORS: Record<string, string> = {
  critique: "#dc2626",
  urgent: "#ea580c",
  normal: "#3b82f6",
};

function generateGarageConfirmationHtml(data: CommandeEmailData): string {
  const urgenceLabel = URGENCE_LABELS[data.urgence] || data.urgence;
  const urgenceColor = URGENCE_COLORS[data.urgence] || "#ea580c";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">⚡ PièceFlash MTL</h1>
      <p style="color: #fed7aa; margin: 8px 0 0 0; font-size: 14px;">Livraison de pièces auto d'urgence — Grand Montréal</p>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #16a34a; margin: 0 0 20px 0; font-size: 20px;">✅ Commande reçue!</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Bonjour <strong>${data.garage_nom}</strong>,
      </p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        Nous avons bien reçu votre commande. Notre équipe prend en charge votre demande et vous contacte très bientôt.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 16px;">📋 Récapitulatif de commande</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 130px;">Véhicule:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${data.vehicule}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Pièces demandées:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; white-space: pre-line;">${data.pieces_demandees}</td>
          </tr>
          ${data.pieces_numero_oem ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">N° OEM:</td><td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${data.pieces_numero_oem}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Quantité:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${data.quantite || 1}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Urgence:</td>
            <td style="padding: 8px 0;"><span style="display: inline-block; padding: 3px 10px; border-radius: 20px; background: ${urgenceColor}20; color: ${urgenceColor}; font-size: 13px; font-weight: 700;">${urgenceLabel}</span></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Livraison à:</td>
            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${data.garage_adresse}, ${data.garage_ville}</td>
          </tr>
        </table>
      </div>
      <p style="color: #374151; font-size: 14px; margin-top: 20px;">
        Cordialement,<br>
        <strong>L'équipe PièceFlash MTL</strong><br>
        <a href="tel:5147544607" style="color: #ea580c;">514-754-4607</a>
      </p>
    </div>
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">© 2026 PièceFlash MTL. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`.trim();
}

function generateAdminCommandeHtml(data: CommandeEmailData): string {
  const urgenceLabel = URGENCE_LABELS[data.urgence] || data.urgence;
  const urgenceColor = URGENCE_COLORS[data.urgence] || "#ea580c";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, ${urgenceColor} 0%, #7c2d12 100%); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 20px;">🚨 Nouvelle commande — ${urgenceLabel}</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">🏭 Garage</h3>
        <p style="margin: 5px 0; font-size: 16px;"><strong>${data.garage_nom}</strong></p>
        <p style="margin: 5px 0; font-size: 14px;">📱 <a href="tel:${data.garage_telephone}" style="color: #ea580c;">${data.garage_telephone}</a></p>
        ${data.garage_email ? `<p style="margin: 5px 0; font-size: 14px;">📧 <a href="mailto:${data.garage_email}" style="color: #ea580c;">${data.garage_email}</a></p>` : ""}
        <p style="margin: 5px 0; font-size: 14px;">📍 ${data.garage_adresse}, ${data.garage_ville}</p>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">🚗 Véhicule & Pièces</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 130px;">Véhicule:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${data.vehicule}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px; vertical-align: top;">Pièces:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600; white-space: pre-line;">${data.pieces_demandees}</td>
          </tr>
          ${data.pieces_numero_oem ? `<tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">N° OEM:</td><td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${data.pieces_numero_oem}</td></tr>` : ""}
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Quantité:</td>
            <td style="padding: 6px 0; color: #1e293b; font-size: 13px; font-weight: 600;">${data.quantite || 1}</td>
          </tr>
        </table>
      </div>
      ${data.notes ? `<div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin-bottom: 20px;"><h3 style="color: #166534; margin: 0 0 10px 0; font-size: 14px;">💬 Notes</h3><p style="margin: 0; color: #374151; font-size: 14px;">${data.notes}</p></div>` : ""}
      <div style="text-align: center; margin-top: 25px;">
        <a href="tel:${data.garage_telephone}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px;">📞 Appeler le garage</a>
        <a href="/admin" style="display: inline-block; background: #ea580c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 5px;">📊 Dashboard admin</a>
      </div>
    </div>
    <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 11px;">
      <p style="margin: 0;">Reçu le ${new Date().toLocaleString("fr-CA", { dateStyle: "long", timeStyle: "short" })}</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function sendCommandeEmails(data: CommandeEmailData) {
  if (!resend) return;
  const adminEmail = getEnvVar("ADMIN_EMAIL") || "sarmadyaqoob4@gmail.com";
  const fromEmail =
    getEnvVar("RESEND_FROM_EMAIL") || "PièceFlash MTL <onboarding@resend.dev>";
  const urgenceLabel = URGENCE_LABELS[data.urgence] || data.urgence;

  const tasks = [
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚨 Nouvelle commande ${urgenceLabel} — ${data.garage_nom} — ${data.vehicule}`,
      html: generateAdminCommandeHtml(data),
    }),
  ];

  if (data.garage_email) {
    tasks.push(
      resend.emails.send({
        from: fromEmail,
        to: data.garage_email,
        subject: "✅ Commande reçue — PièceFlash MTL",
        html: generateGarageConfirmationHtml(data),
      })
    );
  }

  await Promise.allSettled(tasks);
}
