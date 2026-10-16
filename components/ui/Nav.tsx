"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const navLinks = [
  { label: "Projects", href: "/#work", id: "work" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Certifications", href: "/#certifications", id: "certifications" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy; safe on pages without these sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        menuOpen
          ? "border-b border-white/[0.06] bg-graphite"
          : scrolled
            ? "border-b border-white/[0.06] bg-graphite/95"
            : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 font-display text-[1.05rem] font-bold tracking-[0.02em] text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <rect x="1" y="1" width="20" height="20" rx="6" fill="none" stroke="var(--color-mint)" strokeWidth="1.6" />
            <rect x="7" y="7" width="8" height="8" rx="2" fill="var(--color-mint)" />
          </svg>
          {siteConfig.name}
        </Link>

        <nav aria-label="Main">
          <ul className="hidden items-center gap-1.5 rounded-[14px] bg-white/[0.03] p-1.5 text-[0.92rem] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`block rounded-[10px] px-3.5 py-2 transition-colors ${
                      isActive ? "bg-white/[0.06] text-ink" : "text-[#c6cad2] hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={siteConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[10px] px-3.5 py-2 text-[#c6cad2] transition-colors hover:text-ink"
              >
                Résumé
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="btn-mint block rounded-[10px] px-4 py-2 font-semibold">
                Email me
              </a>
            </li>
          </ul>

          <button
            type="button"
            className="-mr-3 min-h-11 rounded px-3 text-sm text-ink md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/[0.06] px-5 pb-6 md:hidden">
          <ul className="flex flex-col pt-2">
            {[
              ...navLinks,
              { label: "Résumé", href: siteConfig.resume, id: "resume" },
              { label: "Email me", href: `mailto:${siteConfig.email}`, id: "email" },
            ].map((link) => (
              <li key={link.href} className="border-b border-line last:border-b-0">
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  {...(link.id === "resume" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block py-3.5 text-base text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
