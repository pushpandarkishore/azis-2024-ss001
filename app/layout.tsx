import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleProvider } from "@/lib/role-context";
import { RoleBanner } from "@/components/role-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SkillSwap — Warm Ivory & Espresso Editorial Creator Marketplace",
  description: "A modern editorial marketplace for creators to exchange craft, collaborate, and book services.",
  keywords: ["freelance", "barter", "creative", "skills", "marketplace", "video editor", "designer", "copywriter"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} font-sans antialiased min-h-screen bg-[#FBF9F5] text-[#1C1917]`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <RoleProvider>
            <RoleBanner />
            <Navbar />
            <main>{children}</main>
          </RoleProvider>
          <footer className="border-t border-[#E7E2D9] mt-24 py-16 px-4 sm:px-8 bg-[#FBF9F5]">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[#68625D] text-xs">
              <div className="flex items-center gap-3">
                <span className="font-serif text-xl font-light text-[#1C1917]">
                  Skill<span className="text-[#A34835] italic">Swap</span>
                </span>
                <span className="text-[#DCD5C9]">&middot;</span>
                <span className="tracking-wider uppercase text-[11px] font-mono text-[#8C6D58]">Editorial Creator Exchange</span>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <a href="/marketplace" className="hover:text-[#1C1917] transition-colors">Marketplace</a>
                <a href="/gigs/new" className="hover:text-[#1C1917] transition-colors">Post a Gig</a>
                <a href="/creator/dashboard" className="hover:text-[#1C1917] transition-colors">Creator Dashboard</a>
                <a href="/my-bookings" className="hover:text-[#1C1917] transition-colors">My Bookings</a>
                <a href="/trade" className="hover:text-[#1C1917] transition-colors">Barter Calculator</a>
              </div>
              <p className="font-mono text-[11px] text-[#8E8780]">AZIS-2024-SS001 &middot; Track 2</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
