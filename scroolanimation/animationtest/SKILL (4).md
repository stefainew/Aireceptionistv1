---
name: scroll-driven-hero-section
description: Build a premium scroll-driven hero section with video frame playback, GSAP animations, Lenis smooth scroll, and overlaid content sections. Use this when the user wants a cinematic, scroll-animated product/service landing page from a video file. Includes verified fixes for section visibility and positioning that the base video-to-website skill misses.
---

# Scroll-Driven Hero Section

Turn a short product/AI/brand video into a cinematic scroll-driven hero section with animated content overlays. This skill documents the **fully debugged** workflow — do not skip the Critical Fixes section.

## Reference Implementation

Built for: **AI Receptionist — Bulgarian market**
Files: `index.html`, `css/style.css`, `js/app.js`, `frames/frame_XXXX.jpg`
Stack: Vanilla HTML/CSS/JS · GSAP 3 · Lenis · No bundler

---

## Step 1: Find FFmpeg

FFmpeg is usually NOT on PATH on Windows. Search before assuming:

```powershell
Get-ChildItem "C:\Users\$env:USERNAME\AppData\Local\" -Recurse -Filter "ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName
Get-ChildItem "C:\tools\", "C:\ffmpeg\" -Filter "ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName
```

Common location: `C:\Users\<name>\AppData\Local\Softdeluxe\Free Download Manager\ffmpeg.exe`

Check what codecs are available — `libwebp` is often missing in older builds:
```powershell
& "path\to\ffmpeg.exe" -codecs 2>&1 | Select-String "webp"
```
If webp is missing, **use JPEG** instead (see Step 2).

---

## Step 2: Analyze Video + Extract Frames

```powershell
# Analyze
& "path\to\ffmpeg.exe" -i "video.mp4" 2>&1 | Select-String -Pattern "Duration|Video:"

# Extract — use webp if codec available, otherwise JPEG
# Short video (<15s): extract at full fps (usually 24)
# Long video (>30s): use 10-15fps
& "path\to\ffmpeg.exe" -i "video.mp4" -vf "fps=24,scale=1280:-1" -q:v 3 "frames\frame_%04d.jpg"
```

Count frames after extraction:
```powershell
(Get-ChildItem "frames\" -Filter "*.jpg").Count
```

Target: **150–220 frames** for a smooth scroll experience.

---

## Step 3: Project Scaffold

```
project/
  index.html
  css/style.css
  js/app.js
  frames/frame_0001.jpg  ...frame_0192.jpg
```

---

## Step 4: HTML Structure

Required order (do not rearrange):

```html
<!-- 1. Loader -->
<div id="loader">
  <div class="loader-brand">BRAND<span>name</span></div>
  <div id="loader-bar"><div id="loader-fill"></div></div>
  <div id="loader-percent">0%</div>
</div>

<!-- 2. Fixed header -->
<header class="site-header">...</header>

<!-- 3. Hero standalone (100vh, solid bg) -->
<section class="hero-standalone">
  <span class="section-label">001 / Tagline</span>
  <h1 class="hero-heading">
    <span class="word">Word</span>
    <span class="word accent">AI</span>
    ...
  </h1>
  <p class="hero-tagline">Subtitle text</p>
</section>

<!-- 4. Canvas (fixed, full viewport) -->
<div class="canvas-wrap" id="canvas-wrap">
  <canvas id="canvas"></canvas>
</div>

<!-- 5. Dark overlay (for stats section) -->
<div id="dark-overlay"></div>

<!-- 6. Marquees (fixed, scroll-driven) -->
<div class="marquee-wrap" id="marquee-1" data-scroll-speed="-30">
  <div class="marquee-text">TEXT · TEXT · TEXT ·</div>
</div>

<!-- 7. Scroll container (500vh) -->
<div id="scroll-container">

  <section class="scroll-section section-content align-left"
           data-enter="5" data-leave="20" data-animation="slide-left">
    <div class="section-inner">
      <span class="section-label">002 / Feature</span>
      <h2 class="section-heading">Headline</h2>
      <p class="section-body">Description.</p>
    </div>
  </section>

  <!-- Stats section -->
  <section class="scroll-section section-stats"
           data-enter="54" data-leave="70" data-animation="stagger-up">
    <div class="stats-grid">
      <div class="stat">
        <span class="stat-number" data-value="98" data-decimals="0">0</span>
        <span class="stat-suffix">%</span>
        <span class="stat-label">Label</span>
      </div>
    </div>
  </section>

  <!-- CTA — must have data-persist="true" -->
  <section class="scroll-section section-cta"
           data-enter="87" data-leave="100" data-animation="scale-up" data-persist="true">
    ...
  </section>

</div><!-- end #scroll-container -->

<!-- CDN scripts — this exact order -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="js/app.js"></script>
```

### Section Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-enter` | 0–100 | Scroll % when section appears |
| `data-leave` | 0–100 | Scroll % when section disappears |
| `data-animation` | see below | Entrance animation type |
| `data-persist` | `"true"` | Section stays visible once entered (CTA only) |

### Animation Types

`fade-up` · `slide-left` · `slide-right` · `scale-up` · `stagger-up` · `clip-reveal` · `rotate-in`

Never use the same type for consecutive sections.

---

## Step 5: CSS Essentials

```css
:root {
  --bg-dark: #080a0f;
  --accent: #c97b3e;        /* brand copper/gold */
  --accent-2: #3ecdc8;      /* teal highlight */
  --text-light: #e8e2d9;
  --font-display: 'Syne', sans-serif;     /* or any bold display font */
  --font-body: 'DM Sans', sans-serif;
}

/* ⚠️ CRITICAL: scroll container must use % not px/vh for child positioning */
#scroll-container {
  position: relative;
  height: 500vh;  /* adjust: ~80-100vh per major section */
}

.scroll-section {
  position: absolute;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  opacity: 0;           /* JS controls visibility */
  pointer-events: none;
}

/* Side zones — video occupies center */
.align-left  { padding-left: 5vw;  padding-right: 55vw; }
.align-right { padding-left: 55vw; padding-right: 5vw;  }
.align-left .section-inner,
.align-right .section-inner { max-width: 42vw; }

/* Text contrast over video frames — REQUIRED */
.section-heading {
  text-shadow: 0 2px 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7);
}
.section-body {
  text-shadow: 0 1px 20px rgba(0,0,0,0.95);
}

/* Canvas */
.canvas-wrap {
  position: fixed;
  inset: 0;
  z-index: 10;
  clip-path: circle(0% at 50% 50%);  /* expands on scroll */
  pointer-events: none;
}

/* Hero (below canvas z-order, fades out as canvas reveals) */
.hero-standalone {
  position: relative;
  height: 100vh;
  z-index: 50;
  background: var(--bg-dark);
}

#dark-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8,10,15,0.9);
  z-index: 11;
  pointer-events: none;
  opacity: 0;
}

.scroll-section { z-index: 20; }
.section-stats  { z-index: 22; }
.section-cta    { z-index: 22; }
```

Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
```

---

## Step 6: JavaScript (app.js)

### Config (top of file — adjust per project)

```js
const FRAME_COUNT = 192;    // total extracted frames
const FRAME_SPEED = 2.2;    // 1.8–2.2: video finishes at ~45% scroll
const IMAGE_SCALE = 0.86;   // 0.82–0.90: padding around video
const FRAME_DIR   = 'frames/';
const FRAME_EXT   = 'jpg';  // or 'webp'
const FIRST_BATCH = 15;     // frames loaded before hiding loader
```

### ⚠️ Critical Fix: Section Positioning

**WRONG** (sections never appear at correct scroll position):
```js
section.style.top = (midPct * 100) + 'vh'; // ❌ relative to viewport, not container
```

**CORRECT** (% is relative to parent's height = scroll container):
```js
const midPct = (enterPct + leavePct) / 2;
section.style.top       = (midPct * 100) + '%'; // ✅
section.style.transform = 'translateY(-50%)';
```

### ⚠️ Critical Fix: Per-Section ScrollTrigger

**WRONG** (single onUpdate checking all sections — unreliable):
```js
// ❌ One mega ScrollTrigger.onUpdate that iterates all sections
```

**CORRECT** (each section gets its own ScrollTrigger with callbacks):
```js
ScrollTrigger.create({
  trigger: section,          // ← trigger is the SECTION ITSELF
  start: 'top 75%',
  end: 'bottom 25%',
  onEnter() {
    section.style.opacity = '1';
    section.style.pointerEvents = 'auto';
    tl.play();
  },
  onEnterBack() { section.style.opacity = '1'; tl.play(); },
  onLeave() {
    if (!persist) {
      gsap.to(section, { opacity: 0, duration: 0.35 });
      tl.pause(0);
      gsap.set(children, hideProps);
    }
  },
  onLeaveBack() {
    section.style.opacity = '0';
    tl.pause(0);
    gsap.set(children, hideProps);
  }
});
```

### Canvas: Padded Cover Mode

```js
function drawFrame(idx) {
  const img = frames[idx];
  if (!img) return;
  const w = window.innerWidth, h = window.innerHeight;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * IMAGE_SCALE;
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  ctx.fillStyle = bgColor;           // sampled from frame edge pixels
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, (w-dw)/2, (h-dh)/2, dw, dh);
}
```

### Frame-to-Scroll Binding

```js
ScrollTrigger.create({
  trigger: scrollContainer,
  start: 'top top', end: 'bottom bottom',
  scrub: true,
  onUpdate(self) {
    const idx = Math.min(
      Math.floor(Math.min(self.progress * FRAME_SPEED, 1) * FRAME_COUNT),
      FRAME_COUNT - 1
    );
    if (idx !== currentFrame) {
      currentFrame = idx;
      requestAnimationFrame(() => drawFrame(currentFrame));
    }
  }
});
```

### Hero Circle-Wipe

```js
ScrollTrigger.create({
  trigger: scrollContainer,
  start: 'top top', end: 'bottom bottom', scrub: true,
  onUpdate(self) {
    const p = self.progress;
    heroSection.style.opacity = String(Math.max(0, 1 - p * 20));
    const wipe   = Math.min(1, Math.max(0, (p - 0.01) / 0.065));
    canvasWrap.style.clipPath = `circle(${wipe * 82}% at 50% 50%)`;
  }
});
```

### Lenis Smooth Scroll (mandatory)

```js
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Counter Animations

```js
document.querySelectorAll('.stat-number').forEach((el) => {
  gsap.fromTo(el, { textContent: 0 }, {
    textContent: parseFloat(el.dataset.value),
    duration: 2.0, ease: 'power1.out',
    snap: { textContent: parseInt(el.dataset.decimals) === 0 ? 1 : 0.1 },
    onUpdate() {
      const v = parseFloat(el.textContent);
      el.textContent = el.dataset.decimals === '0' ? Math.round(v) : v.toFixed(1);
    },
    scrollTrigger: { trigger: el.closest('.scroll-section'), start: 'top 65%', toggleActions: 'play none none reset' }
  });
});
```

---

## Step 7: Serve Locally

```powershell
npx -y serve . -p 3333
# Open: http://localhost:3333
```

> ⚠️ MUST serve via HTTP — canvas cannot load local images via `file://`

---

## Scroll Height Guide

| Sections | Total Height |
|----------|-------------|
| 4        | 400vh       |
| 5–6      | 500vh       |
| 7–8      | 600vh       |

Use ~80–100vh per section. Never go over 600vh or the experience feels slow.

---

## Section Timing Cheatsheet (for 500vh)

| Section | `data-enter` | `data-leave` | Mid % |
|---------|-------------|-------------|-------|
| 1st feature | 5 | 20 | 12.5 |
| 2nd feature | 20 | 36 | 28 |
| 3rd feature | 36 | 52 | 44 |
| Stats (dark) | 54 | 70 | 62 |
| Industries | 72 | 85 | 78.5 |
| CTA (persist) | 87 | 100 | 93.5 |

Dark overlay range matches stats: `initDarkOverlay(0.52, 0.72)`

---

## Anti-Patterns

| ❌ Don't | ✅ Do instead |
|---------|--------------|
| Use `vh` for section `top` positioning | Use `%` (relative to scroll container) |
| One giant `onUpdate` for all sections | Per-section ScrollTrigger with `onEnter`/`onLeave` |
| `height: 900vh` for 6 sections | `height: 500vh` (snappier) |
| No text-shadow on headings | Add `text-shadow` for contrast over video |
| `FRAME_SPEED < 1.8` | Use 2.0–2.2 (video finishes at ~45% scroll) |
| Same animation type back-to-back | Alternate from the 7 available types |
| Glassmorphism cards over video | Text directly on background + text-shadow |
| Static stat numbers | Always use GSAP counter animation |

---

## Localisation Notes (Bulgarian Market)

- Font: **Syne** renders Cyrillic beautifully at large sizes — use it
- The Bulgarian market responds to: social proof numbers, "пропуснати обаждания" (missed calls) pain point, 14-day free trial CTA
- Always include a Bulgarian flag emoji (🇧🇬) in the footer — builds trust
- Key industries to list: Медицина, Красота, Авто, Ресторанти, Правни услуги, Имоти
