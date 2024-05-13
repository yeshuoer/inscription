import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import GlobalHeader from "@/components/GlobalHeader";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inscription Market",
  description: "Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="autumn">
      <body className={inter.className}>
        <Providers>
          <div className="pt-24 px-6">
            <GlobalHeader />
            <Toaster />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
