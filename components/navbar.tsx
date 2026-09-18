"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/gigs/new", label: "Post a Gig" },
    { href: "/creator/dashboard", label: "Creator Dashboard" },
    { href: "/my-bookings", label: "My Bookings" },
    { href: "/trade", label: "Barter Calculator" },
  ];

  return (
    <header className="sticky top-[41px] z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E7E2D9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Warm Editorial Luxury */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E7E2D9] flex items-center justify-center text-[#A34835] group-hover:border-[#A34835] transition-colors duration-200 shadow-xs">
            <span className="font-serif text-lg font-bold">S</span>
          </div>
          <span className="font-serif text-2xl font-light tracking-tight text-[#1C1917]">
            Skill<span className="text-[#A34835] italic">Swap</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all duration-200 ease-out ${
                  isActive
                    ? "text-[#1C1917] bg-white border border-[#E7E2D9] shadow-xs"
                    : "text-[#68625D] hover:text-[#1C1917] hover:bg-[#F3EFEA]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Primary CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/gigs/new"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-[0_4px_14px_rgba(163,72,53,0.2)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Gig</span>
          </Link>

          <button
            className="md:hidden p-2 rounded-xl text-[#68625D] hover:text-[#1C1917] hover:bg-white border border-[#E7E2D9] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E7E2D9] bg-[#FBF9F5] px-4 py-4 flex flex-col gap-1.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#68625D] hover:text-[#1C1917] hover:bg-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/gigs/new"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Gig</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
