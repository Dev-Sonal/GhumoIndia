import { getLocationSuggestions } from "@/lib/travel-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.replace(/\s+/g, " ").trim() ?? "";
    const requestedLimit = Number(searchParams.get("limit") ?? "8");
    const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(Math.floor(requestedLimit), 8)) : 8;

    if (query.length < 2 || query.length > 120) {
        return Response.json({ suggestions: [] }, { status: 400 });
    }

    try {
        const suggestions = await getLocationSuggestions(query, limit);
        return Response.json(
            { suggestions },
            { headers: { "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=1800" } },
        );
    } catch {
        return Response.json({ error: "Location suggestions are temporarily unavailable." }, { status: 503 });
    }
}
