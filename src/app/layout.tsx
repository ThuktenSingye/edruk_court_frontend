/** @format */

import type { Metadata } from "next";
import { Arvo, Roboto } from "next/font/google";
import "./globals.css";

const arvoSan = Arvo({
  variable: "--font-arvo",
  weight: "400",
  subsets: ["latin"],
});

const robotoSan = Roboto({
  variable: "--font-roboto",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eDruk-Court",
  description: "ECourt System for Bhutan ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arvoSan.variable} ${robotoSan.variable} antialiased `}>
        {children}
      </body>
    </html>
  );
}
