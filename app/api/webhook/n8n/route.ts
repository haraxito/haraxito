import { NextResponse } from "next/server";
import { sendToN8n, type N8nWebhookPayload } from "@/lib/n8n";

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
