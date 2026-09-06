"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CONTACT_ITEMS = [
  { label: "Email", value: "studio@frameandlight.com", href: "mailto:studio@frameandlight.com" },
  { label: "Instagram", value: "@frameandlight", href: "https://instagram.com" },
  { label: "Based in", value: "Reykjavik / Edinburgh", href: null },
] as const;

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reveals = sectionRef.current?.querySelectorAll(".js-reveal");
      if (!reveals?.length) return;

      gsap.from(Array.from(reveals), {
        y: 36,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-bg min-h-screen flex flex-col justify-center
                 px-6 py-24 md:px-14 md:py-32"
    >
      <p
        className="js-reveal font-sans text-[10px] tracking-[0.28em] mb-10"
        style={{ color: "var(--color-accent)" }}
      >
        Contact
      </p>

      <h2
        className="js-reveal font-cormorant"
        style={{
          fontSize: "clamp(3rem, 11vw, 9rem)",
          fontWeight: 300,
          lineHeight: 0.9,
          letterSpacing: "-0.025em",
          color: "var(--color-text)",
        }}
      >
        Let&apos;s make
        <br />
        something <em>rare.</em>
      </h2>

      {/* Contact items */}
      <div className="js-reveal mt-16 md:mt-20 flex flex-col md:flex-row gap-10 md:gap-24">
        {CONTACT_ITEMS.map(({ label, value, href }) => (
          <div key={label} className="flex flex-col gap-2">
            <p
              className="font-sans text-[10px] tracking-[0.2em]"
              style={{ color: "var(--color-meta)" }}
            >
              {label}
            </p>
            {href ? (
              <a
                href={href}
                className="font-sans text-sm transition-opacity duration-300 hover:opacity-40"
                style={{ color: "var(--color-text)", fontWeight: 300 }}
              >
                {value}
              </a>
            ) : (
              <p
                className="font-sans text-sm"
                style={{ color: "var(--color-text)", fontWeight: 300 }}
              >
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer rule */}
      <div
        className="js-reveal mt-24 pt-7 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(92,92,92,0.18)" }}
      >
        <span
          className="font-sans text-[11px]"
          style={{ color: "var(--color-meta)", fontWeight: 300 }}
        >
          Frame & Light © 2024
        </span>
        <span
          className="font-sans text-[11px]"
          style={{ color: "var(--color-meta)", fontWeight: 300 }}
        >
          Cinematic Photography
        </span>
      </div>
    </section>
  );
}
