import { NextResponse } from "next/server";

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

// Manual trigger endpoint for testing
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload: N8nWebhookPayload = {
      event: body.event || "new_booking",
      timestamp: new Date().toISOString(),
      data: body.data,
      metadata: {
        source: "parebrise-instant",
        version: "1.0",
      },
    };

    const success = await sendToN8n(payload);

    return NextResponse.json({
      success,
      message: success
        ? "Webhook sent successfully"
        : "Webhook not configured or failed",
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = !!process.env.N8N_WEBHOOK_URL;

  return NextResponse.json({
    status: "ok",
    n8n: isConfigured ? "configured" : "not configured",
    endpoint: isConfigured ? "ready" : "waiting for N8N_WEBHOOK_URL env var",
  });
}
