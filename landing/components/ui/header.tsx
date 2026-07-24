"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="relative flex h-14 items-center justify-between rounded-2xl bg-white/90 px-6 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
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
              href="/#faq"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="https://app.miposting.com/login"
              className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="https://app.miposting.com/register"
              className="btn-sm bg-blue-500 text-gray-200 shadow-sm hover:bg-blue-600"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 md:hidden rounded-2xl bg-white/95 px-6 py-4 shadow-lg shadow-black/[0.03] backdrop-blur-md border border-gray-100 flex flex-col gap-4">
              <Link
                href="/#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
              >
                Funcionalidades
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
              >
                Precios
              </Link>
              <Link
                href="/#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
              >
                FAQ
              </Link>
              <div className="h-px w-full bg-gray-100 my-1"></div>
              <div className="flex flex-col gap-3">
                <Link
                  href="https://app.miposting.com/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50 border border-gray-200 justify-center"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="https://app.miposting.com/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-sm bg-blue-500 text-gray-200 shadow-sm hover:bg-blue-600 justify-center"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
