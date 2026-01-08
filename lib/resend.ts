import { Resend } from "resend";
import { render } from "@react-email/render";
import { ClientConfirmationEmail } from "@/emails/ClientConfirmation";
import { AdminNotificationEmail } from "@/emails/AdminNotification";
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

// Send confirmation email to client
export async function sendClientConfirmationEmail(data: BookingEmailData) {
  const {
    clientName,
    clientEmail,
    vehicleInfo,
    damageType,
    serviceType,
    address,
    preferredDate,
    message,
  } = data;

  // Validate Resend is configured
  if (!resend) {
    console.warn(
      "Resend client not configured, skipping client confirmation email"
    );
    return { success: false, error: new Error("Resend not configured") };
  }

  // Don't send if no email provided
  if (!clientEmail) {
    console.warn("No client email provided, skipping confirmation email");
    return { success: false, error: new Error("No client email") };
  }

  try {
    // Render React component to HTML
    const emailHtml = await render(
      ClientConfirmationEmail({
        clientName,
        vehicleInfo,
        damageType,
        serviceType,
        address,
        preferredDate,
        message,
      })
    );

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

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Error sending client email:", error);
    return { success: false, error };
  }
}

// Send notification email to admin
export async function sendAdminNotificationEmail(data: BookingEmailData) {
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

  const adminEmail = getEnvVar("ADMIN_EMAIL") || "admin@example.com";

  // Validate Resend is configured
  if (!resend) {
    console.warn(
      "Resend client not configured, skipping admin notification email"
    );
    return { success: false, error: new Error("Resend not configured") };
  }

  try {
    // Render React component to HTML
    const emailHtml = await render(
      AdminNotificationEmail({
        clientName,
        clientEmail,
        clientPhone,
        vehicleInfo,
        damageType,
        serviceType,
        address,
        preferredDate,
        message,
      })
    );

    const { data: emailData, error } = await resend.emails.send({
      from:
        getEnvVar("RESEND_FROM_EMAIL") ||
        "Parebrise Instant <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🔔 Nouvelle demande - ${clientName} (${serviceType === "DOMICILE" ? "Domicile" : "Atelier"})`,
      html: emailHtml,
      replyTo: clientEmail,
    });

    if (error) {
      console.error("Error sending admin email:", error);
      return { success: false, error };
    }

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

  return {
    clientEmail: clientResult,
    adminEmail: adminResult,
  };
}

// Helper function to check if Resend is configured
export function isResendConfigured(): boolean {
  return resend !== null;
}
