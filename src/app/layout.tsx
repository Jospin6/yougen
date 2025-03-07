import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/features/provider";
import { NavBar } from "@/components/navbar/navBar";
import { TopNavbar } from "@/components/navbar/topNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <div className="fixed top-0 left-0 w-full h-screen">
            <div className="flex w-full">
              <div className="w-[25%] relative h-[100vh] pb-[65px] bg-gray-900 px-4">
                <NavBar />
              </div>
              <div className="w-[75%] relative h-[100vh] bg-gray-950">
                
                {children}
              </div>
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
