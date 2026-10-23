import { NextResponse } from "next/server";

export async function GET() {
  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;

  if (!authBaseUrl || !jwksUrl) {
    return NextResponse.json(
      { error: "Neon Auth environment variables missing" },
      { status: 500 }
    );
  }

  try {
    // Ping Neon Auth JWKS to verify service connectivity and keys accessibility
    const res = await fetch(jwksUrl);
    const jwks = await res.json();

    return NextResponse.json({
      success: true,
      service: "Neon Auth (Managed Better Auth)",
      authBaseUrl,
      jwksUrl,
      keysCount: Array.isArray(jwks?.keys) ? jwks.keys.length : 0,
      connected: res.ok,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to connect to Neon Auth service", details: String(err) },
      { status: 500 }
    );
  }
}
