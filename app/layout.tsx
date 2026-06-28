import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, Bebas_Neue } from "next/font/google";
import { siteUrl } from "./site";
import "./globals.css";

const TITLE = "Eventime Sound — Productora de eventos en directo";
const DESCRIPTION =
  "Creamos experiencias de concierto inolvidables. Producción, sonido y line-ups que hacen vibrar a miles de personas.";
const OG_IMAGE = "/500542190_4115875561967357_2471842936655101842_n.jpg";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/EVENTIME sound LOGO.png",
    shortcut: "/EVENTIME sound LOGO.png",
    apple: "/EVENTIME sound LOGO.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Eventime Sound",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    images: [{ url: OG_IMAGE, width: 2048, height: 1365, alt: "Eventime Sound en directo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

// Match the mobile browser chrome to the page and declare the light scheme so
// the UA doesn't dark-invert form controls/scrollbars.
export const viewport: Viewport = {
  themeColor: "#F2F0EB",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${bebasNeue.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
