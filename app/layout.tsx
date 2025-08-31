import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Katitects - AI-Powered Architecture & Interior Design",
  description:
    "Transform your building designs with cutting-edge AI technology for rendering, visualization, and creative workflows.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="w-full h-full flex flex-col mx-auto">
            <Header />

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
