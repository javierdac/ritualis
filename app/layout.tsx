import type { Metadata } from "next";
import { Geist, Julius_Sans_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const juliusSansOne = Julius_Sans_One({
  variable: "--font-brand",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ritualis · Dinámicas para ceremonias Scrum",
  description:
    "Gestioná proyectos, equipos y personas, y facilitá todas las ceremonias Scrum con dinámicas y timer.",
  openGraph: {
    title: "Ritualis · Dinámicas para ceremonias Scrum",
    description:
      "Facilitá las 5 ceremonias Scrum con una biblioteca de dinámicas, modo facilitador con timer y salas en vivo.",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og.png",
        width: 1402,
        height: 1122,
        alt: "Ritualis — facilitación de ceremonias Scrum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ritualis · Dinámicas para ceremonias Scrum",
    description:
      "Facilitá las 5 ceremonias Scrum con dinámicas, timer y salas en vivo.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${juliusSansOne.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
