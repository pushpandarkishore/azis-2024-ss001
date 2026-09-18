import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : "New";
}

export function formatSkillCredits(credits: number): string {
  if (credits >= 1000) return `${(credits / 1000).toFixed(1)}k SC`;
  return `${credits} SC`;
}

export function getAvailabilityColor(availability: string): string {
  switch (availability) {
    case "available": return "text-emerald-500";
    case "busy": return "text-amber-500";
    case "unavailable": return "text-red-500";
    default: return "text-muted-foreground";
  }
}

export function getAvailabilityBadge(availability: string): string {
  switch (availability) {
    case "available": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "busy": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "unavailable": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getFairnessColor(score: number): string {
  if (score >= 0.8) return "text-emerald-500";
  if (score >= 0.6) return "text-amber-500";
  return "text-red-500";
}

export function getFairnessLabel(score: number): string {
  if (score >= 0.8) return "Fair Exchange";
  if (score >= 0.6) return "Slight Imbalance";
  return "Significant Imbalance";
}

export function getAvatarUrl(name: string, seed?: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
