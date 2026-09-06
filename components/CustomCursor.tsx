"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const orbRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialise on true pointer devices — skip touch
    const isPointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isPointer) return;

    const orb = orbRef.current;
    const dot = dotRef.current;
    if (!orb || !dot) return;

    // Start off-screen so there's no flash at (0,0)
    gsap.set([orb, dot], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

    // quickTo: fast-path animation targeting a CSS property
    const xOrb = gsap.quickTo(orb, "x", { duration: 0.55, ease: "power3.out" });
    const yOrb = gsap.quickTo(orb, "y", { duration: 0.55, ease: "power3.out" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08 });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08 });

    const onMouseMove = (e: MouseEvent) => {
      xOrb(e.clientX);
      yOrb(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    // Orb expands + softens on interactive elements
    const onEnter = () => {
      gsap.to(orb, {
        scale: 2.4,
        opacity: 0.3,
        duration: 0.35,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(orb, {
        scale: 1,
        opacity: 0.65,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Attach after a tick so DOM is fully painted
    const t = setTimeout(() => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }, 300);

    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", onMouseMove);
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Slow-following diffused glow */}
      <div
        ref={orbRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-10 h-10 rounded-full opacity-65"
        style={{
          background:
            "radial-gradient(circle, rgba(200,169,110,0.9) 0%, rgba(200,169,110,0.25) 55%, transparent 72%)",
          filter: "blur(7px)",
          willChange: "transform",
        }}
      />
      {/* Instant sharp center dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-[3px] h-[3px] rounded-full"
        style={{ backgroundColor: "#C8A96E", willChange: "transform" }}
      />
    </>
  );
}
