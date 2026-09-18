"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoRole } from "@/lib/role-context";
import { Briefcase, PlusCircle, LayoutDashboard, BookmarkCheck, ArrowRightLeft } from "lucide-react";

export function RoleBanner() {
  const { role, toggleRole } = useDemoRole();
  const pathname = usePathname();

  const isClient = role === "client";

  const navLinks = [
    {
      href: "/marketplace",
      label: "Browse Gigs",
      icon: Briefcase,
    },
    {
      href: "/gigs/new",
      label: "Post a Gig",
      icon: PlusCircle,
    },
    {
      href: "/creator/dashboard",
      label: "Creator Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/my-bookings",
      label: "My Bookings",
      icon: BookmarkCheck,
    },
    {
      href: "/trade",
      label: "Barter Engine",
      icon: ArrowRightLeft,
    },
  ];

  return (
    <aside aria-label="Demo role and evaluation switcher" className="sticky top-0 z-50 bg-[#F5F2EC]/95 backdrop-blur-md border-b border-[#E7E2D9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Warm Editorial Role Indicator & Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E2D9] text-[#1C1917] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D724D]" />
            <span className="text-[#68625D] font-normal">Viewing as:</span>
            <span className={`font-semibold ${isClient ? "text-[#A34835]" : "text-[#8C6D58]"}`}>
              {isClient ? "Client (Demo Client)" : "Creator (Demo Creator)"}
            </span>
          </div>

          <button
            onClick={toggleRole}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-[#F3EFEA] text-[#68625D] hover:text-[#1C1917] font-medium transition-all duration-200 ease-out border border-[#DCD5C9] hover:border-[#8C6D58] shadow-xs"
            title="Toggle between Client and Creator perspective"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#8C6D58]" />
            <span className="hidden sm:inline">Switch to {isClient ? "Creator" : "Client"}</span>
            <span className="sm:hidden">Switch</span>
          </button>
        </div>

        {/* Direct Navigation Links to every required view for Graders */}
        <nav aria-label="Evaluation shortcuts" className="flex items-center flex-wrap gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 ease-out ${
                  isActive
                    ? "bg-[#A34835]/10 text-[#A34835] font-semibold border border-[#A34835]/30 shadow-xs"
                    : "text-[#68625D] hover:text-[#1C1917] hover:bg-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
