import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import GlobalHeader from "@/components/GlobalHeader";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Session } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inscription Market",
  description: "Market",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session;
}>) {
  return (
    <html lang="en" data-theme="autumn">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <div className="py-24 px-6">
              <GlobalHeader />
              <Toaster />
              {children}
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
