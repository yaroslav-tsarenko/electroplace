"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FaInstagram } from "react-icons/fa6";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Truck,
  RotateCcw,
  ShieldCheck,
  Globe,
  Repeat,
  Lock,
  ChevronDown,
  Percent,
  Sparkles,
  Headphones,
} from "lucide-react";
import { ElectroplaceLogo } from "../ElectroplaceLogo";
import { brand } from "@/lib/brand";
import { useCurrency } from "@/providers/CurrencyProvider";
import visaLogo from "@/assets/visa-logo.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import pciDssLogo from "@/assets/pci-dss-compliant-logo-vector.svg";

/**
 * Electroplace footer — tiered editorial "brand-led" layout.
 *
 * Bands (top → bottom):
 *   A. Bold full-width top conversion band — Newsletter + Concierge/Trade-in
 *   B. Brand-forward middle tier — LARGE left brand block + FEWER editorial
 *      link groups (Shop by department · Customer service · Company · Help/legal)
 *   C. Trust band — payments · security badges · Trustpilot · social
 *   D. Bottom legal bar — copyright · registered company details ·
 *      country/currency selector · Privacy/Terms/Cookies
 */

// Fallback links — only shown if the API doesn't return any categories. The
// live list below overrides this at runtime, so we point to /catalog root to
// avoid 404s when the vendor feed hasn't been imported yet.
const fallbackDepartmentLinks = [
  { href: "/catalog", label: "Browse full catalogue" },
];

const customerServiceLinks = [
  { href: "/contact",              label: "Concierge support" },
  { href: "/account/orders",       label: "Track my order" },
  { href: "/policies/returns",     label: "Returns & refunds" },
  { href: "/policies/warranty",    label: "Warranty & repairs" },
  { href: "/policies/shipping",    label: "Delivery information" },
  { href: "/policies/payment",     label: "Payment options" },
  { href: "/contact",              label: "Book installation" },
  { href: "/contact",              label: "Trade-in valuation" },
];

const companyLinks = [
  { href: "/about",                label: "About Electroplace" },
  { href: "/contact",              label: "Careers" },
  { href: "/contact",              label: "Press & media" },
  { href: "/policies",             label: "Sustainability" },
  { href: "/contact",              label: "Affiliates" },
  { href: "/contact",              label: "For business" },
];

const helpLegalLinks = [
  { href: "/faq",                  label: "FAQ" },
  { href: "/policies/privacy",     label: "Privacy centre" },
  { href: "/policies/terms",       label: "Terms & conditions" },
  { href: "/policies/cookies",     label: "Cookie preferences" },
  { href: "/policies",             label: "Modern Slavery statement" },
  { href: "/policies",             label: "WEEE recycling" },
];

const legalLinks = [
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms",   label: "Terms" },
  { href: "/policies/cookies", label: "Cookies" },
];

const trustBadges = [
  { icon: Truck,       label: "Free delivery over £100" },
  { icon: RotateCcw,   label: "30-day easy returns" },
  { icon: ShieldCheck, label: "2-year Electroplace warranty" },
  { icon: Repeat,      label: "Trade-in credit" },
];

const socialLinks = [
  {
    icon: FaInstagram,
    label: "Instagram · @electroplace.uk",
    href: "https://www.instagram.com/electroplace.uk/",
  },
];

interface Group {
  key: string;
  title: string;
  items: Array<{ href: string; label: string }>;
}

const staticGroups: Group[] = [
  { key: "service", title: "Customer service", items: customerServiceLinks },
  { key: "company", title: "Company",           items: companyLinks },
  { key: "help",    title: "Help & legal",      items: helpLegalLinks },
];

function LinkGroup({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--color-text)]/10 md:border-b-0">
      {/* Mobile accordion trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
      >
        <span className="font-display text-[15.5px] font-semibold tracking-tight text-[color:var(--color-text)]">
          {group.title}
        </span>
        <ChevronDown
          size={15}
          className={`text-[color:var(--color-bronze)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* Desktop editorial header */}
      <h3 className="hidden pb-5 font-display text-[16px] font-semibold tracking-tight text-[color:var(--color-text)] md:block">
        <span className="relative inline-block after:absolute after:-bottom-2 after:left-0 after:h-px after:w-8 after:rounded-full after:bg-[color:var(--color-primary)]">
          {group.title}
        </span>
      </h3>
      <ul
        className={`grid grid-cols-1 gap-y-2.5 pb-4 md:gap-y-3 ${open ? "grid" : "hidden md:grid"}`}
        aria-hidden={!open}
      >
        {group.items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="text-[13.5px] text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)]"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LiveCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export function Footer() {
  const t = useTranslations("footer");
  const { currency, symbol } = useCurrency();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [liveCategories, setLiveCategories] = useState<LiveCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLiveCategories(data);
      })
      .catch(() => {});
  }, []);

  const departmentLinks =
    liveCategories.length > 0
      ? liveCategories.slice(0, 9).map((c) => ({
          href: `/catalog/${c.slug}`,
          label: c.name,
        }))
      : fallbackDepartmentLinks;

  const groups: Group[] = [
    { key: "shop", title: "Shop by department", items: departmentLinks },
    ...staticGroups,
  ];

  return (
    <footer className="mt-auto" role="contentinfo">
      {/* ── A · TOP CONVERSION BAND ────────────────────────────────
           Bold full-width band led by newsletter + concierge callout.
      */}
      <div className="relative bg-[#221E1A]">
        <div className="mx-auto grid max-w-[1280px] gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[2fr_1fr] lg:gap-6 lg:px-8">
          {/* Newsletter */}
          <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-8 md:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--color-primary-tint)] opacity-80" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-8 h-64 w-64 rounded-full bg-[color:var(--color-bronze-tint)] opacity-60" />
            <div aria-hidden className="pointer-events-none absolute inset-0 warm-dots opacity-15" />

            <div className="relative flex items-center gap-2.5">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[color:var(--color-primary)] px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.20em] text-[color:var(--color-primary-fg)]">
                <Sparkles size={12} /> Members-only
              </span>
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                Enjoy 10% off your first order over £100
              </span>
            </div>

            <div className="relative">
              <h2 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-[color:var(--color-text)] md:text-[32px]">
                Editorial deals, drops & price alerts —{" "}
                <span
                  className="italic text-[color:var(--color-primary)]"
                  style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
                >
                  straight to your inbox.
                </span>
              </h2>
              <p className="mt-3 max-w-lg text-[14px] text-[color:var(--color-text-secondary)]">
                Join 120,000+ curated shoppers who receive weekly private deals,
                early access to clearance and a heads-up on restocks. One click
                to unsubscribe.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                try {
                  await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                } catch {
                  /* silent */
                }
                setSubscribed(true);
                setEmail("");
              }}
              className="relative flex flex-col gap-2 sm:flex-row"
              aria-label="Subscribe to Electroplace newsletter"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.co.uk"
                className="min-w-0 flex-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-5 py-3.5 text-[14.5px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] transition-all focus:border-[color:var(--color-primary)] focus:outline-none focus:shadow-[0_0_0_4px_rgba(232,161,58,0.14)]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--color-primary)] px-6 py-3.5 text-[13.5px] font-bold text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:shadow-[0_8px_24px_rgba(232,161,58,0.42)]"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
            {subscribed ? (
              <p className="relative inline-flex items-center gap-2 text-[13px] font-semibold text-[color:var(--color-teal)]">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-teal)]" />
                Thanks — your 10% off code is on its way.
              </p>
            ) : (
              <p className="relative text-[11.5px] text-[color:var(--color-text-tertiary)]">
                By subscribing you agree to our{" "}
                <Link href="/policies/privacy" className="underline hover:text-[color:var(--color-primary)]">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </div>

          {/* Concierge · Trade-in */}
          <Link
            href="/contact"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[color:var(--color-primary)]/25 bg-gradient-to-br from-[#3A2E1C] via-[#2C271F] to-[#221E1A] p-8 text-[color:var(--color-text)] transition-all hover:shadow-[0_16px_36px_-14px_rgba(232,161,58,0.35)]"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 warm-dots opacity-30" />
            <div className="relative z-10 flex items-center gap-2">
              <Repeat size={16} className="text-[color:var(--color-primary)]" />
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                Concierge · trade-in credit
              </span>
            </div>
            <div className="relative z-10 mt-4">
              <div className="font-display text-[22px] font-semibold leading-tight tracking-tight">
                Level up your kit —{" "}
                <span
                  className="italic text-[color:var(--color-primary)]"
                  style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
                >
                  up to £700 credit.
                </span>
              </div>
              <p className="mt-2 text-[13.5px] text-[color:var(--color-text-secondary)]">
                Trade in your old phone, laptop or console. Personal valuation,
                credited within three business days.
              </p>
            </div>
            <div className="relative z-10 mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-primary)] transition-transform group-hover:translate-x-0.5">
              Start trade-in <ArrowRight size={13} />
            </div>
          </Link>
        </div>
      </div>

      {/* ── B · BRAND-FORWARD NAVIGATION TIER ──────────────────────
           Large left brand block (logo, tagline, contact, address) +
           four larger, more editorial link groups on the right —
           not a dense equal-column grid.
      */}
      <div className="relative bg-[#1A1714] text-[color:var(--color-text)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 warm-dots opacity-15" />
        <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_2fr] lg:gap-14 lg:px-8">
          {/* Big brand block */}
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Electroplace">
              <ElectroplaceLogo size={26} tone="light" />
            </Link>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-[color:var(--color-text-secondary)]">
              Electroplace is a warm, considered electronics concept store based
              in Birmingham, England. We curate audio, laptops, smartphones,
              televisions, cameras, smart home, gaming, wearables and
              accessories — with honest advice and no-fuss returns.
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-[12.5px] text-[color:var(--color-text)]/85"
                >
                  <Icon size={13} className="shrink-0 text-[color:var(--color-primary)]" />
                  <span className="line-clamp-1">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-2 text-[13.5px] text-[color:var(--color-text-secondary)]">
              <a href={`mailto:${brand.contact.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-[color:var(--color-primary)]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-bg-elevated)] text-[color:var(--color-bronze)]">
                  <Mail size={13} />
                </span>
                {brand.contact.email}
              </a>
              <a href={brand.contact.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-[color:var(--color-primary)]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-bg-elevated)] text-[color:var(--color-bronze)]">
                  <Phone size={13} />
                </span>
                {brand.contact.phone}
              </a>
              <span className="inline-flex items-start gap-2 text-[color:var(--color-text-secondary)]">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-bg-elevated)] text-[color:var(--color-bronze)]">
                  <MapPin size={13} />
                </span>
                <span className="leading-relaxed">
                  {brand.company.address.line1},<br />
                  {brand.company.address.line2}, {brand.company.address.city},<br />
                  {brand.company.address.region}, {brand.company.address.postcode}
                </span>
              </span>
            </div>

            <Link
              href="/catalog?onSale=true"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-4 py-2.5 text-[12.5px] font-bold text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:shadow-[0_8px_20px_rgba(232,161,58,0.35)]"
            >
              <Percent size={13} /> Members-only deals
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Right — four larger editorial groups */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2 lg:grid-cols-4">
            {groups.map((g) => (
              <LinkGroup key={g.key} group={g} />
            ))}
          </div>
        </div>
      </div>

      {/* ── C · TRUST BAND ────────────────────────────────────────── */}
      <div className="relative bg-[#1A1714] text-[color:var(--color-text)]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 border-t border-[color:var(--color-border)] px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
          {/* Payments + security */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
              We accept:
            </span>
            {[
              { src: visaLogo, alt: "Visa", height: 22 },
              { src: mastercardLogo, alt: "Mastercard", height: 20 },
              { src: pciDssLogo, alt: "PCI DSS Compliant", height: 26 },
            ].map(({ src, alt, height }) => (
              <span
                key={alt}
                className="inline-flex h-10 items-center rounded-lg border border-[color:var(--color-border)] bg-[#F4EFE8] px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src.src}
                  alt={alt}
                  style={{
                    height,
                    width: "auto",
                    maxWidth: "none",
                    display: "inline-block",
                  }}
                  className="shrink-0"
                />
              </span>
            ))}
            <span className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-text)]/85">
              <Lock size={11} className="text-[color:var(--color-teal)]" />
              256-bit SSL
            </span>
          </div>

          {/* Social */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
              Follow us:
            </span>
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 text-[color:var(--color-text)]/85 transition-all hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                <Icon size={13} />
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                  @electroplace.uk
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── D · LEGAL BAR ─────────────────────────────────────────── */}
      <div className="relative bg-[#0F0D0B] text-[color:var(--color-text)]/70">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-col gap-1 text-[12px]">
            <p>{t("copyright", { year: currentYear, storeName: brand.displayName })}</p>
            <p className="text-[11.5px] text-[color:var(--color-text)]/55">
              {brand.company.legalName} · Company No. {brand.company.number} ·{" "}
              {brand.company.address.line1}, {brand.company.address.line2},{" "}
              {brand.company.address.city}, {brand.company.address.postcode},{" "}
              {brand.company.address.country}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text)]/85">
              <Globe size={11} className="text-[color:var(--color-primary)]" />
              <span>United Kingdom · English · {currency} {symbol}</span>
            </div>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[12px] text-[color:var(--color-text)]/60 transition-colors hover:text-[color:var(--color-primary)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-[12px] text-[color:var(--color-text)]/60 transition-colors hover:text-[color:var(--color-primary)]"
              >
                <Headphones size={11} /> Concierge support
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
