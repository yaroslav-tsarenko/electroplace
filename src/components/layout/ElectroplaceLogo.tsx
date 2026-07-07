/**
 * Electroplace wordmark — a warm-premium mark: a soft espresso disc holding a
 * glowing amber crescent, paired with a Fraunces-set serif wordmark. Reads
 * boutique, confident, curated.
 */
export function ElectroplaceLogo({
  size = 24,
  tone = "dark",
}: {
  size?: number;
  tone?: "dark" | "light";
}) {
  const textColor =
    tone === "light" ? "text-[#F5F0E8]" : "text-[color:var(--color-text)]";
  const discBg = tone === "light" ? "#26221E" : "#26221E";
  const discRing =
    tone === "light"
      ? "0 0 0 1px rgba(245,240,232,0.14), 0 6px 18px rgba(0,0,0,0.35)"
      : "0 0 0 1px rgba(245,240,232,0.10), 0 6px 18px rgba(0,0,0,0.35)";
  const dim = Math.max(22, Math.round(size * 1.1));
  return (
    <span className="inline-flex items-center gap-2.5 leading-none">
      <span
        aria-hidden
        className="relative inline-flex items-center justify-center rounded-full"
        style={{
          width: dim,
          height: dim,
          background: discBg,
          boxShadow: discRing,
        }}
      >
        {/* Glowing amber crescent — the "warm accent" mark */}
        <span
          className="absolute rounded-full"
          style={{
            width: Math.round(dim * 0.62),
            height: Math.round(dim * 0.62),
            background:
              "radial-gradient(circle at 62% 40%, #F1B558 0%, #E8A13A 45%, transparent 70%)",
            boxShadow: "0 0 12px rgba(232, 161, 58, 0.55)",
            transform: "translate(6%, -4%)",
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: Math.round(dim * 0.30),
            height: Math.round(dim * 0.30),
            background: discBg,
            transform: "translate(-24%, 8%)",
          }}
        />
      </span>
      <span
        className={`font-display font-semibold tracking-tight ${textColor}`}
        style={{ fontSize: size, letterSpacing: "-0.015em" }}
      >
        electroplace
      </span>
    </span>
  );
}

// Legacy aliases — kept so old imports don't break during the transition.
export const ElectroplaceMark = ElectroplaceLogo;
export const NivroLogo = ElectroplaceLogo;
export const NivroMark = ElectroplaceLogo;
