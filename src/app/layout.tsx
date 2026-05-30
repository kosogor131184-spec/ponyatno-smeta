import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Понятно Смета — Строительные сметы на понятном языке",
  description:
    "Превращаем стандартные сметы в ясные таблицы. Вы видите сколько стоит каждая работа, каждый материал и сколько вы заработаете.",
  keywords: [
    "смета",
    "строительная смета",
    "понятно смета",
    "расшифровка сметы",
    "анализ сметы",
    "строительство",
    "подрядчик",
    "предприниматель",
  ],
  authors: [{ name: "Косогор Михаил Васильевич" }],
  openGraph: {
    title: "Понятно Смета — Строительные сметы на понятном языке",
    description:
      "Превращаем стандартные сметы в ясные таблицы. Вы видите сколько стоит каждая работа, каждый материал и сколько вы заработаете.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
