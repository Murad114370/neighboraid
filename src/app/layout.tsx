import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "@/components/Footer";
import { Suspense } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OpenSans = Open_Sans({
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "NeighborAid | Community Platform",
description: "Connecting local communities for social good and volunteer events in Chattogram.",};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${OpenSans.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          <Suspense fallback={<div className="h-16 bg-slate-900" />}>
          <Navbar />
        </Suspense>

          {children}

          <ToastContainer position="top-right" autoClose={3000} />

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
