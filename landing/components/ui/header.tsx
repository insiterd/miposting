"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-2 z-30 w-full md:top-6 transition-all duration-500 ${
        scrolled
          ? "translate-y-0 opacity-100"
          : "-translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-center gap-6 rounded-2xl bg-white/90 px-6 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <Logo />

          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            Funcionalidades
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            Precios
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            FAQ
          </Link>

          <div className="ml-2 flex items-center gap-3">
            <Link
              href="https://insiterd.miposting.com/login"
              className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="https://insiterd.miposting.com/register"
              className="btn-sm bg-blue-500 text-gray-200 shadow-sm hover:bg-blue-600"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
