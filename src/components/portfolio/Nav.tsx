import { useEffect, useState } from "react";

import { profile, sections } from "@/data/portfolio";
import { scrollToSection } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function Nav() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 !border-0 !bg-transparent !shadow-none !backdrop-filter-none">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="group flex items-center gap-3"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-sm border border-powder/40 font-mono text-[11px] font-semibold tracking-wider text-powder transition group-hover:border-poppy group-hover:bg-poppy group-hover:text-poppy-foreground">
            {profile.initials}
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline lg:hidden xl:inline">
            {profile.name}
          </span>
        </button>

        <ul className="hidden items-center gap-0.5 rounded-full border border-powder/20 bg-surface/35 px-3 py-1 shadow-lg shadow-black/10 backdrop-blur-xl backdrop-saturate-150 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors",
                  active === s.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-px origin-left bg-poppy-bright transition-transform duration-300",
                    active === s.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="hidden rounded-full bg-poppy px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-poppy-foreground transition hover:bg-poppy-bright hover:glow-poppy sm:block"
          >
            Let's talk
          </button>
        </div>
      </nav>
    </header>
  );
}





