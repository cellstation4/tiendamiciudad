import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nexo Commerce", template: "%s · Nexo Commerce" },
  description: "Plataforma e-commerce multiusuario y multitienda, preparada para crecer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" suppressHydrationWarning><body><ThemeProvider>{children}<Toaster richColors position="top-right" /></ThemeProvider></body></html>;
}
