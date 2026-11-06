import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/config";
import "./liquid-glass.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${profile.name} — Portfolio`,
  description: profile.bio,
};

export const viewport: Viewport = { themeColor: "#0a0a0c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Skip the boot animation on repeat visits in this tab, before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(sessionStorage.getItem('booted'))document.documentElement.dataset.booted='1'}catch(e){}" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
