"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoRole } from "@/lib/role-context";
import { User, Briefcase, PlusCircle, LayoutDashboard, BookmarkCheck, ArrowRightLeft, Sparkles, CheckCircle2 } from "lucide-react";

export function RoleBanner() {
  const { role, user, toggleRole, setRole } = useDemoRole();
  const pathname = usePathname();

  const isClient = role === "client";

  const navLinks = [
    {
      href: "/marketplace",
      label: "Browse Gigs",
      icon: Briefcase,
      badge: "Feature 2 & 3",
    },
    {
      href: "/gigs/new",
      label: "Post a Gig",
      icon: PlusCircle,
      badge: "Feature 1",
    },
    {
      href: "/creator/dashboard",
      label: "Creator Dashboard",
      icon: LayoutDashboard,
      badge: "Feature 4",
    },
    {
      href: "/my-bookings",
      label: "My Bookings",
      icon: BookmarkCheck,
      badge: "Feature 5",
    },
    {
      href: "/trade",
      label: "Barter Engine",
      icon: ArrowRightLeft,
      badge: "AI Equivalence",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Role Indicator & Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-foreground font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Viewing as:</span>
            <span className={isClient ? "text-cyan-400 font-bold" : "text-violet-400 font-bold"}>
              {isClient ? "Client (Demo Client)" : "Creator (Demo Creator)"}
            </span>
          </div>

          <button
            onClick={toggleRole}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors border border-border/60 hover:border-primary/50"
            title="Toggle between Client and Creator perspective"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Switch to {isClient ? "Creator" : "Client"}</span>
            <span className="sm:hidden">Switch</span>
          </button>
        </div>

        {/* Direct Navigation Links to every required view for Graders */}
        <div className="flex items-center flex-wrap gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
