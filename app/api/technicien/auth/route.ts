import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Technicien password - Must be set via TECHNICIEN_PASSWORD environment variable
const TECHNICIEN_PASSWORD = process.env.TECHNICIEN_PASSWORD;

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    if (!TECHNICIEN_PASSWORD) {
      console.error("TECHNICIEN_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Configuration serveur incomplète" },
        { status: 500 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis" },
        { status: 400 }
      );
    }

    if (password !== TECHNICIEN_PASSWORD) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Create a simple session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
        expires: Date.now() + SESSION_DURATION,
      })
    ).toString("base64");

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("technicien_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1000, // in seconds
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("technicien_session");
  return NextResponse.json({ success: true });
}
