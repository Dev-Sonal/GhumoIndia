"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plane, UserRound, X } from "lucide-react";

type LoginModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const continueToWorkspace = () => {
        router.push("/dashboard");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim()) {
            setNotice("Enter your email to continue.");
            return;
        }

        continueToWorkspace();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
            <button type="button" className="absolute inset-0 cursor-default" aria-label="Close login" onClick={onClose} />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-title"
                className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] bg-white text-slate-900 shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close login"
                >
                    <X size={20} />
                </button>

                <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                    <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                        <div className="flex items-center gap-2 text-blue-600">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white">
                                <Plane size={18} className="rotate-[-25deg]" />
                            </span>
                            <span className="text-xl font-bold tracking-tight">Pilgora</span>
                        </div>

                        <h2 id="login-title" className="mt-6 max-w-md text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            It&apos;s no myth — there&apos;s a better way to plan
                        </h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-[15px]">
                            Log in or create an account to save trip details, compare stays and pick up where you left off.
                        </p>

                        <label className="mt-7 block text-sm font-medium text-slate-700">
                            Email
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setNotice("");
                                }}
                                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter your email"
                            />
                        </label>

                        {notice ? <p className="mt-2 text-sm font-medium text-rose-600">{notice}</p> : null}

                        <button type="submit" className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">
                            Continue
                        </button>

                        <div className="my-4 flex items-center gap-3 text-sm text-slate-400">
                            <span className="h-px flex-1 bg-slate-200" />
                            or
                            <span className="h-px flex-1 bg-slate-200" />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <button type="button" onClick={continueToWorkspace} className="flex h-12 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200" aria-label="Continue with Google">
                                <GoogleMark />
                            </button>
                            <button type="button" onClick={continueToWorkspace} className="flex h-12 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200" aria-label="Continue with Apple">
                                <AppleMark />
                            </button>
                            <button type="button" onClick={continueToWorkspace} className="flex h-12 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200" aria-label="Continue with Facebook">
                                <FacebookMark />
                            </button>
                        </div>

                        <label className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-800">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) => setRememberMe(event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Remember me
                        </label>

                        <p className="mt-4 max-w-md text-xs leading-5 text-slate-500">
                            By continuing, you agree to Pilgora&apos;s{" "}
                            <a href="#terms" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
                                Terms of Service
                            </a>{" "}
                            and acknowledge that you have read our{" "}
                            <a href="#privacy" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </form>

                    <div className="relative hidden min-h-[420px] items-center justify-center bg-white p-8 lg:flex">
                        <img
                            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80"
                            alt="Travellers walking through a sunlit street"
                            className="h-[420px] w-full max-w-[360px] rounded-2xl object-cover"
                        />
                        <span className="absolute right-10 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[#7ee0c4] text-slate-700 shadow-lg">
                            <UserRound size={30} strokeWidth={1.75} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GoogleMark() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-4.1 5.6-7.6 6.6l6.3 5.2C37.3 37.3 44 32 44 24c0-1.3-.1-2.7-.4-3.5z" />
        </svg>
    );
}

function AppleMark() {
    return (
        <svg width="18" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.7.7 3 .7 2-.1 2.9-2.3c1-.1 1.6-1.2 2.2-2.3-.1 0-2.1-.8-2.1-3.4zM14.6 5.8c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4z" />
        </svg>
    );
}

function FacebookMark() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#1877F2" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.27h3.34l-.53 3.49h-2.81V24C19.61 23.09 24 18.1 24 12.07z" />
        </svg>
    );
}
