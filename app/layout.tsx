import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";
import FontLoader from "@/components/FontLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xandeum pNode Analytics | Real-time Storage Provider Dashboard",
  description: "Analytics platform for Xandeum pNodes - monitor storage provider nodes, view statistics, and track network health in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-display bg-background-dark`}
      >
        <FontLoader />
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
