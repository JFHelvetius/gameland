import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://gameland-app.vercel.app";

export const metadata: Metadata = {
  title: "Gameland — Preservación del Videojuego",
  description: "Juega a los clásicos de NES, SNES, Mega Drive, Game Boy y Nintendo 64 directamente en tu PC. Descarga y juega en segundos.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Gameland — Preservación del Videojuego",
    description: "Más de 4.500 juegos retro: NES, SNES, Mega Drive, Game Boy y N64. Descarga el instalador y juega en tu PC.",
    url: BASE_URL,
    siteName: "Gameland",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gameland — Preservación del Videojuego",
    description: "Más de 4.500 juegos retro para PC. Instala y juega en segundos.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${pressStart.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-inter, sans-serif)" }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
