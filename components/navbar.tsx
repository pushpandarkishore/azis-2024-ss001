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
    <header className="sticky top-[41px] z-40 bg-[#1F2224]/90 backdrop-blur-md border-b border-[#3A3A3A]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - Modern Editorial Luxury */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#2E2E2E] border border-[#3A3A3A] flex items-center justify-center text-[#C46A6D] group-hover:border-[#C46A6D] transition-colors duration-200">
            <span className="font-serif text-lg font-bold">S</span>
          </div>
          <span className="font-serif text-2xl font-normal tracking-tight text-[#E6E8E8]">
            Skill<span className="text-[#C46A6D] italic">Swap</span>
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
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                  isActive
                    ? "text-[#E6E8E8] bg-[#2E2E2E] border border-[#3A3A3A]"
                    : "text-[#CFC7C1] hover:text-[#E6E8E8] hover:bg-[#262626]"
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
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-[#C46A6D] text-white text-sm font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Gig</span>
          </Link>

          <button
            className="md:hidden p-2 rounded-xl text-[#CFC7C1] hover:text-[#E6E8E8] hover:bg-[#2E2E2E] border border-[#3A3A3A] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#3A3A3A] bg-[#1F2224] px-4 py-4 flex flex-col gap-1.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#CFC7C1] hover:text-[#E6E8E8] hover:bg-[#2E2E2E] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/gigs/new"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[16px] bg-[#C46A6D] text-white text-sm font-medium hover:bg-[#B55B5E] transition-colors"
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
