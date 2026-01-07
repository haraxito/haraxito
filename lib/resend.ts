import { Resend } from "resend";
import { ClientConfirmationEmail } from "@/emails/ClientConfirmation";
import { AdminNotificationEmail } from "@/emails/AdminNotification";

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    const { data: emailData, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "AutoGlass Pro <onboarding@resend.dev>",
      to: clientEmail,
      subject: "✅ Confirmation de votre demande - AutoGlass Pro",
      react: ClientConfirmationEmail({
        clientName,
        vehicleInfo,
        damageType,
        serviceType,
        address,
        preferredDate,
        message,
      }),
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

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

  try {
    const { data: emailData, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "AutoGlass Pro <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🔔 Nouvelle demande - ${clientName} (${serviceType === "DOMICILE" ? "Domicile" : "Atelier"})`,
      react: AdminNotificationEmail({
        clientName,
        clientEmail,
        clientPhone,
        vehicleInfo,
        damageType,
        serviceType,
        address,
        preferredDate,
        message,
      }),
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
