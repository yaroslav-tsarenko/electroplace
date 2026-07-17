"use client";

import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User as UserIcon,
  Shield,
  ChevronDown,
  ChevronRight,
  Heart,
  Package,
  MapPin,
  HelpCircle,
  Truck,
  GitCompare,
  LayoutGrid,
  Headphones,
  Laptop2,
  Smartphone,
  Tv,
  Camera,
  Home as HomeIcon,
  Gamepad2,
  Watch,
  Cable,
  Sparkles,
  ArrowRight,
  Trash2,
  Star,
  Percent,
  Repeat,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import { ElectroplaceLogo } from "../ElectroplaceLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  children?: Category[];
}

const DEPARTMENTS: Array<{
  slug: string;
  name: string;
  short: string;
  Icon: React.ElementType;
  tagline: string;
  featured: { label: string; slug: string }[];
  promo: { title: string; subtitle: string; href: string; badge: string };
}> = [
  {
    slug: "audio-headphones",
    name: "Audio & Headphones",
    short: "Audio",
    Icon: Headphones,
    tagline: "Reference cans, IEMs, soundbars & speakers — curated for warm, honest sound.",
    featured: [
      { label: "Wireless headphones", slug: "audio-headphones" },
      { label: "In-ear monitors", slug: "audio-headphones" },
      { label: "Wireless speakers", slug: "audio-headphones" },
      { label: "Home audio & hi-fi", slug: "audio-headphones" },
      { label: "Soundbars", slug: "tv-video" },
      { label: "Studio microphones", slug: "audio-headphones" },
    ],
    promo: {
      title: "Bang & Olufsen · Bose · Sonos",
      subtitle: "Concierge listening room — book a private demo",
      href: "/catalog/audio-headphones",
      badge: "Boutique",
    },
  },
  {
    slug: "laptops-computers",
    name: "Laptops & Computers",
    short: "Laptops",
    Icon: Laptop2,
    tagline: "Portable powerhouses, workstations, storage & components.",
    featured: [
      { label: "Ultrabooks", slug: "laptops-computers" },
      { label: "Creator laptops", slug: "laptops-computers" },
      { label: "Chromebooks", slug: "laptops-computers" },
      { label: "Desktop PCs", slug: "laptops-computers" },
      { label: "Monitors", slug: "laptops-computers" },
      { label: "Storage & SSDs", slug: "laptops-computers" },
    ],
    promo: {
      title: "MacBook & Surface",
      subtitle: "Interest-free finance available on selected models",
      href: "/catalog/laptops-computers",
      badge: "Finance",
    },
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    short: "Mobile",
    Icon: Smartphone,
    tagline: "Flagship handsets, SIM-free, upgrades and considered trade-ins.",
    featured: [
      { label: "iPhone", slug: "smartphones" },
      { label: "Samsung Galaxy", slug: "smartphones" },
      { label: "Google Pixel", slug: "smartphones" },
      { label: "SIM-free phones", slug: "smartphones" },
      { label: "Certified refurbished", slug: "smartphones" },
      { label: "Cases & screens", slug: "accessories" },
    ],
    promo: {
      title: "Trade in your phone",
      subtitle: "Personal valuation — up to £700 credit",
      href: "/catalog/smartphones",
      badge: "Trade-in",
    },
  },
  {
    slug: "tv-video",
    name: "TV & Video",
    short: "TV",
    Icon: Tv,
    tagline: "4K OLED, QLED, cinema projectors & streaming — set up in your home.",
    featured: [
      { label: "OLED televisions", slug: "tv-video" },
      { label: "QLED televisions", slug: "tv-video" },
      { label: "85\" and larger", slug: "tv-video" },
      { label: "Streaming devices", slug: "tv-video" },
      { label: "Home cinema projectors", slug: "tv-video" },
      { label: "Blu-ray players", slug: "tv-video" },
    ],
    promo: {
      title: "Complimentary 5-year warranty",
      subtitle: "On selected LG, Sony & Samsung televisions",
      href: "/catalog/tv-video",
      badge: "5-yr care",
    },
  },
  {
    slug: "cameras-photography",
    name: "Cameras & Photography",
    short: "Cameras",
    Icon: Camera,
    tagline: "Mirrorless, DSLR, medium-format, drones and glass.",
    featured: [
      { label: "Mirrorless cameras", slug: "cameras-photography" },
      { label: "DSLR cameras", slug: "cameras-photography" },
      { label: "Action cameras", slug: "cameras-photography" },
      { label: "Drones", slug: "cameras-photography" },
      { label: "Prime & zoom lenses", slug: "cameras-photography" },
      { label: "Tripods & gimbals", slug: "cameras-photography" },
    ],
    promo: {
      title: "Canon · Sony · DJI",
      subtitle: "Bundled lens or memory-card gift with kit",
      href: "/catalog/cameras-photography",
      badge: "Bundle",
    },
  },
  {
    slug: "smart-home",
    name: "Smart Home",
    short: "Smart Home",
    Icon: HomeIcon,
    tagline: "Voice hubs, lighting, security & climate — designed to disappear.",
    featured: [
      { label: "Voice assistants", slug: "smart-home" },
      { label: "Ambient lighting", slug: "smart-home" },
      { label: "Security cameras", slug: "smart-home" },
      { label: "Smart heating", slug: "smart-home" },
      { label: "Robot vacuums", slug: "smart-home" },
      { label: "Smart plugs", slug: "smart-home" },
    ],
    promo: {
      title: "Curated smart-home kits",
      subtitle: "Matter & Thread ready, from £59",
      href: "/catalog/smart-home",
      badge: "Curated",
    },
  },
  {
    slug: "gaming",
    name: "Gaming",
    short: "Gaming",
    Icon: Gamepad2,
    tagline: "Consoles, games, VR and boutique-tuned accessories.",
    featured: [
      { label: "PlayStation 5", slug: "gaming" },
      { label: "Xbox Series X|S", slug: "gaming" },
      { label: "Nintendo Switch", slug: "gaming" },
      { label: "Premium headsets", slug: "gaming" },
      { label: "Pro controllers", slug: "gaming" },
      { label: "VR headsets", slug: "gaming" },
    ],
    promo: {
      title: "Console bundles",
      subtitle: "Feature game + extra pad included",
      href: "/catalog/gaming",
      badge: "Bundle",
    },
  },
  {
    slug: "wearables",
    name: "Wearables",
    short: "Wearables",
    Icon: Watch,
    tagline: "Smartwatches and fitness trackers with considered design.",
    featured: [
      { label: "Apple Watch", slug: "wearables" },
      { label: "Samsung Galaxy Watch", slug: "wearables" },
      { label: "Garmin", slug: "wearables" },
      { label: "Fitness trackers", slug: "wearables" },
      { label: "Kids' watches", slug: "wearables" },
      { label: "Straps & bands", slug: "wearables" },
    ],
    promo: {
      title: "New season smartwatches",
      subtitle: "From £129 with a complimentary strap",
      href: "/catalog/wearables",
      badge: "New in",
    },
  },
  {
    slug: "accessories",
    name: "Accessories",
    short: "Accessories",
    Icon: Cable,
    tagline: "Chargers, cables, power banks and considered cases.",
    featured: [
      { label: "Chargers & USB-C", slug: "accessories" },
      { label: "Cables", slug: "accessories" },
      { label: "Power banks", slug: "accessories" },
      { label: "Phone cases", slug: "accessories" },
      { label: "Laptop bags", slug: "accessories" },
      { label: "Screen protectors", slug: "accessories" },
    ],
    promo: {
      title: "Multi-buy essentials",
      subtitle: "Buy two accessories, receive 15% off",
      href: "/catalog/accessories",
      badge: "Multi-buy",
    },
  },
];

const SEARCH_SCOPES = [
  { value: "all", label: "All departments" },
  ...DEPARTMENTS.map((d) => ({ value: d.slug, label: d.short })),
];

// Fallback icon lookup for arbitrary categories fetched from the DB. Keyed by
// substrings of the category slug so that whatever the vendor feed emitted, we
// can pick something reasonable.
const CATEGORY_ICON_HINTS: Array<{ match: RegExp; Icon: React.ElementType }> = [
  { match: /audio|headphone|speaker|hi-?fi|sound/, Icon: Headphones },
  { match: /laptop|computer|notebook|pc|desktop|monitor/, Icon: Laptop2 },
  { match: /phone|smartphone|mobile/, Icon: Smartphone },
  { match: /tv|video|projector/, Icon: Tv },
  { match: /camera|photo|drone|lens/, Icon: Camera },
  { match: /home|smart-home|light|robot|vacuum|hoover/, Icon: HomeIcon },
  { match: /game|gaming|console|playstation|xbox|nintendo/, Icon: Gamepad2 },
  { match: /watch|wearable|band|fit/, Icon: Watch },
  { match: /cable|charger|adapter|accessor|case|power/, Icon: Cable },
];

function iconForCategory(slug: string, name: string): React.ElementType {
  const key = `${slug} ${name}`.toLowerCase();
  for (const hint of CATEGORY_ICON_HINTS) {
    if (hint.match.test(key)) return hint.Icon;
  }
  return LayoutGrid;
}

const ROTATING_PROMOS = [
  { icon: Sparkles, text: "Personal concierge — book a private consultation" },
  { icon: Truck, text: "Complimentary UK delivery on orders over £50" },
  { icon: Package, text: "Order by 8pm for next-day white-glove delivery" },
  { icon: Repeat, text: "Considered trade-in — up to £700 credit" },
  { icon: Star, text: "Rated 4.9 / 5 by Electroplace members" },
];

function useDropdownDismiss(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);
  return ref;
}

export function Header() {
  const t = useTranslations("nav");
  const router = useRouter();
  const { itemCount, cartBounce, cart, removeItem } = useCart();
  const items = cart.items;
  const subtotal = cart.subtotal;
  const { user, role } = useAuth();
  const { currency, symbol, convert } = useCurrency();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [scope, setScope] = useState<string>("all");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoIdx, setPromoIdx] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchFocus, setSearchFocus] = useState(false);
  const [mobileAcc, setMobileAcc] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || deptOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, deptOpen]);

  useEffect(() => {
    const t = setInterval(
      () => setPromoIdx((p) => (p + 1) % ROTATING_PROMOS.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("electroplace-recent-search");
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const pushRecent = (q: string) => {
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((v) => v !== q)].slice(0, 6);
      try {
        localStorage.setItem("electroplace-recent-search", JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    pushRecent(q);
    const scopePath = scope === "all" ? "" : `&category=${scope}`;
    router.push(`/search?q=${encodeURIComponent(q)}${scopePath}`);
    setSearchFocus(false);
  };

  // Prefer the real category tree (imported from the vendor feed) as the
  // authoritative department list — anything hard-coded here can point at a
  // slug that doesn't exist in the DB, producing 404s in the mega menu.
  interface DeptView {
    slug: string;
    name: string;
    short: string;
    Icon: React.ElementType;
    tagline: string;
    productCount: number;
    children: { name: string; slug: string; count: number }[];
    promo: { title: string; subtitle: string; badge: string };
  }

  const menuDepartments: DeptView[] = categories.length > 0
    ? categories
        .filter((c) => (c._count?.products ?? 0) > 0 || (c.children?.length ?? 0) > 0)
        .slice(0, 12)
        .map((c) => {
          const hardcoded = DEPARTMENTS.find((d) => d.slug === c.slug);
          return {
            slug: c.slug,
            name: c.name,
            short: hardcoded?.short ?? c.name.split(/[ &/]/)[0],
            Icon: hardcoded?.Icon ?? iconForCategory(c.slug, c.name),
            tagline:
              hardcoded?.tagline ??
              `Shop ${c.name.toLowerCase()} — curated by our editors.`,
            productCount: c._count?.products ?? 0,
            children:
              (c.children ?? []).map((child) => ({
                name: child.name,
                slug: child.slug,
                count: child._count?.products ?? 0,
              })) || [],
            promo: hardcoded?.promo
              ? {
                  title: hardcoded.promo.title,
                  subtitle: hardcoded.promo.subtitle,
                  badge: hardcoded.promo.badge,
                }
              : {
                  title: `${c.name} concierge`,
                  subtitle: "Free expert advice, delivery and setup.",
                  badge: "Curated",
                },
          };
        })
    : DEPARTMENTS.map((d) => ({
        slug: d.slug,
        name: d.name,
        short: d.short,
        Icon: d.Icon,
        tagline: d.tagline,
        productCount: 0,
        children: [],
        promo: {
          title: d.promo.title,
          subtitle: d.promo.subtitle,
          badge: d.promo.badge,
        },
      }));

  const resolvedActiveSlug =
    (activeDept && menuDepartments.find((d) => d.slug === activeDept)?.slug) ||
    menuDepartments[0]?.slug ||
    "";
  const activeDeptData =
    menuDepartments.find((d) => d.slug === resolvedActiveSlug) ?? menuDepartments[0];

  const accountDismissRef = useDropdownDismiss(() => setAccountOpen(false));
  const cartDismissRef = useDropdownDismiss(() => setMiniCartOpen(false));
  const searchDismissRef = useDropdownDismiss(() => {
    setScopeOpen(false);
    setSearchFocus(false);
  });

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40 w-full transition-all duration-300",
          "bg-[color:var(--color-bg)]",
          scrolled
            ? "shadow-[0_1px_0_0_rgba(245,240,232,0.06),0_10px_30px_-20px_rgba(0,0,0,0.55)]"
            : "shadow-none",
        ].join(" ")}
        role="banner"
      >
        {/* ── Utility strip — deep espresso ─────────────────────────── */}
        <div
          className={[
            "overflow-hidden bg-[#221E1A] text-[color:var(--color-text)]/80 transition-[max-height,opacity] duration-300",
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
          ].join(" ")}
          aria-hidden={scrolled}
        >
          <div className="mx-auto grid h-10 max-w-[1280px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium tracking-wide transition-colors hover:text-[color:var(--color-primary)]">
                <HelpCircle size={12} /> Help centre
              </Link>
              <span className="hidden h-3 w-px bg-[color:var(--color-text)]/15 sm:inline-block" />
              <Link href="/account/orders" className="hidden items-center gap-1.5 whitespace-nowrap text-[11px] font-medium tracking-wide transition-colors hover:text-[color:var(--color-primary)] sm:inline-flex">
                <Package size={12} /> Order tracking
              </Link>
              <span className="hidden h-3 w-px bg-[color:var(--color-text)]/15 md:inline-block" />
              <Link href="/contact" className="hidden items-center gap-1.5 whitespace-nowrap text-[11px] font-medium tracking-wide transition-colors hover:text-[color:var(--color-primary)] md:inline-flex">
                <MapPin size={12} /> Stock finder
              </Link>
            </div>

            <div className="pointer-events-none hidden min-w-0 justify-center overflow-hidden text-[11px] font-medium tracking-wide text-[color:var(--color-text)]/90 xl:flex">
              <AnimatePresence mode="wait">
                <motion.span
                  key={promoIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex min-w-0 max-w-full items-center gap-1.5 truncate whitespace-nowrap"
                >
                  {(() => {
                    const P = ROTATING_PROMOS[promoIdx];
                    return (
                      <>
                        <P.icon size={12} className="shrink-0 text-[color:var(--color-primary)]" />
                        <span className="truncate">{P.text}</span>
                      </>
                    );
                  })()}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-end gap-2 text-[color:var(--color-text)]">
              <ThemeToggle />
              <span className="hidden h-3 w-px bg-[color:var(--color-text)]/15 sm:inline-block" />
              <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-text)]/60 sm:inline">
                UK · {currency} {symbol}
              </span>
            </div>
          </div>
        </div>

        {/* ── MAIN ROW — command-style, search-first ──────────────────
             Layout: [dept trigger] · [logo] · [search] · [right cluster]
        */}
        <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]">
          <div className={[
            "mx-auto flex max-w-[1280px] items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8",
            scrolled ? "py-2.5" : "py-4",
          ].join(" ")}>
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)] lg:hidden"
            >
              <Menu size={22} />
            </button>

            {/* LEFT ANCHOR — persistent vertical drawer trigger */}
            <button
              type="button"
              onClick={() => setDeptOpen(true)}
              aria-expanded={deptOpen}
              aria-haspopup="dialog"
              className={[
                "hidden lg:inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full pl-3 pr-5 text-[13px] font-semibold transition-all",
                deptOpen
                  ? "bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)] shadow-[0_6px_20px_rgba(232,161,58,0.35)]"
                  : "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text)] ring-1 ring-inset ring-[color:var(--color-border)] hover:ring-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]",
              ].join(" ")}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                <LayoutGrid size={15} />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                  Browse
                </span>
                <span className="font-display text-[13.5px] font-semibold tracking-tight">
                  All departments
                </span>
              </span>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className={[
                "shrink-0 transition-opacity",
                scrolled ? "opacity-95" : "opacity-100",
              ].join(" ")}
              aria-label="Electroplace"
            >
              <ElectroplaceLogo size={scrolled ? 20 : 22} />
            </Link>

            {/* Central hero-search */}
            <div
              ref={searchDismissRef}
              className="relative hidden min-w-0 flex-1 lg:block"
            >
              <form
                onSubmit={handleSearch}
                className={[
                  "relative flex h-12 min-w-0 items-stretch overflow-hidden rounded-full border bg-[color:var(--color-bg-elevated)] transition-all",
                  searchFocus
                    ? "border-[color:var(--color-primary)] shadow-[0_0_0_4px_rgba(232,161,58,0.14)]"
                    : "border-[color:var(--color-border)]",
                ].join(" ")}
              >
                <div className="relative">
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={scopeOpen}
                    onClick={() => setScopeOpen((v) => !v)}
                    className="inline-flex h-full items-center gap-1.5 border-r border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                  >
                    <span className="max-w-[110px] truncate">
                      {SEARCH_SCOPES.find((s) => s.value === scope)?.label}
                    </span>
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {scopeOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        role="listbox"
                        className="absolute left-0 top-full z-30 mt-2 min-w-[240px] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] py-1 shadow-lg"
                      >
                        {SEARCH_SCOPES.map((s) => (
                          <li key={s.value}>
                            <button
                              type="button"
                              onClick={() => {
                                setScope(s.value);
                                setScopeOpen(false);
                              }}
                              role="option"
                              aria-selected={scope === s.value}
                              className={[
                                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                                scope === s.value
                                  ? "bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]"
                                  : "text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]",
                              ].join(" ")}
                            >
                              {s.label}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  type="text"
                  className="min-w-0 flex-1 bg-transparent px-4 text-[14.5px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
                  placeholder="Search Electroplace — laptops, televisions, headphones…"
                  value={searchQuery}
                  onFocus={() => setSearchFocus(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="inline-flex items-center gap-1.5 bg-[color:var(--color-primary)] px-6 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)]"
                >
                  <Search size={15} />
                  <span className="hidden xl:inline">Search</span>
                </button>
              </form>

              <AnimatePresence>
                {searchFocus && (recentSearches.length > 0 || searchQuery.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-2 shadow-lg"
                    role="listbox"
                  >
                    {recentSearches.length > 0 && (
                      <div className="mb-1">
                        <div className="px-2 pb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                          Recent searches
                        </div>
                        {recentSearches.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSearchQuery(q);
                              router.push(`/search?q=${encodeURIComponent(q)}`);
                              setSearchFocus(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                          >
                            <Search size={13} className="text-[color:var(--color-text-tertiary)]" />
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="px-2 pb-1 pt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                      Popular departments
                    </div>
                    {menuDepartments.slice(0, 6).map((d) => (
                      <Link
                        key={d.slug}
                        href={`/catalog/${d.slug}`}
                        onClick={() => setSearchFocus(false)}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <d.Icon size={14} className="text-[color:var(--color-primary)]" />
                          {d.name}
                        </span>
                        <ArrowRight size={12} className="text-[color:var(--color-text-tertiary)]" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT CLUSTER — account / compare / wishlist / basket */}
            <div className="hidden items-center gap-1 lg:flex">
              {/* Currency + Language — always visible, so shoppers can flip them
                  from any scroll position without opening the utility strip. */}
              <div className="mr-1 flex items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-1.5 py-1 text-[color:var(--color-text)]">
                <CurrencySwitcher />
                <span className="h-4 w-px bg-[color:var(--color-border)]" />
                <LanguageSwitcher />
              </div>

              {/* Account */}
              <div
                ref={accountDismissRef}
                className="relative"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-2.5 text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                >
                  <UserIcon size={19} strokeWidth={1.75} />
                  <span className={[
                    "hidden text-left leading-tight",
                    scrolled ? "" : "xl:inline-flex xl:flex-col",
                  ].join(" ")}>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                      {user ? "Signed in" : "Members"}
                    </span>
                    <span className="font-display text-[12.5px] font-semibold tracking-tight">
                      {user ? "Account" : "Sign in"}
                    </span>
                  </span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      className="absolute right-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-2 shadow-lg"
                    >
                      {!user ? (
                        <>
                          <Link
                            href="/auth/login"
                            role="menuitem"
                            className="flex items-center justify-center rounded-lg bg-[color:var(--color-primary)] px-3 py-2.5 text-center text-[13px] font-semibold text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)]"
                          >
                            Sign in
                          </Link>
                          <Link
                            href="/auth/register"
                            role="menuitem"
                            className="mt-1 flex items-center justify-center rounded-lg border border-[color:var(--color-border)] px-3 py-2.5 text-center text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                          >
                            Create account
                          </Link>
                          <div className="my-2 h-px bg-[color:var(--color-border)]" />
                        </>
                      ) : (
                        <div className="mb-2 rounded-lg bg-[color:var(--color-primary-tint)] p-3">
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                            Signed in as
                          </div>
                          <div className="mt-0.5 truncate text-sm font-semibold text-[color:var(--color-text)]">
                            {user.email}
                          </div>
                        </div>
                      )}
                      {[
                        { href: "/account", icon: UserIcon, label: "My account" },
                        { href: "/account/orders", icon: Package, label: "My orders" },
                        { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
                        { href: "/account/wishlist", icon: GitCompare, label: "Compare list" },
                        { href: "/contact", icon: HelpCircle, label: "Concierge support" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                        >
                          <item.icon size={14} className="text-[color:var(--color-primary)]" />
                          {item.label}
                        </Link>
                      ))}
                      {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                        <NextLink
                          href="/admin"
                          role="menuitem"
                          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                        >
                          <Shield size={14} className="text-[color:var(--color-primary)]" />
                          Admin panel
                        </NextLink>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Compare — hidden on scroll */}
              {!scrolled && (
                <Link
                  href="/account/wishlist"
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-2.5 text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label="Compare"
                >
                  <GitCompare size={19} strokeWidth={1.75} />
                </Link>
              )}

              {/* Wishlist — hidden on scroll */}
              {!scrolled && (
                <Link
                  href="/account/wishlist"
                  className="inline-flex h-11 items-center gap-2 rounded-lg px-2.5 text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label="Wishlist"
                >
                  <Heart size={19} strokeWidth={1.75} />
                </Link>
              )}

              {/* Cart */}
              <div
                ref={cartDismissRef}
                className="relative"
                onMouseEnter={() => setMiniCartOpen(true)}
                onMouseLeave={() => setMiniCartOpen(false)}
              >
                <Link
                  href="/cart"
                  className="relative inline-flex h-11 items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-4 text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:shadow-[0_6px_20px_rgba(232,161,58,0.42)]"
                  aria-label={t("cart")}
                >
                  <div className="relative">
                    <ShoppingBag size={18} strokeWidth={1.75} />
                    {itemCount > 0 && (
                      <motion.span
                        key={cartBounce}
                        initial={cartBounce > 0 ? { scale: 0.5 } : false}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 400 }}
                        className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1A1714] px-1 font-mono text-[9px] font-bold tabular-nums text-[color:var(--color-primary)] ring-2 ring-[color:var(--color-primary)]"
                      >
                        {itemCount > 99 ? "99+" : itemCount}
                      </motion.span>
                    )}
                  </div>
                  <span className="text-left leading-tight hidden xl:inline-flex xl:flex-col">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--color-primary-fg)]/70">
                      Basket
                    </span>
                    <span className="font-mono text-[12px] font-semibold tabular-nums">
                      {symbol}{convert(subtotal).toFixed(2)}
                    </span>
                  </span>
                </Link>

                <AnimatePresence>
                  {miniCartOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-30 mt-2 w-[340px] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between pb-3">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                          Basket · {itemCount} item{itemCount === 1 ? "" : "s"}
                        </span>
                        <span className="font-mono text-[13px] font-bold tabular-nums text-[color:var(--color-primary)]">
                          {symbol}{convert(subtotal).toFixed(2)}
                        </span>
                      </div>
                      {items.length === 0 ? (
                        <div className="py-8 text-center text-sm text-[color:var(--color-text-tertiary)]">
                          Your basket is empty
                        </div>
                      ) : (
                        <>
                          <ul className="max-h-72 space-y-2 overflow-y-auto">
                            {items.slice(0, 4).map((it) => (
                              <li
                                key={it.productId}
                                className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] p-2"
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[rgb(252,252,252)]">
                                  {it.imageUrl && (
                                    <Image
                                      src={it.imageUrl}
                                      alt={it.name}
                                      fill
                                      sizes="56px"
                                      className="object-contain p-1"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-xs font-semibold text-[color:var(--color-text)]">
                                    {it.name}
                                  </div>
                                  <div className="mt-0.5 font-mono text-[11px] tabular-nums text-[color:var(--color-text-tertiary)]">
                                    {it.quantity} × {symbol}{convert(it.price).toFixed(2)}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(it.productId)}
                                  aria-label="Remove item"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </li>
                            ))}
                          </ul>
                          {items.length > 4 && (
                            <div className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                              + {items.length - 4} more
                            </div>
                          )}
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                              href="/cart"
                              className="inline-flex items-center justify-center rounded-lg border border-[color:var(--color-border)] px-2 py-2.5 text-center text-[12px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                            >
                              View basket
                            </Link>
                            <Link
                              href="/checkout"
                              className="inline-flex items-center justify-center rounded-lg bg-[color:var(--color-primary)] px-2 py-2.5 text-center text-[12px] font-semibold text-[color:var(--color-primary-fg)] transition-colors hover:bg-[color:var(--color-primary-hover)]"
                            >
                              Checkout
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile — cart + currency/language always reachable */}
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <div className="flex items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-1.5 py-1">
              <CurrencySwitcher />
              <span className="h-4 w-px bg-[color:var(--color-border)]" />
              <LanguageSwitcher />
            </div>
            <Link
              href="/cart"
              className="relative inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-3 text-[color:var(--color-primary-fg)]"
              aria-label={t("cart")}
            >
              <ShoppingBag size={17} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1A1714] px-1 font-mono text-[9px] font-bold tabular-nums text-[color:var(--color-primary)] ring-2 ring-[color:var(--color-primary)]">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile search row */}
          <div className="border-t border-[color:var(--color-border)] px-4 py-2 lg:hidden">
            <form
              className="flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] pl-4 pr-1 focus-within:border-[color:var(--color-primary)]"
              onSubmit={handleSearch}
            >
              <Search size={14} className="text-[color:var(--color-text-tertiary)]" />
              <input
                type="text"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
                placeholder="Search Electroplace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Search"
                className="inline-flex h-8 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-primary-fg)]"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── LEFT-SIDE VERTICAL DEPARTMENT FLYOUT (desktop) ──────────
           Structural anchor: full-height slide-over from the left listing
           all departments vertically, each expanding into sub-categories,
           featured brands, and a promo tile.
      */}
      <AnimatePresence>
        {deptOpen && (
          <div className="fixed inset-0 z-50 hidden lg:block" aria-modal="true" role="dialog" aria-label="Shop by department">
            <motion.div
              className="absolute inset-0 bg-[#0F0D0B]/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeptOpen(false)}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[920px] max-w-[92vw] overflow-hidden bg-[color:var(--color-bg)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Rail — vertical department list */}
              <nav
                aria-label="Departments"
                className="flex w-[290px] shrink-0 flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]"
              >
                <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-5">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                      Browse
                    </span>
                    <span className="font-display text-[18px] font-semibold tracking-tight text-[color:var(--color-text)]">
                      Departments
                    </span>
                  </div>
                  <button
                    onClick={() => setDeptOpen(false)}
                    aria-label="Close"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-elevated)] hover:text-[color:var(--color-primary)]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <ul className="flex-1 overflow-y-auto py-2">
                  {menuDepartments.map((d) => {
                    const isActive = resolvedActiveSlug === d.slug;
                    return (
                      <li key={d.slug}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveDept(d.slug)}
                          onFocus={() => setActiveDept(d.slug)}
                          onClick={() => {
                            setDeptOpen(false);
                            router.push(`/catalog/${d.slug}`);
                          }}
                          className={[
                            "group flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-[13.5px] font-semibold transition-colors",
                            isActive
                              ? "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-primary)] shadow-[inset_3px_0_0_0_var(--color-primary)]"
                              : "text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-elevated)]",
                          ].join(" ")}
                        >
                          <span className="inline-flex items-center gap-3">
                            <span className={[
                              "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              isActive ? "bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]" : "bg-[color:var(--color-bg)] text-[color:var(--color-bronze)] group-hover:text-[color:var(--color-primary)]",
                            ].join(" ")}>
                              <d.Icon size={16} />
                            </span>
                            <span className="flex flex-col leading-tight">
                              <span>{d.name}</span>
                              {d.productCount > 0 ? (
                                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                                  {d.productCount.toLocaleString()} products
                                </span>
                              ) : null}
                            </span>
                          </span>
                          <ChevronRight size={13} className="text-[color:var(--color-text-tertiary)]" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-[color:var(--color-border)] px-5 py-4">
                  <Link
                    href="/catalog?onSale=true"
                    onClick={() => setDeptOpen(false)}
                    className="flex items-center justify-between rounded-full bg-[color:var(--color-primary-tint)] px-4 py-2.5 text-[12.5px] font-bold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-primary-fg)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Percent size={14} /> Members-only deals
                    </span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </nav>

              {/* Secondary panel — active dept sub-categories, brands, promo */}
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="border-b border-[color:var(--color-border)] px-8 py-6">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                    Department
                  </div>
                  <Link
                    href={`/catalog/${activeDeptData.slug}`}
                    onClick={() => setDeptOpen(false)}
                    className="mt-1 inline-flex items-center gap-2 font-display text-[28px] font-semibold tracking-tight text-[color:var(--color-text)] hover:text-[color:var(--color-primary)]"
                  >
                    {activeDeptData.name}
                    <ArrowRight size={18} className="text-[color:var(--color-primary)]" />
                  </Link>
                  <p className="mt-1 max-w-xl text-[14px] text-[color:var(--color-text-secondary)]">
                    {activeDeptData.tagline}
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-[1fr_260px] gap-6 px-8 py-6">
                  <div className="flex flex-col gap-5">
                    <div>
                      <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                        Shop by category
                      </div>
                      {activeDeptData.children.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                          {activeDeptData.children.map((sub) => (
                            <Link
                              key={sub.slug + sub.name}
                              href={`/catalog/${sub.slug}`}
                              onClick={() => setDeptOpen(false)}
                              className="group flex items-center justify-between rounded-md px-2 py-1.5 text-[13.5px] text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                            >
                              <span>{sub.name}</span>
                              {sub.count > 0 ? (
                                <span className="font-mono text-[11px] tabular-nums text-[color:var(--color-text-tertiary)]">
                                  {sub.count}
                                </span>
                              ) : (
                                <ChevronRight
                                  size={12}
                                  className="opacity-0 transition-opacity group-hover:opacity-100"
                                />
                              )}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          href={`/catalog/${activeDeptData.slug}`}
                          onClick={() => setDeptOpen(false)}
                          className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-primary-tint)] px-3 py-2 text-[13px] font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-primary-fg)]"
                        >
                          Shop all {activeDeptData.short}
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-[color:var(--color-border)] pt-4">
                      <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                        Featured brands
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {["Bang & Olufsen", "Sonos", "Bose", "Apple", "Sony", "LG", "Lenovo", "Google", "Leica"].map((b) => (
                          <Link
                            key={b}
                            href={`/search?q=${encodeURIComponent(b)}`}
                            onClick={() => setDeptOpen(false)}
                            className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 py-1 text-[12px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                          >
                            {b}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Promo tile — warm-amber editorial */}
                  <Link
                    href={`/catalog/${activeDeptData.slug}`}
                    onClick={() => setDeptOpen(false)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-gradient-to-br from-[#2C271F] via-[#3A2E1C] to-[#26221E] p-5 text-[color:var(--color-text)]"
                  >
                    <div aria-hidden className="pointer-events-none absolute inset-0 warm-dots opacity-40" />
                    <div className="relative z-10">
                      <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-[color:var(--color-primary)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-primary-fg)]">
                        {activeDeptData.promo.badge}
                      </span>
                      <div className="font-display text-[19px] font-semibold leading-tight tracking-tight">
                        {activeDeptData.promo.title}
                      </div>
                      <div className="mt-1.5 text-[13px] text-[color:var(--color-text)]/75">
                        {activeDeptData.promo.subtitle}
                      </div>
                    </div>
                    <div className="relative z-10 mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-primary)] transition-transform group-hover:translate-x-0.5">
                      Discover <ArrowRight size={12} />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-[#0F0D0B]/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[92%] max-w-sm flex-col bg-[color:var(--color-bg)] shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
                <ElectroplaceLogo size={20} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                <div className="mb-4">
                  <div className="px-2 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                    Shop by department
                  </div>
                  {menuDepartments.map((d) => {
                    const isOpen = mobileAcc === d.slug;
                    return (
                      <div
                        key={d.slug}
                        className="border-b border-[color:var(--color-border)]"
                      >
                        <button
                          type="button"
                          onClick={() => setMobileAcc(isOpen ? null : d.slug)}
                          className="flex w-full items-center justify-between gap-3 px-2 py-3 text-left text-[14px] font-semibold text-[color:var(--color-text)]"
                          aria-expanded={isOpen}
                        >
                          <span className="inline-flex items-center gap-3">
                            <d.Icon size={16} className="text-[color:var(--color-primary)]" />
                            {d.name}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`text-[color:var(--color-text-tertiary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-1 py-2 pl-9 pr-2">
                                <Link
                                  href={`/catalog/${d.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-md px-2 py-1.5 text-sm font-semibold text-[color:var(--color-primary)]"
                                >
                                  Shop all {d.short}
                                </Link>
                                {d.children.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={`/catalog/${sub.slug}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                                  >
                                    {sub.name}
                                    {sub.count > 0 ? (
                                      <span className="font-mono text-[10px] tabular-nums text-[color:var(--color-text-tertiary)]">
                                        {sub.count}
                                      </span>
                                    ) : null}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-4 flex flex-col gap-1">
                  <div className="px-2 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[color:var(--color-bronze)]">
                    Quick links
                  </div>
                  {[
                    { href: "/catalog?onSale=true", label: "Deals & clearance", icon: Percent },
                    { href: "/catalog?sort=newest", label: "New arrivals", icon: Sparkles },
                    { href: "/account/orders", label: "Track order", icon: Package },
                    { href: "/contact", label: "Concierge support", icon: HelpCircle },
                    { href: "/contact", label: "Stock finder", icon: MapPin },
                  ].map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                    >
                      <l.icon size={14} className="text-[color:var(--color-primary)]" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-[color:var(--color-border)] px-5 py-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-sm font-semibold text-[color:var(--color-primary-fg)]"
                    >
                      My account
                    </Link>
                    {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                      <NextLink
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--color-border)] text-sm font-semibold text-[color:var(--color-text)]"
                      >
                        Admin panel
                      </NextLink>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-sm font-semibold text-[color:var(--color-primary-fg)]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-full border-2 border-[color:var(--color-primary)] text-sm font-semibold text-[color:var(--color-primary)]"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
