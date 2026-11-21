import type { PreviewKind } from "@/data/portfolio";
import { AudioPreview } from "./AudioPreview";
import { FluidPreview } from "./FluidPreview";
import { KineticPreview } from "./KineticPreview";
import { SpatialPreview } from "./SpatialPreview";

export function ProjectPreview({ kind, interactive = true }: { kind: PreviewKind; interactive?: boolean }) {
  switch (kind) {
    case "audio":
      return <AudioPreview interactive={interactive} />;
    case "fluid":
      return <FluidPreview />;
    case "spatial":
      return <SpatialPreview />;
    case "kinetic":
      return <KineticPreview />;
  }
}
