import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function ProjectGallery({
  screenshots,
}: {
  screenshots: NonNullable<Project["screenshots"]>;
}) {
  const [selected, setSelected] = useState(0);
  const [originalSize, setOriginalSize] = useState(false);
  const screenshot = screenshots[selected];
  if (!screenshot) return null;

  const groups = [
    { label: "Project images", images: screenshots.filter((image) => image.kind !== "event") },
    {
      label: "Event photos & recognition",
      images: screenshots.filter((image) => image.kind === "event"),
    },
  ].filter((group) => group.images.length > 0);
  const activeGroup = groups.find((group) => group.images.includes(screenshot))!;
  const groupIndex = activeGroup.images.indexOf(screenshot);
  const selectImage = (index: number) => {
    setSelected(index);
    setOriginalSize(false);
  };
  const step = (direction: number) => {
    const next =
      activeGroup.images[
        (groupIndex + direction + activeGroup.images.length) % activeGroup.images.length
      ];
    if (next) selectImage(screenshots.indexOf(next));
  };

  return (
    <div className="min-w-0 bg-background">
      <div
        className="flex flex-wrap items-center gap-2 border-b border-border p-4"
        role="group"
        aria-label="Gallery categories"
      >
        {groups.map((group) => (
          <button
            key={group.label}
            type="button"
            onClick={() => {
              const first = group.images[0];
              if (first) selectImage(screenshots.indexOf(first));
            }}
            aria-pressed={group === activeGroup}
            className={cn(
              "rounded-sm border px-3 py-2 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-powder",
              group === activeGroup
                ? "border-powder bg-powder/10 text-powder"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {group.label} ({group.images.length})
          </button>
        ))}
      </div>
      <Dialog onOpenChange={() => setOriginalSize(false)}>
        <figure>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`Enlarge image: ${screenshot.alt}`}
              className="group relative block h-80 w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-powder md:h-[460px]"
            >
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className={
                  screenshot.crop
                    ? "h-full w-full object-cover object-top"
                    : "h-full w-full object-contain"
                }
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-sm border border-powder/40 bg-background/90 px-3 py-2 text-xs text-foreground transition group-hover:bg-powder group-hover:text-primary-foreground">
                <Maximize2 className="h-4 w-4" /> Enlarge image
              </span>
            </button>
          </DialogTrigger>
          <figcaption className="flex items-start justify-between gap-4 px-5 py-3 text-sm text-muted-foreground">
            <span>{screenshot.alt}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums" aria-live="polite">
              {groupIndex + 1} / {activeGroup.images.length}
            </span>
          </figcaption>
        </figure>
        <DialogContent className="h-[92svh] max-h-[92svh] w-[calc(100%-1rem)] max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden border-border bg-popover p-0 sm:rounded-lg">
          <div className="border-b border-border p-4 pr-12">
            <DialogTitle className="text-base">Expanded project image</DialogTitle>
            <DialogDescription className="mt-1 text-xs">{screenshot.alt}</DialogDescription>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOriginalSize((value) => !value)}
                aria-pressed={originalSize}
                className="rounded-sm border border-border px-3 py-2 text-xs hover:border-powder"
              >
                {originalSize ? "Fit width" : "Original size"}
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={activeGroup.images.length < 2}
                aria-label="Previous image"
                className="rounded-sm border border-border p-2 hover:border-powder disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={activeGroup.images.length < 2}
                aria-label="Next image"
                className="rounded-sm border border-border p-2 hover:border-powder disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="font-mono text-xs text-muted-foreground" aria-live="polite">
                {groupIndex + 1} / {activeGroup.images.length}
              </span>
            </div>
          </div>
          <div
            key={`${screenshot.src}-${originalSize}`}
            tabIndex={0}
            role="region"
            aria-label="Scrollable full image"
            className="min-h-0 min-w-0 overflow-auto overscroll-contain bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-powder"
          >
            <img
              src={screenshot.src}
              alt={screenshot.alt}
              className={cn("mx-auto block h-auto", originalSize ? "w-auto max-w-none" : "w-full")}
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-wrap gap-2 p-4" role="group" aria-label="Project image thumbnails">
        {activeGroup.images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => selectImage(screenshots.indexOf(image))}
            aria-label={`View image: ${image.alt}`}
            aria-pressed={image === screenshot}
            className={cn(
              "overflow-hidden rounded-sm border focus-visible:outline focus-visible:outline-2 focus-visible:outline-powder",
              image === screenshot ? "border-powder" : "border-border",
            )}
          >
            <img
              src={image.src}
              alt=""
              loading="lazy"
              className="h-12 w-20 object-cover object-top"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
