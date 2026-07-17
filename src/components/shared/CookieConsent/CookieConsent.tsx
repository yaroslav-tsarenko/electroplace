"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Cookie, Check, Shield, BarChart3, Sparkles } from "lucide-react";

type ConsentValue = "all" | "essential" | "custom";

interface StoredConsent {
  value: ConsentValue;
  categories: { essential: true; analytics: boolean; marketing: boolean };
  timestamp: string;
}

const STORAGE_KEY = "electroplace-cookie-consent-v1";

function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredConsent;
  } catch {
    return null;
  }
}

function writeConsent(consent: StoredConsent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* noop */
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      // Small delay so it doesn't hijack the very first paint.
      const timer = window.setTimeout(() => setOpen(true), 500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setDetailsOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    writeConsent({
      value: "all",
      categories: { essential: true, analytics: true, marketing: true },
      timestamp: new Date().toISOString(),
    });
    close();
  }, [close]);

  const acceptEssential = useCallback(() => {
    writeConsent({
      value: "essential",
      categories: { essential: true, analytics: false, marketing: false },
      timestamp: new Date().toISOString(),
    });
    close();
  }, [close]);

  const saveCustom = useCallback(() => {
    writeConsent({
      value: "custom",
      categories: { essential: true, analytics, marketing },
      timestamp: new Date().toISOString(),
    });
    close();
  }, [analytics, marketing, close]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ep-cookie-title"
        >
          <motion.div
            key="ep-cookie-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#0F0D0B]/75 backdrop-blur-[3px]"
          />

          <motion.div
            key="ep-cookie-card"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--color-primary-tint)] opacity-70"
            />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)]">
                  <Cookie size={20} strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                    Your privacy
                  </span>
                  <h2
                    id="ep-cookie-title"
                    className="mt-1 font-display text-[22px] font-semibold leading-tight tracking-tight text-[color:var(--color-text)] sm:text-[24px]"
                  >
                    We use cookies to make Electroplace feel personal.
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-text-secondary)]">
                    Essential cookies keep the basket, checkout and sign-in
                    working. With your permission we also use analytics to
                    understand how the store is used, and marketing cookies to
                    show you relevant offers. You can change this any time in{" "}
                    <Link
                      href="/policies/cookies"
                      className="font-semibold text-[color:var(--color-primary)] underline hover:text-[color:var(--color-primary-hover)]"
                    >
                      Cookie preferences
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {detailsOpen && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 grid gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-2 sm:p-3">
                      <ConsentRow
                        icon={Shield}
                        title="Essential"
                        description="Required for the site to function — basket, sign-in, security."
                        checked
                        disabled
                      />
                      <ConsentRow
                        icon={BarChart3}
                        title="Analytics"
                        description="Anonymous usage stats so we can improve pages and search."
                        checked={analytics}
                        onChange={setAnalytics}
                      />
                      <ConsentRow
                        icon={Sparkles}
                        title="Marketing"
                        description="Personalised offers and remarketing on partner sites."
                        checked={marketing}
                        onChange={setMarketing}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDetailsOpen((v) => !v)}
                  className="rounded-full border border-[color:var(--color-border)] px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] sm:mr-auto"
                >
                  {detailsOpen ? "Hide preferences" : "Manage preferences"}
                </button>
                {detailsOpen ? (
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="rounded-full border border-[color:var(--color-border)] px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  >
                    Save preferences
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={acceptEssential}
                    className="rounded-full border border-[color:var(--color-border)] px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  >
                    Essential only
                  </button>
                )}
                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--color-primary)] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:shadow-[0_8px_20px_rgba(232,161,58,0.42)]"
                >
                  <Check size={13} /> Accept all
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConsentRowProps {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}

function ConsentRow({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: ConsentRowProps) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-colors ${
        disabled
          ? "cursor-not-allowed opacity-90"
          : "cursor-pointer hover:bg-[color:var(--color-bg-secondary)]"
      }`}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
        <Icon size={15} />
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-[14px] font-semibold text-[color:var(--color-text)]">
            {title}
          </span>
          {disabled && (
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-bronze)]">
              Always on
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-[color:var(--color-text-secondary)]">
          {description}
        </span>
      </span>
      <span
        aria-hidden
        className={`relative mt-1 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked
            ? "bg-[color:var(--color-primary)]"
            : "bg-[color:var(--color-bg-secondary)] ring-1 ring-inset ring-[color:var(--color-border)]"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-[2px]"
          }`}
        />
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}
