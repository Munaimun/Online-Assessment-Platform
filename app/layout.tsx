import type { Metadata } from "next";
import { Chivo, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const headingFont = Chivo({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akij Online Assessment Platform",
  description: "Employer and Candidate panels for online assessment workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full bg-app-base text-zinc-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
