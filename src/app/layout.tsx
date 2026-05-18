import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import { BackgroundProvider } from "@/providers/background-provider";
import { BackgroundLayer } from "@/components/backgrounds/BackgroundLayer";
import ClickSpark from "@/components/ClickSpark";
import TargetCursor from "@/components/TargetCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buildr — Find Your Perfect Builder Team",
  description:
    "AI-powered platform to discover compatible teammates for hackathons, startups, and side projects based on personality, work style, and builder chemistry.",
  keywords: [
    "hackathon",
    "team matching",
    "collaboration",
    "AI",
    "startup",
    "developer",
    "designer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased cursor-none relative`}
      >
        <BackgroundProvider>
          <BackgroundLayer />
          <div className="relative z-[1] flex flex-col min-h-screen">
            <AuthProvider>
              <TargetCursor />
              <ClickSpark sparkColor="#c084fc" sparkSize={10} sparkRadius={25} sparkCount={10} duration={600} className="flex-1 w-full relative">
                {children}
              </ClickSpark>
            </AuthProvider>
          </div>
        </BackgroundProvider>
      </body>
    </html>
  );
}
