// Types for webhook payload
export interface N8nWebhookPayload {
  event: "new_booking" | "booking_updated" | "booking_cancelled";
  timestamp: string;
  data: {
    id?: number;
    clientName: string;
    clientEmail?: string;
    clientPhone: string;
    vehicleInfo: string;
    serviceType: "DOMICILE" | "ATELIER";
    address?: string;
    preferredDate?: string;
    message?: string;
    status: string;
  };
  metadata: {
    source: string;
    version: string;
  };
}

// Helper to send webhook (non-blocking, fire-and-forget)
export async function sendToN8n(payload: N8nWebhookPayload): Promise<boolean> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("[n8n] Webhook URL not configured, skipping");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Source": "parebrise-instant",
        ...(process.env.N8N_WEBHOOK_SECRET && {
          "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET,
        }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[n8n] Webhook failed: ${response.status}`);
      return false;
    }

    console.log("[n8n] Webhook sent successfully");
    return true;
  } catch (error) {
    console.error("[n8n] Webhook error:", error);
    return false;
  }
}
