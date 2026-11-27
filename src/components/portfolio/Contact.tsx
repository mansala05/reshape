import { ArrowUpRight, Copy, Github, Linkedin, Mail, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";

import { profile, sectionCode, socials, type Social } from "@/data/portfolio";
import { copyEmail } from "@/lib/actions";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const schema = z.object({
  name: z.string().trim().min(1, "name is required").max(100),
  email: z.string().trim().email("that email looks off").max(255),
  message: z.string().trim().min(1, "message is empty").max(2000),
});

const icons: Record<Social["key"], typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  devpost: Trophy,
  email: Mail,
};

type Line = { text: string; tone?: "ok" | "err" | "dim" };

function Field({
  label,
  name,
  type = "text",
  multiline,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
  placeholder: string;
}) {
  const cls =
    "w-full resize-none bg-transparent font-mono text-sm text-foreground caret-poppy-bright outline-none placeholder:text-muted-foreground/50";
  return (
    <label className="flex items-start gap-3 border-b border-border/60 py-3 focus-within:border-powder/50">
      <span className="shrink-0 select-none font-mono text-sm">
        <span className="text-poppy-bright">❯</span> <span className="text-powder">{label}</span>
        <span className="text-muted-foreground">:</span>
      </span>
      {multiline ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={cls} maxLength={2000} />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={cls}
          maxLength={255}
          autoComplete="off"
        />
      )}
    </label>
  );
}

export function Contact() {
  const [log, setLog] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const push = (l: Line) => setLog((prev) => [...prev.slice(-5), l]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    setLog([{ text: "$ ./send --to " + profile.email, tone: "dim" }]);
    if (!parsed.success) {
      playSound("close");
      push({ text: `error: ${parsed.error.issues[0]?.message ?? "invalid input"}`, tone: "err" });
      return;
    }
    setBusy(true);
    playSound("click");
    const { name, email, message } = parsed.data;
    const subject = encodeURIComponent(`Hello from ${name}`);
    const body = encodeURIComponent(`${message}\n\n- ${name} (${email})`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${subject}&body=${body}`;
    const gmailTab = window.open(gmailUrl, "_blank");
    if (gmailTab) gmailTab.opener = null;
    if (!gmailTab) {
      window.location.href = gmailUrl;
    }
    push({ text: "✓ Gmail draft opened - hit Send in Gmail", tone: "ok" });
    playSound("success");
    formRef.current?.reset();
    setBusy(false);
  };

  return (
    <section id="contact" className="relative scroll-mt-20 px-5 pb-16 pt-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          code={sectionCode("contact")}
          kicker="Contact"
          title={
            <>
              Let's make something{" "}
              <span className="font-serif font-normal italic text-poppy-bright">meaningful</span>{" "}
              together.
            </>
          }
        />

        <div data-reveal className="mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {/* Terminal */}
          <div
            className="overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
            data-no-ripple
          >
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-poppy" />
                <span className="h-3 w-3 rounded-full bg-powder" />
                <span className="h-3 w-3 rounded-full bg-muted-foreground/40" />
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                contact.sh - zsh - 80×24
              </p>
              <span className="w-12" />
            </div>
            <div className="p-5 font-mono text-sm md:p-6">
              <p className="text-muted-foreground">
                <span className="text-poppy-bright">~</span> $ whoami
              </p>
              <p className="mt-1 text-foreground">
                {profile.name} - {profile.title}
              </p>
              <p className="mt-3 text-muted-foreground">
                <span className="text-poppy-bright">~</span> $ cat status.txt
              </p>
              <p className="mt-1 text-powder">{profile.availability}</p>

              <form ref={formRef} onSubmit={onSubmit} className="mt-5" noValidate>
                <Field label="name" name="name" placeholder="Mansi Liyanage" />
                <Field label="email" name="email" type="email" placeholder="mansi@gmail.com" />
                <Field
                  label="message"
                  name="message"
                  multiline
                  placeholder="Anything you want to add…"
                />
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-sm bg-poppy px-4 py-2 text-xs uppercase tracking-[0.16em] text-poppy-foreground transition hover:bg-poppy-bright hover:glow-poppy disabled:opacity-60"
                  >
                    {busy ? "sending…" : "./send --now"}
                  </button>
                </div>
              </form>

              <div className="mt-5 min-h-[4.5rem] space-y-1 text-xs" aria-live="polite">
                {log.map((l, i) => (
                  <p
                    key={i}
                    className={cn(
                      l.tone === "err" && "text-poppy-bright",
                      l.tone === "ok" && "text-powder",
                      l.tone === "dim" && "text-muted-foreground",
                    )}
                  >
                    {l.text}
                  </p>
                ))}
                <p className="text-muted-foreground">
                  <span className="text-poppy-bright">~</span> ${" "}
                  <span className="inline-block h-3.5 w-2 translate-y-0.5 bg-powder animate-blink" />
                </p>
              </div>
            </div>
          </div>

          {/* Direct + socials */}
          <div className="flex flex-col gap-5">
            <button
              type="button"
              onClick={copyEmail}
              data-no-ripple
              className="group relative overflow-hidden rounded-lg border border-poppy/40 bg-poppy/10 p-6 text-left transition hover:border-poppy hover:glow-poppy"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-poppy-bright">
                One-click copy
              </p>
              <p className="mt-3 break-all text-2xl font-semibold tracking-tight md:text-3xl">
                {profile.email}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition group-hover:text-foreground">
                <Copy className="h-3.5 w-3.5" /> Copy address
              </span>
            </button>

            <ul className="overflow-hidden rounded-lg border border-border bg-card glass">
              {socials.map((s) => {
                const Icon = icons[s.key];
                return (
                  <li key={s.key} className="border-b border-border last:border-0">
                    <a
                      href={s.href}
                      target={s.key === "email" ? undefined : "_blank"}
                      rel="noreferrer"
                      className="group flex items-center justify-between px-5 py-4 transition hover:bg-powder/[0.05]"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-powder transition group-hover:text-poppy-bright" />
                        <span className="font-medium">{s.label}</span>
                      </span>
                      <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        {s.handle}
                        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-poppy-bright" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <footer className="mt-24 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-none tracking-tight text-powder/15">
              {profile.name}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              © {new Date().getFullYear()} · {profile.name}
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
