// components/HeroSection.tsx — full replacement
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Swap this URL with any cinematic landscape you prefer
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2400&q=90";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);   // ← NEW: bg image wrapper
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const metaRef      = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── Scroll parallax on hero image ───────────────────────────────
      // As section scrolls out, image drifts downward — classic depth illusion
      gsap.to(bgRef.current, {
        yPercent: 18,             // moves 18% of its height downward
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,            // ties directly to scroll position
        },
      });

      // ── Entrance timeline (unchanged) ───────────────────────────────
      const tl = gsap.timeline({ delay: 0.15 });

      tl.from(headlineRef.current, {
        y: 75,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      })
        .from(
          metaRef.current,
          { y: 24, opacity: 0, duration: 1, ease: "power3.out" },
          "-=1"
        )
        .from(
          scrollLineRef.current,
          {
            scaleY: 0,
            transformOrigin: "top center",
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5"
        );

      // Breathing pulse on scroll line
      gsap.to(scrollLineRef.current, {
        opacity: 0.15,
        repeat: -1,
        yoyo: true,
        duration: 1.7,
        ease: "power1.inOut",
        delay: 2,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex flex-col justify-end
                 px-6 pb-16 md:px-14 md:pb-20 overflow-hidden"
    >
      {/* ── Background image ─────────────────────────────────────────── */}
      {/* Wrapper is slightly taller than viewport so parallax shift
          doesn't expose the bg color underneath                         */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full"
        style={{ height: "120%", top: "-10%", willChange: "transform" }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Cinematic landscape — hero background"
          fill
          priority                    // above the fold — load immediately
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
          
        />
      </div>

      {/* ── Gradient overlays ────────────────────────────────────────── */}
      {/* Top: fades image into darkness so the nav reads cleanly        */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, transparent 35%)",
        }}
      />
      {/* Bottom: darkens the lower half where the headline sits         */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.9) 100%)",
        }}
      />

      {/* ── Ghost numeral (unchanged) ────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center
                   pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-cormorant leading-none"
          style={{
            fontSize: "clamp(9rem, 26vw, 22rem)",
            fontWeight: 300,
            color: "transparent",
            WebkitTextStroke: "1px rgba(200, 169, 110, 0.07)",
            letterSpacing: "-0.04em",
          }}
        >
          01
        </span>
      </div>

      {/* ── Headline (unchanged) ─────────────────────────────────────── */}
      <div className="relative z-10">
        <h1
          ref={headlineRef}
          className="font-cormorant"
          style={{
            fontSize: "clamp(3.2rem, 9vw, 8.5rem)",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            color: "var(--color-text)",
          }}
        >
          Still frames,
          <br />
          <em>infinite</em> depth.
        </h1>

        <div ref={metaRef} className="mt-7 flex items-start gap-10">
          <p
            className="font-sans text-sm leading-relaxed"
            style={{
              color: "var(--color-meta)",
              fontWeight: 300,
              maxWidth: "32ch",
            }}
          >
            Photography at the edge of light — landscapes held in the breath
            between stillness and motion.
          </p>
        </div>
      </div>

      {/* ── Scroll indicator (unchanged) ─────────────────────────────── */}
      <div className="absolute bottom-8 right-6 md:right-14 flex flex-col items-center gap-2">
        <span
          className="font-sans text-[10px] tracking-[0.24em] mb-1"
          style={{
            color: "var(--color-meta)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          scroll
        </span>
        <div
          ref={scrollLineRef}
          className="w-px"
          style={{ height: "60px", backgroundColor: "var(--color-accent)" }}
        />
      </div>
    </section>
  );
}