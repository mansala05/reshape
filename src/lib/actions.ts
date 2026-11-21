import { toast } from "sonner";

import { profile } from "@/data/portfolio";
import { playSound } from "./sound";
import { getUI } from "./ui-store";

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    playSound("success");
    toast.success("Email copied", { description: profile.email });
  } catch {
    toast.error("Couldn't copy — your browser blocked clipboard access", { description: profile.email });
  }
}

export function scrollToSection(id: string) {
  const behavior: ScrollBehavior = getUI().reducedMotion ? "auto" : "smooth";
  if (id === "top") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}
