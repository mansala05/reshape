import { Activity, ArrowRight, Copy, ExternalLink, Gauge, Layers, MonitorCog, Ticket, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { posters, profile, projects, sections, socials } from "@/data/portfolio";
import { copyEmail, scrollToSection } from "@/lib/actions";
import { followSystemMotion, setReducedMotion } from "@/lib/motion";
import { playSound } from "@/lib/sound";
import { getUI, setUI, useUI } from "@/lib/ui-store";

export function CommandPalette() {
  const open = useUI((s) => s.paletteOpen);
  const soundOn = useUI((s) => s.soundOn);
  const statsOpen = useUI((s) => s.statsOpen);
  const reduced = useUI((s) => s.reducedMotion);
  const motionSource = useUI((s) => s.motionSource);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const next = !getUI().paletteOpen;
        playSound(next ? "open" : "close");
        setUI({ paletteOpen: next });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    setUI({ paletteOpen: false });
    playSound("click");
    // Let the dialog close before scrolling or opening another dialog.
    window.setTimeout(fn, 60);
  };

  return (
    <CommandDialog open={open} onOpenChange={(o) => setUI({ paletteOpen: o })}>
      <CommandInput placeholder="Jump to a section, open a project, copy contact…" className="font-mono" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty className="py-8 text-center font-mono text-xs text-muted-foreground">
          No match. Try “about”, “posters” or “email”.
        </CommandEmpty>
        <CommandGroup heading="Navigate">
          {sections.map((s) => (
            <CommandItem
              key={s.id}
              value={`go ${s.label} ${s.id} ${s.keywords}`}
              onSelect={() => run(() => scrollToSection(s.id))}
            >
              <ArrowRight className="text-powder" />
              <span>{s.label}</span>
              <CommandShortcut className="font-mono">{s.code}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.title} ${p.tags.join(" ")}`}
              onSelect={() => run(() => setUI({ projectId: p.id }))}
            >
              <Layers className="text-powder" />
              <span>{p.title}</span>
              <CommandShortcut className="font-mono">{p.index}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Posters & flyers">
          {posters.map((p) => (
            <CommandItem
              key={p.id}
              value={`poster flyer ${p.title} ${p.kind} ${p.city} ${p.year}`}
              onSelect={() => run(() => setUI({ posterId: p.id }))}
            >
              <Ticket className="text-poppy-bright" />
              <span>{p.title}</span>
              <CommandShortcut className="font-mono">{p.kind}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="copy email contact" onSelect={() => run(copyEmail)}>
            <Copy className="text-poppy-bright" />
            <span>Copy email</span>
            <CommandShortcut className="font-mono">{profile.email}</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="toggle sound audio effects"
            onSelect={() => {
              setUI({ soundOn: !soundOn });
              playSound("toggle", true);
            }}
          >
            {soundOn ? <VolumeX className="text-powder" /> : <Volume2 className="text-powder" />}
            <span>{soundOn ? "Mute sound effects" : "Enable sound effects"}</span>
          </CommandItem>
          <CommandItem
            value="reduce motion accessibility animation calm vestibular"
            onSelect={() => {
              setReducedMotion(!reduced);
              playSound("toggle");
            }}
          >
            {reduced ? <Waves className="text-powder" /> : <Gauge className="text-powder" />}
            <span>{reduced ? "Turn on full motion" : "Reduce motion"}</span>
            <CommandShortcut className="font-mono">{reduced ? "on" : "off"}</CommandShortcut>
          </CommandItem>
          {motionSource === "user" && (
            <CommandItem value="motion follow system device setting" onSelect={() => followSystemMotion()}>
              <MonitorCog className="text-powder" />
              <span>Use my device's motion setting</span>
            </CommandItem>
          )}
          <CommandItem value="toggle performance stats fps" onSelect={() => run(() => setUI({ statsOpen: !statsOpen }))}>
            <Activity className="text-powder" />
            <span>{statsOpen ? "Hide performance stats" : "Show performance stats"}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Elsewhere">
          {socials
            .filter((s) => s.key !== "email")
            .map((s) => (
              <CommandItem
                key={s.key}
                value={`social ${s.label} ${s.handle}`}
                onSelect={() => run(() => window.open(s.href, "_blank", "noopener"))}
              >
                <ExternalLink className="text-powder" />
                <span>{s.label}</span>
                <CommandShortcut className="font-mono">{s.handle}</CommandShortcut>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
