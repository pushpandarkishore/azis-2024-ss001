import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleProvider } from "@/lib/role-context";
import { RoleBanner } from "@/components/role-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SkillSwap — Creator Economy Marketplace",
  description: "Exchange creative services without cash. Match skills, calculate fair value, generate collaboration briefs.",
  keywords: ["freelance", "barter", "creative", "skills", "marketplace", "video editor", "designer", "copywriter"],
  openGraph: {
    title: "SkillSwap — Creator Economy Marketplace",
    description: "AI-powered skill exchange for young creatives",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <RoleProvider>
            <RoleBanner />
            <Navbar />
            <main>{children}</main>
          </RoleProvider>
          <footer className="border-t border-border mt-20 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
                <span className="font-semibold text-foreground">SkillSwap</span>
                <span>© 2024</span>
              </div>
              <div className="flex gap-6">
                <a href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</a>
                <a href="/trade" className="hover:text-foreground transition-colors">Trade Calculator</a>
                <a href="/profile/new" className="hover:text-foreground transition-colors">Join</a>
                <a href="/api/v1/health" className="hover:text-foreground transition-colors">API</a>
              </div>
              <p className="text-xs">AZIS-UXE4MN · CODE2CAREER Track 2</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
