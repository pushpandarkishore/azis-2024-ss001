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
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SkillSwap — Premium Editorial Creator Marketplace",
  description: "A modern editorial marketplace for creators to exchange craft, collaborate, and book services.",
  keywords: ["freelance", "barter", "creative", "skills", "marketplace", "video editor", "designer", "copywriter"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} font-sans antialiased min-h-screen bg-[#1F2224] text-[#E6E8E8]`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <RoleProvider>
            <RoleBanner />
            <Navbar />
            <main>{children}</main>
          </RoleProvider>
          <footer className="border-t border-[#3A3A3A] mt-24 py-16 px-4 sm:px-8 bg-[#1F2224]">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[#CFC7C1] text-xs">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-normal text-[#E6E8E8]">
                  Skill<span className="text-[#C46A6D] italic">Swap</span>
                </span>
                <span className="text-[#7A7A7A]">&middot;</span>
                <span>Editorial Creator Exchange</span>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <a href="/marketplace" className="hover:text-[#E6E8E8] transition-colors">Marketplace</a>
                <a href="/gigs/new" className="hover:text-[#E6E8E8] transition-colors">Post a Gig</a>
                <a href="/creator/dashboard" className="hover:text-[#E6E8E8] transition-colors">Creator Dashboard</a>
                <a href="/my-bookings" className="hover:text-[#E6E8E8] transition-colors">My Bookings</a>
                <a href="/trade" className="hover:text-[#E6E8E8] transition-colors">Barter Calculator</a>
              </div>
              <p className="font-mono text-[11px] text-[#7A7A7A]">AZIS-2024-SS001 &middot; Track 2</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
