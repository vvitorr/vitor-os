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

const BOOT_SCRIPT = `try{var d=document.documentElement,s=localStorage;
d.dataset.theme=s.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
d.dataset.wallpaper=s.getItem('wallpaper')||'bigsur';
if(sessionStorage.getItem('booted'))d.dataset.booted='1'}catch(e){}`;

export const viewport: Viewport = { themeColor: "#0a0a0c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: theme, wallpaper, and skip the boot animation on repeat visits in this tab. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
