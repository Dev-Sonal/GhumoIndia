import { getTravelGuide } from "@/lib/travel-data";
import type { Coordinates } from "@/lib/travel-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const textParam = (params: URLSearchParams, name: string, limit: number) =>
    (params.get(name) ?? "").replace(/\s+/g, " ").trim().slice(0, limit);

function readCoordinates(params: URLSearchParams): Coordinates | null {
    const lat = Number(params.get("lat"));
    const lon = Number(params.get("lon"));
    return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180
        ? { lat, lon }
        : null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const destination = textParam(searchParams, "destination", 120);
    if (destination.length < 2) {
        return Response.json({ error: "A destination of at least two characters is required." }, { status: 400 });
    }

    try {
        const guide = await getTravelGuide({
            destination,
            coordinates: readCoordinates(searchParams),
            origin: textParam(searchParams, "origin", 120),
            duration: textParam(searchParams, "duration", 40),
            travellers: textParam(searchParams, "travellers", 40),
            budget: textParam(searchParams, "budget", 40),
            tripType: textParam(searchParams, "tripType", 40),
        });
        return Response.json(guide, {
            headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=600" },
        });
    } catch {
        return Response.json({ error: "Travel guidance is temporarily unavailable." }, { status: 503 });
    }
}
