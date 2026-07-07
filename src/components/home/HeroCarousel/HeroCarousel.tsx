"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Percent,
  Sparkles,
  Repeat,
  Play,
  Pause,
  Headphones,
  Laptop2,
  Smartphone,
  Tv,
  Camera,
  Home as HomeIcon,
  Gamepad2,
  Watch,
  Cable,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";

/**
 * Electroplace hero — full-bleed editorial composition with an overlay panel.
 *
 * Vertical order (structurally different from a split hero + sidebar-tiles grid):
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │  1) FULL-BLEED editorial hero — one immersive campaign visual │
 *   │     spanning the full width with a warm-scrim overlay panel   │
 *   │     anchored on the left (eyebrow · serif headline · price ·  │
 *   │     primary amber CTA + ghost secondary).                     │
 *   └───────────────────────────────────────────────────────────────┘
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │  2) 3-UP horizontal merchandising strip                       │
 *   │     [ New arrivals | Deal of the week | Trade-in · financing ]│
 *   └───────────────────────────────────────────────────────────────┘
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │  3) Category quick-access rail — icon+label chips             │
 *   └───────────────────────────────────────────────────────────────┘
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │  4) Reassurance strip (delivery · returns · warranty · rating)│
 *   └───────────────────────────────────────────────────────────────┘
 */

interface Slide {
  id: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  priceFrom: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  image: string;
}

const slides: Slide[] = [
  {
    id: "audio",
    eyebrow: "Autumn Listening Series",
    headline: "Sound, warmly considered.",
    headlineAccent: "For rooms that matter.",
    sub: "Reference wireless headphones, in-ear monitors and hi-fi from Bang & Olufsen, Sonos and Bose. Concierge listening room by appointment.",
    priceFrom: "£49",
    cta: { label: "Discover audio", href: "/catalog/audio-headphones" },
    secondary: { label: "Book a private demo", href: "/contact" },
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=2400&q=80&auto=format&fit=crop",
  },
  {
    id: "laptops",
    eyebrow: "Workshop · Creator laptops",
    headline: "Craft-grade portables,",
    headlineAccent: "tuned for the work.",
    sub: "From feather-light Chromebooks to studio MacBooks and creator PCs. Split with 0% APR interest-free finance at checkout.",
    priceFrom: "£299",
    cta: { label: "Explore laptops", href: "/catalog/laptops-computers" },
    secondary: { label: "Compare models", href: "/catalog/laptops-computers" },
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=2400&q=80&auto=format&fit=crop",
  },
  {
    id: "tv",
    eyebrow: "Cinema at Home",
    headline: "Cinema-grade viewing,",
    headlineAccent: "delivered and installed.",
    sub: "4K OLED and QLED televisions from LG, Sony and Samsung — with complimentary 5-year warranty and expert set-up.",
    priceFrom: "£399",
    cta: { label: "See television", href: "/catalog/tv-video" },
    secondary: { label: "Book installation", href: "/contact" },
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=2400&q=80&auto=format&fit=crop",
  },
  {
    id: "smart-home",
    eyebrow: "Ambient Living",
    headline: "A quieter kind",
    headlineAccent: "of smart home.",
    sub: "Voice hubs, ambient lighting, security cameras and thermostats. Matter & Thread ready, from just £29.",
    priceFrom: "£29",
    cta: { label: "Shop smart home", href: "/catalog/smart-home" },
    secondary: { label: "Curated kits", href: "/catalog?onSale=true" },
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=2400&q=80&auto=format&fit=crop",
  },
];

const promoTiles = [
  {
    id: "new-arrivals",
    eyebrow: "New arrivals",
    title: "This week's editorial drops",
    sub: "Fresh phones, televisions and audio — hand-picked.",
    href: "/catalog?sort=newest",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1593642532871-8b12e02d091c?w=1400&q=80&auto=format&fit=crop",
  },
  {
    id: "deal",
    eyebrow: "Deal of the week",
    title: "Up to 40% off select audio",
    sub: "Save on Bose, Sonos & JBL — ends Sunday.",
    href: "/catalog?onSale=true",
    icon: Percent,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80&auto=format&fit=crop",
  },
  {
    id: "trade-in",
    eyebrow: "Trade-in · 0% APR",
    title: "Upgrade with credit",
    sub: "Personal valuation up to £700 credit.",
    href: "/contact",
    icon: Repeat,
    image:
      "https://images.unsplash.com/photo-1512446733611-9099a758e63c?w=1400&q=80&auto=format&fit=crop",
  },
];

const quickAccess = [
  { label: "Audio",       icon: Headphones, href: "/catalog/audio-headphones" },
  { label: "Laptops",     icon: Laptop2,    href: "/catalog/laptops-computers" },
  { label: "Smartphones", icon: Smartphone, href: "/catalog/smartphones" },
  { label: "TV & Video",  icon: Tv,         href: "/catalog/tv-video" },
  { label: "Cameras",     icon: Camera,     href: "/catalog/cameras-photography" },
  { label: "Smart Home",  icon: HomeIcon,   href: "/catalog/smart-home" },
  { label: "Gaming",      icon: Gamepad2,   href: "/catalog/gaming" },
  { label: "Wearables",   icon: Watch,      href: "/catalog/wearables" },
  { label: "Accessories", icon: Cable,      href: "/catalog/accessories" },
];

const reassurance = [
  { icon: Truck,       label: "Free next-day delivery on £50+" },
  { icon: Repeat,      label: "30-day returns, no fuss" },
  { icon: ShieldCheck, label: "2-year Electroplace warranty" },
  { icon: Star,        label: "Rated 4.9 by Electroplace members" },
];

interface Props {
  slides?: unknown[];
  deals?: unknown[];
}

export function HeroCarousel(_props: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const touchStart = useRef<number | null>(null);
  const slide = slides[current];

  const go = useCallback(
    (idx: number) => {
      setDir(idx > current ? 1 : -1);
      const wrapped = ((idx % slides.length) + slides.length) % slides.length;
      setCurrent(wrapped);
    },
    [current],
  );
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setCurrent((p) => (p + 1) % slides.length);
    }, 7500);
    return () => clearInterval(id);
  }, [paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <section
      className="relative w-full bg-[color:var(--color-bg)]"
      aria-label="Featured campaigns"
    >
      {/* ── 1. FULL-BLEED editorial hero with overlay content panel ── */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Full-bleed campaign visual */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${slide.id}`}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Warm scrim — layered gradient for uniform image treatment */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_50%,rgba(26,23,20,0.92)_0%,rgba(26,23,20,0.78)_35%,rgba(26,23,20,0.35)_65%,rgba(26,23,20,0.15)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg)] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,161,58,0.02)_0%,transparent_20%,transparent_80%,rgba(181,113,74,0.05)_100%)]" />
          </motion.div>
        </AnimatePresence>

        {/* Subtle warm-dot texture */}
        <div aria-hidden className="pointer-events-none absolute inset-0 warm-dots opacity-20" />

        <div className="relative mx-auto flex min-h-[520px] max-w-[1280px] flex-col items-start justify-center gap-6 px-4 py-16 sm:px-6 md:min-h-[600px] md:py-24 lg:min-h-[640px] lg:px-8">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex max-w-[640px] flex-col gap-6 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/85 p-8 backdrop-blur-md md:p-10"
            >
              {/* Editorial eyebrow */}
              <span className="inline-flex w-fit items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-bronze)]">
                <span className="inline-block h-px w-8 bg-[color:var(--color-bronze)]" />
                {slide.eyebrow}
              </span>

              {/* Confident serif headline */}
              <h1 className="font-display text-[2.4rem] font-semibold leading-[1.04] tracking-tight text-[color:var(--color-text)] md:text-[3rem] lg:text-[3.5rem]">
                {slide.headline}
                <br />
                <span
                  className="italic text-[color:var(--color-primary)]"
                  style={{
                    fontVariationSettings: '"SOFT" 100, "WONK" 1',
                  }}
                >
                  {slide.headlineAccent}
                </span>
              </h1>

              <p className="max-w-lg text-[15.5px] leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
                {slide.sub}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 py-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                    From
                  </span>
                  <span className="font-mono text-[17px] font-bold tabular-nums text-[color:var(--color-primary)]">
                    {slide.priceFrom}
                  </span>
                </div>
                <Link
                  href={slide.cta.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-[13.5px] font-semibold text-[color:var(--color-primary-fg)] shadow-[0_6px_20px_rgba(232,161,58,0.30)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:shadow-[0_10px_28px_rgba(232,161,58,0.45)]"
                >
                  {slide.cta.label}
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href={slide.secondary.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-5 py-3 text-[13.5px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide progress + controls — bottom-anchored */}
          <div className="relative mt-2 flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={[
                    "h-[3px] rounded-full transition-all",
                    i === current
                      ? "w-12 bg-[color:var(--color-primary)]"
                      : "w-6 bg-[color:var(--color-text)]/25 hover:bg-[color:var(--color-text)]/45",
                  ].join(" ")}
                />
              ))}
              <span className="ml-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)] tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play" : "Pause"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                {paused ? <Play size={13} /> : <Pause size={13} />}
              </button>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. 3-UP editorial merchandising strip ─────────────────── */}
      <div className="border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {promoTiles.map((tile) => (
              <Link
                key={tile.id}
                href={tile.href}
                className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-6 text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-[0_16px_36px_-14px_rgba(232,161,58,0.28)]"
              >
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="absolute inset-0 -z-0 object-cover opacity-[0.10] transition-transform duration-700 group-hover:scale-105"
                  aria-hidden
                />
                <div className="absolute inset-0 -z-0 bg-gradient-to-br from-[color:var(--color-bg-elevated)]/95 via-[color:var(--color-bg-elevated)]/80 to-transparent" aria-hidden />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-primary-tint)] px-3 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.20em] text-[color:var(--color-primary)]">
                    <tile.icon size={11} />
                    {tile.eyebrow}
                  </span>
                  <ArrowRight
                    size={15}
                    className="text-[color:var(--color-bronze)] transition-transform group-hover:translate-x-0.5"
                  />
                </div>
                <div className="relative z-10">
                  <div className="font-display text-[20px] font-semibold leading-tight tracking-tight">
                    {tile.title}
                  </div>
                  <div className="mt-1.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
                    {tile.sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Category quick-access rail — icon+label chips ──────── */}
      <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[color:var(--color-bronze)]" />
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-bronze)]">
              The Departments
            </span>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
          >
            All departments <ArrowRight size={11} />
          </Link>
        </div>
        <div className="scrollbar-none flex items-stretch gap-2 overflow-x-auto">
          {quickAccess.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group flex min-w-[128px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-5 py-4 text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-[0_10px_22px_-14px_rgba(232,161,58,0.35)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)] transition-transform group-hover:scale-105">
                <c.icon size={18} strokeWidth={1.75} />
              </span>
              <span className="whitespace-nowrap text-[12.5px] font-semibold tracking-tight">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4. Reassurance strip — hairline warm cards ────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {reassurance.map((r) => (
            <div
              key={r.label}
              className="inline-flex items-center gap-2.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3.5 py-2.5"
            >
              <r.icon size={16} className="shrink-0 text-[color:var(--color-teal)]" />
              <span className="text-[12.5px] font-semibold text-[color:var(--color-text)]">
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
