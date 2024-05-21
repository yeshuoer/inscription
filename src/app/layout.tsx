import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import GlobalHeader from "@/components/GlobalHeader";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inscription Market",
  description: "Market",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
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
