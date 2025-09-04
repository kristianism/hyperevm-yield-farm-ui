import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { RainbowProvider } from "@/components/wrappers/rainbowkit-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ContractsInteractionsContextProvider } from "@/contexts/ContractsInteractionsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HyperYield",
  description: "Degens don’t wait. Why should you?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RainbowProvider>
            <ContractsInteractionsContextProvider>
              <ThemeProvider 
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="relative min-h-screen">
                    <div className="fixed top-4 right-4 z-50">
                      <ModeToggle />
                    </div>
                  {children}
                </div>
              </ThemeProvider>
            </ContractsInteractionsContextProvider>
          </RainbowProvider>
        </body>
      </html>
    </>  
  );
}
