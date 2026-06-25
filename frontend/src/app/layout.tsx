import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Inter } from "next/font/google";
import { Barlow } from "next/font/google";

import StyledComponentsRegistry from "@/lib/registry";
import Providers from "./providers";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
});

const barlow = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-regular",
});
const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LoadUp",
  description: "Seu app de treinos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head></head>
      <body
        className={`${bebasNeue.variable} ${barlowCondensed.variable} ${inter.variable} ${barlow.variable}`}
      >
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
