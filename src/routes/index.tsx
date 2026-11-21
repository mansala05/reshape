import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { About } from "@/components/portfolio/About";
import { CommandPalette } from "@/components/portfolio/CommandPalette";
import { Contact } from "@/components/portfolio/Contact";
import { Hero } from "@/components/portfolio/Hero";
import { HeroCanvas } from "@/components/portfolio/HeroCanvas";
import { Nav } from "@/components/portfolio/Nav";
import { Posters } from "@/components/portfolio/Posters";
import { Projects } from "@/components/portfolio/Projects";
import { TechStack } from "@/components/portfolio/TechStack";
import { UtilityDock } from "@/components/portfolio/UtilityDock";
import { profile } from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${profile.name} — ${profile.title}` },
      { name: "description", content: profile.tagline },
      { property: "og:title", content: `${profile.name} — ${profile.title}` },
      { property: "og:description", content: profile.tagline },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <HeroCanvas />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Posters />
        <TechStack />
        <Contact />
      </main>
      <CommandPalette />
      <UtilityDock />
    </div>
  );
}
