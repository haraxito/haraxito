import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie?.value) {
      return false;
    }

    // Decode and validate session
    const session = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    );

    // Check if session is valid and not expired
    if (!session.authenticated || !session.expires) {
      return false;
    }

    if (Date.now() > session.expires) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
