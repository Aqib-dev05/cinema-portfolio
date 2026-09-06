# Frame & Light — Cinematic Photography Portfolio

Next.js 14 · GSAP 3 · Lenis · Tailwind CSS · TypeScript

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Animation | GSAP 3 + @gsap/react |
| Smooth scroll | Lenis 1.x |
| Styling | Tailwind CSS + CSS custom properties |
| Language | TypeScript (strict) |
| Images | next/image (Unsplash remote pattern) |

---

## Architecture

```
app/
  layout.tsx          Root layout — fonts, LenisProvider, CustomCursor
  page.tsx            Composes all sections
  globals.css         Design tokens, gallery responsive layout, cursor rules

components/
  LenisProvider.tsx   Bridges Lenis ↔ GSAP ScrollTrigger tick
  CustomCursor.tsx    Diffused gold orb + sharp dot (pointer devices only)
  Navbar.tsx          Fixed nav, mix-blend-difference, entrance animation
  HeroSection.tsx     Full-viewport headline, ghost numeral, scroll indicator
  HorizontalGallery   Pinned horizontal scroll (desktop) / vertical (mobile)
  AboutSection.tsx    Asymmetric two-col, image + text + stats
  ContactSection.tsx  Large typographic footer with contact info
```

---

## Key GSAP Patterns

### Lenis ↔ ScrollTrigger sync (LenisProvider.tsx)
```ts
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Horizontal scroll with pin (HorizontalGallery.tsx)
```ts
const scrollTween = gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: section, start: "top top",
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    scrub: 1.5, pin: true, invalidateOnRefresh: true,
  },
});
```

### Parallax inside horizontal scroll
```ts
gsap.fromTo(inner, { x: "12%" }, {
  x: "-12%", ease: "none",
  scrollTrigger: { containerAnimation: scrollTween, scrub: true },
});
```

### Velocity-based skew (quickSetter for performance)
```ts
const proxy = { skew: 0 };
const skewSetter = gsap.quickSetter(track, "skewX", "deg");
ScrollTrigger.create({
  onUpdate(self) {
    const target = clamp(self.getVelocity() / 600);
    if (Math.abs(target) > Math.abs(proxy.skew)) {
      proxy.skew = target;
      gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3",
        overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
    }
  },
});
```

### Responsive animations (gsap.matchMedia)
```ts
const mm = gsap.matchMedia();
mm.add("(min-width: 768px)", () => { /* desktop horizontal scroll */ });
mm.add("(max-width: 767px)", () => { /* mobile vertical reveals */ });
return () => mm.revert();
```

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0A0A0A` | Page background |
| `--color-text` | `#E8E4DC` | Primary text, warm off-white |
| `--color-accent` | `#C8A96E` | Muted gold — cursor, labels, lines |
| `--color-meta` | `#5C5C5C` | Secondary / metadata text |
| `--font-cormorant` | Cormorant Garamond | Display / headline serif |
| `--font-dm-sans` | DM Sans | UI / body sans-serif |

---

## Swap the Photos

Edit `PHOTOS` array in `components/HorizontalGallery.tsx`.  
Each photo has a `ratio` field: `"portrait"` | `"landscape"` | `"square"` — this drives the CSS dimensions automatically via `data-ratio` attribute.
