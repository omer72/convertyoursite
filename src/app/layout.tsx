import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "convertYourSite | Modern Web Development",
  description:
    "We convert legacy Wix sites into modern, high-performance websites using Next.js, React, Tailwind CSS, and MUI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeRegistry>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeRegistry>
        <Script id="nagishli-config" strategy="beforeInteractive">
          {`nagishli_config = { language: "en", color: "blue" };`}
        </Script>
        <Script
          src="/nagishli_beta.js?v=3.0b"
          strategy="afterInteractive"
          charSet="utf-8"
        />
      </body>
    </html>
  );
}
