import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { TelegramProvider } from "@/components/layout/TelegramProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APEX TECH — Интернет-магазин электроники в Ташкенте",
  description: "Оригинальные смартфоны, ноутбуки, наушники и гаджеты в Ташкенте с официальной гарантией и экспресс-доставкой.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F8F8] text-[#25252B] selection:bg-[#528A9A] selection:text-white">
        <TelegramProvider>
          <StoreProvider>
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
