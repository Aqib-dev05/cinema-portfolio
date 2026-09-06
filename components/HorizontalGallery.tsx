"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

type Ratio = "portrait" | "landscape" | "square";

interface Photo {
  id: number;
  src: string;
  alt: string;
  location: string;
  year: string;
  ratio: Ratio;
}

const PHOTOS: Photo[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    alt: "Mountain at first light",
    location: "Iceland",
    year: "2024",
    ratio: "portrait",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    alt: "Aerial coastline",
    location: "Norway",
    year: "2024",
    ratio: "landscape",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    alt: "Forest light",
    location: "Oregon",
    year: "2023",
    ratio: "portrait",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    alt: "Shoreline at noon",
    location: "Maldives",
    year: "2023",
    ratio: "landscape",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80",
    alt: "Waterfall silence",
    location: "Scotland",
    year: "2024",
    ratio: "portrait",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    alt: "Coastal storm light",
    location: "Portugal",
    year: "2023",
    ratio: "landscape",
  },
];

export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ─────────────────────────────────────────────────────────────────
      // DESKTOP: horizontal scroll with pin, parallax, velocity skew
      // ─────────────────────────────────────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        // Recalculated on resize via invalidateOnRefresh
        const getScrollDistance = () =>
          track.scrollWidth - window.innerWidth;

        const scrollTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Per-image parallax — inner wrapper slightly wider than item,
        // slides opposite to scroll direction for depth illusion
        itemsRef.current.forEach((item) => {
          if (!item) return;
          const inner = item.querySelector<HTMLElement>(".js-parallax");
          if (!inner) return;

          gsap.fromTo(
            inner,
            { x: "12%" },
            {
              x: "-12%",
              ease: "none",
              scrollTrigger: {
                trigger: item,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        // Fade + lift reveal as each item enters the horizontal viewport
        itemsRef.current.forEach((item) => {
          if (!item) return;
          gsap.from(item, {
            opacity: 0,
            y: 18,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              containerAnimation: scrollTween,
              start: "left 90%",
              toggleActions: "play none none none",
            },
          });
        });

        // Velocity-based skewX — quickSetter for max perf, GSAP tween for smooth decay
        const proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter(track, "skewX", "deg");
        const clamp = gsap.utils.clamp(-5, 5);

        ScrollTrigger.create({
          onUpdate(self) {
            const target = clamp(self.getVelocity() / 600);
            if (Math.abs(target) > Math.abs(proxy.skew)) {
              proxy.skew = target;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });

        // Cleanup when matchMedia condition no longer matches
        return () => {
          ScrollTrigger.getAll().forEach((st) => st.kill());
          gsap.set(track, { x: 0, skewX: 0 });
        };
      });

      // ─────────────────────────────────────────────────────────────────
      // MOBILE: simple scroll-triggered fade-up per item
      // ─────────────────────────────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        itemsRef.current.forEach((item) => {
          if (!item) return;
          gsap.from(item, {
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="work" className="overflow-hidden bg-bg">
      {/* Label visible on desktop (rotated, left-side) */}
      <div className="hidden md:block absolute z-10 left-14" style={{ top: "50%", transform: "translateY(-50%)" }}>
        <p
          className="font-sans text-[10px] tracking-[0.28em]"
          style={{
            color: "var(--color-accent)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Selected Work
        </p>
      </div>

      {/* Mobile label */}
      <p
        className="md:hidden font-sans text-[10px] tracking-[0.25em] px-5 pt-16 pb-2"
        style={{ color: "var(--color-accent)" }}
      >
        Selected Work
      </p>

      {/*
       * Single track — layout controlled via CSS (.gallery-track / .gallery-item)
       * GSAP matchMedia handles which animation mode runs
       */}
      <div ref={trackRef} className="gallery-track">
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.id}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className="gallery-item group"
            data-ratio={photo.ratio}
            data-cursor
          >
            {/*
             * Parallax wrapper: slightly wider than parent (124%) so it can
             * shift left/right without exposing the background behind it.
             * js-parallax class is the GSAP target for the inner tween.
             */}
            <div
              className="js-parallax absolute inset-0 h-full"
              style={{
                width: "124%",
                left: "-12%",
                willChange: "transform",
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 70vw"
                priority={i < 2}
              />
            </div>

            {/* Gradient overlay — always subtle on mobile, hover-revealed on desktop */}
            <div
              className="absolute inset-0 pointer-events-none
                         opacity-100 md:opacity-0 md:group-hover:opacity-100
                         transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.72) 100%)",
              }}
            />

            {/* Metadata */}
            <div
              className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5
                         flex items-end justify-between
                         opacity-100 md:opacity-0 md:translate-y-2
                         md:group-hover:opacity-100 md:group-hover:translate-y-0
                         transition-all duration-500"
            >
              <span
                className="font-sans text-[11px]"
                style={{ color: "var(--color-text)" }}
              >
                {photo.location}
              </span>
              <span
                className="font-sans text-[10px]"
                style={{ color: "var(--color-meta)" }}
              >
                {photo.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
