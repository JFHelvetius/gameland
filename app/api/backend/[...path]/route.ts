import { NextRequest, NextResponse } from "next/server";

// API_URL es server-only (sin NEXT_PUBLIC_): se lee en runtime, no al compilar.
// Cambiar el tunnel no requiere rebuild — solo actualizar la env var en Vercel.
const BACKEND = process.env.API_URL ?? "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const joined = path.join("/");
  const qs = req.nextUrl.search;
  const target = `${BACKEND}/${joined}${qs}`;

  // Los downloads son ficheros grandes — redirigir al tunnel directamente
  // evita el límite de 4.5 MB de las funciones serverless de Vercel Hobby.
  if (joined.startsWith("download/")) {
    return NextResponse.redirect(target);
  }

  try {
    const upstream = await fetch(target, {
      headers: { "bypass-tunnel-reminder": "1" },
      cache: "no-store",
    });

    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/octet-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 503 });
  }
}
