"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LocationSuggestion = {
    id: string;
    name: string;
    label: string;
    type?: string;
};

type LocationAutocompleteProps = {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    inputClassName?: string;
    dropdownClassName?: string;
};

export default function LocationAutocomplete({
    label,
    value,
    placeholder = "Search for a city or place",
    onChange,
    inputClassName,
}: LocationAutocompleteProps) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [dropdownRect, setDropdownRect] = useState({ left: 0, top: 0, width: 320 });

    useEffect(() => setMounted(true), []);

    const updateDropdownPosition = () => {
        const rect = inputRef.current?.getBoundingClientRect();
        if (!rect) return;
        setDropdownRect({
            left: Math.max(8, rect.left),
            top: rect.bottom + 6,
            width: Math.max(rect.width, 256),
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        updateDropdownPosition();
        const onViewportChange = () => updateDropdownPosition();
        window.addEventListener("resize", onViewportChange);
        window.addEventListener("scroll", onViewportChange, true);

        return () => {
            window.removeEventListener("resize", onViewportChange);
            window.removeEventListener("scroll", onViewportChange, true);
        };
    }, [isOpen]);

    useEffect(() => {
        const query = value.trim();

        if (!isOpen || query.length < 2) {
            setSuggestions([]);
            setIsLoading(false);
            setSearchError("");
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            setIsLoading(true);
            setSearchError("");

            try {
                const params = new URLSearchParams({ q: query, limit: "8", lang: "en" });
                const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error("Location search is temporarily unavailable.");

                const result = (await response.json()) as {
                    features?: Array<{
                        properties?: {
                            osm_id?: number;
                            name?: string;
                            city?: string;
                            town?: string;
                            village?: string;
                            state?: string;
                            country?: string;
                            type?: string;
                        };
                    }>;
                };

                const unique = new Map<string, LocationSuggestion>();
                for (const feature of result.features ?? []) {
                    const p = feature.properties;
                    const name = p?.name ?? p?.city ?? p?.town ?? p?.village;
                    if (!name) continue;

                    const locality = p?.city ?? p?.town ?? p?.village;
                    const parts = [name];
                    if (locality && locality.toLowerCase() !== name.toLowerCase()) parts.push(locality);
                    if (p?.state && !parts.some((part) => part.toLowerCase() === p.state?.toLowerCase())) {
                        parts.push(p.state);
                    }
                    if (p?.country) parts.push(p.country);

                    const fullLabel = [...new Set(parts)].join(", ");
                    const key = fullLabel.toLowerCase();
                    if (!unique.has(key)) {
                        unique.set(key, {
                            id: `${p?.osm_id ?? key}-${key}`,
                            name,
                            label: fullLabel,
                            type: p?.type,
                        });
                    }
                }

                const q = query.toLocaleLowerCase();
                const ranked = Array.from(unique.values()).sort((a, b) => {
                    const score = (item: LocationSuggestion) => {
                        const n = item.name.toLocaleLowerCase();
                        const full = item.label.toLocaleLowerCase();
                        if (n === q) return 0;
                        if (n.startsWith(q)) return 1;
                        if (full.startsWith(q)) return 2;
                        if (n.includes(q)) return 3;
                        return 4;
                    };
                    return score(a) - score(b);
                });
                setSuggestions(ranked.slice(0, 8));
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    setSuggestions([]);
                    setSearchError("Could not load suggestions. Check your internet connection or try again.");
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }, 250);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [value, isOpen]);

    const selectSuggestion = (suggestion: LocationSuggestion) => {
        // Keep only the main place name in trip details.
        onChange(suggestion.name);
        setSuggestions([]);
        setIsOpen(false);
        setSearchError("");
    };

    const dropdown = mounted && isOpen && value.trim().length >= 2 &&
        (suggestions.length > 0 || searchError) ? createPortal(
        <div
            role="listbox"
            className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 text-slate-800 shadow-2xl"
            style={{
                position: "fixed",
                left: dropdownRect.left,
                top: dropdownRect.top,
                width: Math.min(dropdownRect.width, window.innerWidth - 16),
                zIndex: 10000,
            }}
        >
            {suggestions.map((suggestion) => (
                <button
                    key={suggestion.id}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSuggestion(suggestion)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                >
                    <span className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true">⌖</span>
                    <span className="min-w-0">
                        <span className="block text-sm font-semibold">{suggestion.name}</span>
                        <span className="block break-words text-xs font-normal text-slate-500">{suggestion.label}</span>
                    </span>
                </button>
            ))}
            {searchError && <p className="px-3 py-2 text-xs text-amber-700">{searchError}</p>}
        </div>,
        document.body
    ) : null;

    return (
        <div className="relative min-w-0">
            <label className="block" htmlFor={inputId}>{label}</label>
            <input
                ref={inputRef}
                id={inputId}
                required
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen && suggestions.length > 0}
                value={value}
                onFocus={() => {
                    setIsOpen(true);
                    window.requestAnimationFrame(updateDropdownPosition);
                }}
                onChange={(event) => {
                    onChange(event.target.value);
                    setIsOpen(true);
                    window.requestAnimationFrame(updateDropdownPosition);
                }}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        setIsOpen(false);
                        setSuggestions([]);
                    }
                }}
                className={inputClassName ?? "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}
                placeholder={placeholder}
            />

            {isLoading && isOpen && (
                <p className="mt-1 text-xs font-normal text-slate-500" role="status">Searching locations…</p>
            )}
            {dropdown}
        </div>
    );
}
