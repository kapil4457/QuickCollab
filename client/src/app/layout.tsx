import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/provider";
import NavBar from "@/components/NavBar/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import FooterComp from "@/components/Footer/Footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickCollab",
  description: "QuickCollab",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <NavBar />
            {children}
            <FooterComp />
            <Toaster reverseOrder={false} position="top-center" />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
