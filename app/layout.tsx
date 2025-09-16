import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { RainbowProvider } from "@/components/wrappers/rainbowkit-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ContractsInteractionsContextProvider } from "@/contexts/ContractsInteractionsContext";
import "@/app/globals.css";

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
    <html>
      <body className="antialised">
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
  );
}
