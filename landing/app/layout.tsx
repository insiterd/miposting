import "./css/style.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "miposting — Gestiona tus redes sociales desde un solo lugar",
  description:
    "Programa, publica y analiza contenido en 28+ plataformas sociales. La herramienta todo-en-uno para agencias de marketing en República Dominicana.",
  icons: {
    icon: "/miposting-favi.svg",
    apple: "/miposting-favi.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} bg-gray-50 font-inter tracking-tight text-gray-900 antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {children}
        </div>
      </body>
    </html>
  );
}
