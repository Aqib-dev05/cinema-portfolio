"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Image slides up from slight offset
      gsap.from(imageRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // Text block reveals slightly after image
      gsap.from(textRef.current, {
        y: 36,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // Stats stagger in
      const statItems = statsRef.current?.children;
      if (statItems) {
        gsap.from(Array.from(statItems), {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-bg px-6 py-24 md:px-14 md:py-32
                 grid md:grid-cols-2 gap-14 md:gap-20 items-center"
    >
      {/* Image column */}
      <div
        ref={imageRef}
        className="relative overflow-hidden w-full"
        style={{ aspectRatio: "3 / 4", maxHeight: "72vh" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=900&q=80"
          alt="Photographer behind the lens"
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        {/* Subtle vignette at base */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 65%, rgba(10,10,10,0.55))",
          }}
        />
      </div>

      {/* Text column */}
      <div ref={textRef} className="flex flex-col gap-7">
        <p
          className="font-sans text-[10px] tracking-[0.28em]"
          style={{ color: "var(--color-accent)" }}
        >
          About
        </p>

        <h2
          className="font-cormorant"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
          }}
        >
          Light is the material.
          <br />
          <em>Patience</em> is the method.
        </h2>

        <p
          className="font-sans leading-relaxed"
          style={{
            color: "var(--color-meta)",
            fontWeight: 300,
            fontSize: "0.875rem",
            maxWidth: "38ch",
          }}
        >
          Based between Reykjavik and Edinburgh, I work at the edge of natural
          light — waiting for the precise moment when landscape and atmosphere
          become one.
        </p>

        <p
          className="font-sans leading-relaxed"
          style={{
            color: "var(--color-meta)",
            fontWeight: 300,
            fontSize: "0.875rem",
            maxWidth: "38ch",
          }}
        >
          Each image is an act of subtraction — removing everything unnecessary
          until only the essential tension remains between subject and world.
        </p>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-5 pt-8"
          style={{
            borderTop: "1px solid rgba(92,92,92,0.2)",
          }}
        >
          {[
            { value: "12", label: "Years" },
            { value: "340+", label: "Projects" },
            { value: "28", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span
                className="font-cormorant"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: 300,
                  color: "var(--color-text)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                className="font-sans text-[11px]"
                style={{ color: "var(--color-meta)", fontWeight: 300 }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
