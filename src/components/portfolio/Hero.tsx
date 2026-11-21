import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { profile } from "@/data/portfolio";

function LocalTime() {
  const [time, setTime] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Colombo", hour12: false }));
    fmt();
    const id = window.setInterval(fmt, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

function LocalDate() {
  const [date, setDate] = useState<string>("--");
  useEffect(() => {
    const format = () =>
      setDate(
        new Date().toLocaleDateString("en-GB", {
          timeZone: "Asia/Colombo",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    format();
    const id = window.setInterval(format, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return <span>{date}</span>;
}
export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="animate-rise" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-poppy/40 bg-poppy/10 py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
            <span className="relative h-2 w-2 rounded-full bg-poppy-bright animate-pulse-dot" />
            {profile.availability}
          </span>
        </div>

        <h1 className="mt-8 max-w-5xl text-balance-tight text-[clamp(3.4rem,11vw,10.5rem)] font-semibold leading-[0.86]">
          <span className="block animate-rise" style={{ animationDelay: "0.2s" }}>
            {first}
          </span>
          <span className="block animate-rise text-powder" style={{ animationDelay: "0.3s" }}>
            {rest.join(" ") || "\u00a0"}
            <span className="text-poppy-bright">.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="animate-rise md:col-span-6" style={{ animationDelay: "0.45s" }}>
            <p className="font-serif text-3xl italic leading-tight text-foreground md:text-4xl">
              {profile.title}
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>
          </div>

          <dl
            className="animate-rise grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-xs uppercase tracking-[0.14em] md:col-span-4 md:col-start-9"
            style={{ animationDelay: "0.55s" }}
          >
            <div>
              <dt className="text-powder/60">Based in</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-foreground">
                <MapPin className="h-3 w-3 text-poppy-bright" />
                {profile.location}
              </dd>
            </div>
            <div>
              <dt className="text-powder/60">Local time</dt>
              <dd className="mt-1 text-foreground">
                <LocalTime />
              </dd>
            </div>
            <div>
              <dt className="text-powder/60">Timezone</dt>
              <dd className="mt-1 text-foreground">{profile.timezone}</dd>
            </div>
            <div>
              <dt className="text-powder/60">Date</dt>
              <dd className="mt-1 text-foreground">
                <LocalDate />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
