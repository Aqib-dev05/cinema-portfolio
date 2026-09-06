"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const NAV_LINKS = ["Work", "About", "Contact"] as const;

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(navRef.current, {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.3, // After hero headline animates in
      });
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                 px-6 py-5 md:px-14 md:py-7"
      style={{ mixBlendMode: "difference" }}
    >
      <a
        href="#"
        className="font-sans text-[11px] tracking-[0.35em] uppercase"
        style={{ color: "white", fontWeight: 400 }}
      >
        Frame & Light
      </a>

      <ul className="flex items-center gap-7 md:gap-10">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="font-sans text-[11px] tracking-widest transition-opacity duration-300 hover:opacity-40"
              style={{ color: "white", fontWeight: 300 }}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
