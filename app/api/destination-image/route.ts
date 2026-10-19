
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3600;

type CommonsMetadata = {
    value?: string;
};

type CommonsImageInfo = {
    url?: string;
    thumburl?: string;
    descriptionurl?: string;
    width?: number;
    height?: number;
    mime?: string;
    extmetadata?: Record<string, CommonsMetadata>;
};

type CommonsPage = {
    title?: string;
    imageinfo?: CommonsImageInfo[];
};

type CommonsResponse = {
    query?: {
        pages?: Record<string, CommonsPage>;
    };
    error?: {
        code?: string;
        info?: string;
    };
};

type DestinationImage = {
    url: string;
    title: string;
    description: string;
    author: string;
    license: string;
    filePageUrl: string;
};

type ImageCandidate = DestinationImage & {
    score: number;
    isLandscape: boolean;
    mime: string;
};

function cleanMetadata(value?: string): string {
    return (value ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&#160;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function normalize(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function getDestinationWords(destination: string): string[] {
    return normalize(destination)
        .split(" ")
        .filter((word) => word.length > 1);
}

function getRelevanceScore(
    title: string,
    description: string,
    destination: string,
): number {
    const normalizedDestination = normalize(destination);
    const normalizedTitle = normalize(title);
    const normalizedDescription = normalize(description);
    const words = getDestinationWords(destination);

    if (!words.length) return 0;

    const titleMatches = words.filter((word) =>
        normalizedTitle.split(" ").includes(word),
    ).length;

    const descriptionMatches = words.filter((word) =>
        normalizedDescription.split(" ").includes(word),
    ).length;

    const exactTitleMatch =
        normalizedTitle.includes(normalizedDestination);

    const indiaMention =
        /\bindia\b|\bindian\b/.test(normalizedDescription);

    const mapPenalty =
        /\b(map|locator|location map|blank map|outline map)\b/i.test(
            `${title} ${description}`,
        )
            ? 8
            : 0;

    return (
        (exactTitleMatch ? 10 : 0) +
        titleMatches * 4 +
        descriptionMatches * 2 +
        (indiaMention ? 2 : 0) -
        mapPenalty
    );
}

function hasForeignLocationMismatch(
    title: string,
    description: string,
): boolean {
    const text = normalize(`${title} ${description}`);

    // Reject obvious foreign matches. This is a safeguard, not
    // a complete geographic verification system.
    const foreignLocationPatterns = [
        /\bgoa lawah\b/,
        /\bbali\b/,
        /\bindonesia\b/,
        /\bportugal\b/,
        /\bwest africa\b/,
    ];

    return foreignLocationPatterns.some((pattern) => pattern.test(text));
}

async function searchCommons(
    searchTerm: string,
): Promise<CommonsPage[]> {
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        generator: "search",
        gsrnamespace: "6",
        gsrlimit: "30",
        gsrsearch: searchTerm,
        prop: "imageinfo",
        iiprop: "url|size|mime|extmetadata",
        iiurlwidth: "1800",
    });

    const response = await fetch(
        `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
                "User-Agent": "PilgoraTravelPlanner/1.0",
            },
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(10000),
        },
    );

    if (!response.ok) {
        throw new Error(`Wikimedia returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as CommonsResponse;

    if (data.error) {
        throw new Error(
            `Wikimedia API error: ${data.error.info ?? data.error.code ?? "Unknown error"
            }`,
        );
    }

    return Object.values(data.query?.pages ?? {});
}

export async function GET(request: NextRequest) {
    const destination = request.nextUrl.searchParams
        .get("destination")
        ?.trim();

    if (
        !destination ||
        destination.length < 2 ||
        destination.length > 100
    ) {
        return NextResponse.json(
            {
                image: null,
                reason: "Please provide a valid destination.",
            },
            { status: 400 },
        );
    }

    try {
        // India-only searches. Specific tourism terms are tried first.
        const searchTerms = [
            `${destination} India tourist attraction`,
            `${destination} India landscape`,
            `${destination} India beach monument`,
            `${destination} India`,
        ];

        const pagesByTitle = new Map<string, CommonsPage>();

        for (const term of searchTerms) {
            const pages = await searchCommons(term);

            for (const page of pages) {
                if (page.title) {
                    pagesByTitle.set(page.title, page);
                }
            }

            // Continue searching until enough candidates are collected.
            if (pagesByTitle.size >= 45) break;
        }

        const candidates: ImageCandidate[] = Array.from(
            pagesByTitle.values(),
        )
            .map((page) => {
                const info = page.imageinfo?.[0];
                const metadata = info?.extmetadata ?? {};
                const title = page.title ?? "";
                const description = cleanMetadata(
                    metadata.ImageDescription?.value,
                );

                const imageUrl = info?.thumburl ?? info?.url;
                const filePageUrl = info?.descriptionurl ?? "";
                const score = getRelevanceScore(
                    title,
                    description,
                    destination,
                );

                const hasDimensions =
                    typeof info?.width === "number" &&
                    typeof info?.height === "number";

                const isLandscape =
                    hasDimensions &&
                    info.width > info.height;

                const isMap =
                    /\b(map|locator|location map|blank map|outline map)\b/i.test(
                        `${title} ${description}`,
                    );

                return {
                    url: imageUrl ?? "",
                    title: title.replace(/^File:/i, ""),
                    description,
                    author: cleanMetadata(
                        metadata.Artist?.value ??
                        metadata.Credit?.value ??
                        "Author not listed",
                    ),
                    license: cleanMetadata(
                        metadata.LicenseShortName?.value ??
                        metadata.License?.value ??
                        "See file page for license details",
                    ),
                    filePageUrl,
                    score,
                    isLandscape,
                    mime: info?.mime ?? "",
                    isMap,
                };
            })
            .filter((image) => {
                const validImageUrl =
                    image.url.startsWith("https://upload.wikimedia.org/");

                const validFilePage =
                    image.filePageUrl.startsWith(
                        "https://commons.wikimedia.org/wiki/File:",
                    );

                const supportedImage =
                    image.mime.startsWith("image/");

                const destinationRelevant = image.score >= 4;

                const foreignMismatch = hasForeignLocationMismatch(
                    image.title,
                    image.description,
                );

                return (
                    validImageUrl &&
                    validFilePage &&
                    supportedImage &&
                    image.isLandscape &&
                    !image.isMap &&
                    destinationRelevant &&
                    !foreignMismatch
                );
            })
            .sort((a, b) => b.score - a.score);

        const best = candidates[0];

        if (!best) {
            return NextResponse.json({
                image: null,
                reason:
                    "No sufficiently relevant destination photograph was found. Try another destination name.",
            });
        }

        const image: DestinationImage = {
            url: best.url,
            title: best.title,
            description: best.description,
            author: best.author,
            license: best.license,
            filePageUrl: best.filePageUrl,
        };

        return NextResponse.json({ image });
    } catch (error) {
        console.error("Destination image API error:", error);

        return NextResponse.json(
            {
                image: null,
                reason:
                    error instanceof Error
                        ? error.message
                        : "Destination image service is temporarily unavailable.",
            },
            { status: 502 },
        );
    }
}
