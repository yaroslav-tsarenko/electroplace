import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
        <main className="mx-auto flex min-h-screen max-w-[720px] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-primary)]">
            404 · Page not found
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            We couldn&rsquo;t find that page.
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-[color:var(--color-text-secondary)]">
            The link may be out of date, or the item may have moved. Head back
            to the catalogue or search Electroplace to find what you need.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/en"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)]"
            >
              Return home <ArrowRight size={13} />
            </Link>
            <Link
              href="/en/catalog"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              Browse catalogue
            </Link>
            <Link
              href="/en/search"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              <Search size={12} /> Search
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
