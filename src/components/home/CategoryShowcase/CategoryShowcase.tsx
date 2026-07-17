"use client";

import { useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import {
  Package,
  Headphones,
  Laptop2,
  Smartphone,
  Tv,
  Camera,
  Gamepad2,
  Watch,
  Cable,
  Printer,
  Zap,
  Cpu,
  Refrigerator,
  Lightbulb,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface Props {
  categories: CategoryItem[];
}

// Relevant icon + accent tint for every plausible department slug we might
// receive from the vendor feed, so category tiles never fall back to a bare
// "package" placeholder. Tints are kept warm-editorial and light so photography
// blends cleanly with the neutral bg-[rgb(252,252,252)] product frame.
const CATEGORY_HINTS: Array<{
  match: RegExp;
  icon: React.ElementType;
  accent: string;
}> = [
  { match: /audio|headphone|speaker|hi-?fi|sound|beat|dolby/, icon: Headphones, accent: "#E8A13A" },
  { match: /laptop|notebook|macbook|chromebook|ultrabook/, icon: Laptop2, accent: "#3B82F6" },
  { match: /pc|desktop|computer|workstation|server|tower/, icon: Cpu, accent: "#6366F1" },
  { match: /monitor|display|screen|panel/, icon: Cpu, accent: "#0EA5E9" },
  { match: /phone|smartphone|mobile|iphone|pixel|galaxy/, icon: Smartphone, accent: "#F59E0B" },
  { match: /tv|video|projector|television|oled|qled/, icon: Tv, accent: "#10B981" },
  { match: /camera|photo|drone|lens|mirrorless|dslr|gopro/, icon: Camera, accent: "#EF4444" },
  { match: /home|smart-?home|light|lamp|led|voice|alexa|matter|thread/, icon: Lightbulb, accent: "#F59E0B" },
  { match: /game|gaming|console|playstation|xbox|nintendo|switch|vr/, icon: Gamepad2, accent: "#8B5CF6" },
  { match: /watch|wearable|band|fit|smartwatch|garmin/, icon: Watch, accent: "#EC4899" },
  { match: /print|scan|copy|toner|ink|printer/, icon: Printer, accent: "#64748B" },
  { match: /kitchen|fridge|refriger|freezer|washer|oven|dishwasher/, icon: Refrigerator, accent: "#0891B2" },
  { match: /cable|charger|adapter|accessor|case|power|usb|hub|dock/, icon: Cable, accent: "#F97316" },
  { match: /electrical|wiring|installation|voltage|amp|battery/, icon: Zap, accent: "#EAB308" },
];

function pickHint(slug: string, name: string) {
  const key = `${slug} ${name}`.toLowerCase();
  return (
    CATEGORY_HINTS.find((h) => h.match.test(key)) ?? {
      icon: Package,
      accent: "#8B7355",
    }
  );
}

export function CategoryShowcase({ categories }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (categories.length === 0) return null;

  return (
    <section ref={ref}>
      <motion.div
        className="mb-8 flex flex-col gap-1 border-b border-[color:var(--color-line)] pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">Departments</span>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-[40px]">
          Shop by category
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat, i) => {
          const { icon: Icon, accent } = pickHint(cat.slug, cat.name);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/catalog/${cat.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-[0_12px_28px_-14px_rgba(232,161,58,0.35)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[rgb(252,252,252)]">
                  <div aria-hidden className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
                  {cat.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2">
                      <span
                        className="inline-flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `${accent}18`,
                          color: accent,
                          boxShadow: `0 8px 24px -12px ${accent}55`,
                        }}
                      >
                        <Icon size={30} strokeWidth={1.5} />
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 p-4">
                  <h3 className="text-sm font-semibold text-[color:var(--color-text)]">
                    {cat.name}
                  </h3>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)] tabular-nums">
                    {cat.productCount.toLocaleString()} products
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
