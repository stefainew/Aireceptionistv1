/**
 * АИ Рецепционист — Bulgarian Market
 * Scroll-driven: canvas frames + GSAP/Lenis + per-section ScrollTrigger
 */

/* =============================================
   CONFIG
   ============================================= */
const FRAME_COUNT = 192;
const FRAME_SPEED = 2.2;   // Frames complete by ~45% of scroll
const IMAGE_SCALE = 0.86;
const FRAME_DIR = 'frames/';
const FRAME_EXT = 'jpg';
const FIRST_BATCH = 15;

/* =============================================
   STATE
   ============================================= */
const frames = new Array(FRAME_COUNT).fill(null);
let currentFrame = 0;
let bgColor = '#080a0f';
let loadedCount = 0;
let siteReady = false;

/* =============================================
   ELEMENTS
   ============================================= */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWrap = document.getElementById('canvas-wrap');
const darkOverlay = document.getElementById('dark-overlay');
const scrollContainer = document.getElementById('scroll-container');
const heroSection = document.querySelector('.hero-standalone');
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderPercent = document.getElementById('loader-percent');

/* =============================================
   CANVAS RESIZE
   ============================================= */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  if (frames[currentFrame]) drawFrame(currentFrame);
}
window.addEventListener('resize', resizeCanvas);

/* =============================================
   SAMPLE BG COLOR
   ============================================= */
function sampleBgColor(img) {
  try {
    const s = document.createElement('canvas');
    s.width = 4; s.height = 4;
    s.getContext('2d').drawImage(img, 0, 0, 4, 4);
    const d = s.getContext('2d').getImageData(0, 0, 1, 1).data;
    bgColor = `rgb(${d[0]},${d[1]},${d[2]})`;
  } catch (e) { /* CORS issue – ignore */ }
}

/* =============================================
   DRAW FRAME — Padded Cover Mode
   ============================================= */
function drawFrame(idx) {
  const img = frames[idx];
  if (!img || !img.complete) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(w / iw, h / ih) * IMAGE_SCALE;
  const dw = iw * scale, dh = ih * scale;
  const dx = (w - dw) / 2, dy = (h - dh) / 2;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* =============================================
   PAD NUMBER
   ============================================= */
function pad(n, len) { return String(n).padStart(len, '0'); }

/* =============================================
   FRAME LOADER
   ============================================= */
function loadFrame(idx, cb) {
  const img = new Image();
  img.onload = () => {
    frames[idx] = img;
    loadedCount++;
    const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
    loaderFill.style.width = pct + '%';
    loaderPercent.textContent = pct + '%';
    if (idx === 0 || idx % 25 === 0) sampleBgColor(img);
    if (cb) cb();
  };
  img.onerror = () => { loadedCount++; if (cb) cb(); };
  img.src = `${FRAME_DIR}frame_${pad(idx + 1, 4)}.${FRAME_EXT}`;
}

function preloadFrames() {
  let firstDone = 0;
  let phase2Started = false;

  function tryStartExperience() {
    if (!phase2Started && firstDone >= FIRST_BATCH) {
      phase2Started = true;
      resizeCanvas();
      drawFrame(0);

      // Load remaining in background
      let remDone = 0;
      const remaining = FRAME_COUNT - FIRST_BATCH;
      for (let i = FIRST_BATCH; i < FRAME_COUNT; i++) {
        loadFrame(i, () => {
          remDone++;
          // Update loader until all done
          if (remDone === remaining && !siteReady) {
            launchSite();
          }
        });
      }
      // Start the site as soon as first batch ready (don't wait for all frames)
      setTimeout(launchSite, 400);
    }
  }

  for (let i = 0; i < Math.min(FIRST_BATCH, FRAME_COUNT); i++) {
    loadFrame(i, () => {
      firstDone++;
      tryStartExperience();
    });
  }
}

/* =============================================
   LAUNCH SITE
   ============================================= */
function launchSite() {
  if (siteReady) return;
  siteReady = true;

  gsap.to(loader, {
    opacity: 0, duration: 0.9, ease: 'power2.inOut',
    onComplete: () => { loader.style.display = 'none'; }
  });

  initLenis();

  // Small delay so Lenis can stabilise
  setTimeout(initScrollAnimations, 100);
}

/* =============================================
   LENIS
   ============================================= */
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* =============================================
   ALL SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  /* — Canvas frame scrub — */
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) {
      const accel = Math.min(self.progress * FRAME_SPEED, 1);
      const idx = Math.min(Math.floor(accel * FRAME_COUNT), FRAME_COUNT - 1);
      if (idx !== currentFrame) {
        currentFrame = idx;
        if (currentFrame % 25 === 0 && frames[currentFrame]) sampleBgColor(frames[currentFrame]);
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    }
  });

  /* — Hero circle-wipe — */
  initHeroTransition();

  /* — Content sections — */
  document.querySelectorAll('.scroll-section').forEach(positionAndAnimate);

  /* — Counters — */
  initCounters();

  /* — Marquee — */
  initMarquee();

  /* — Dark overlay (stats) — */
  initDarkOverlay(0.52, 0.72);
}

/* =============================================
   HERO TRANSITION
   ============================================= */
function initHeroTransition() {
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) {
      const p = self.progress;
      heroSection.style.opacity = String(Math.max(0, 1 - p * 20));
      const wipe = Math.min(1, Math.max(0, (p - 0.01) / 0.065));
      const radius = wipe * 82;
      canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;
    }
  });
}

/* =============================================
   POSITION + ANIMATE EACH SECTION
   Uses per-section ScrollTrigger so it's reliable
   ============================================= */
function positionAndAnimate(section) {
  const enterPct = parseFloat(section.dataset.enter) / 100;  // 0..1
  const leavePct = parseFloat(section.dataset.leave) / 100;
  const persist = section.dataset.persist === 'true';
  const midPct = (enterPct + leavePct) / 2;

  /* Position section at mid-point of its scroll range, centred vertically.
     CRITICAL: use % so it's relative to the 500vh scroll container, not viewport. */
  section.style.top = (midPct * 100) + '%';
  section.style.transform = 'translateY(-50%)';

  /* Children to animate */
  const children = Array.from(section.querySelectorAll(
    '.section-label, .section-heading, .section-body, ' +
    '.cta-heading, .cta-body, .cta-actions, .cta-note, ' +
    '.stat, .industry-tags'
  ));

  if (!children.length) return;

  const type = section.dataset.animation || 'fade-up';

  /* Set initial hidden state */
  const hideProps = getHideProps(type);
  gsap.set(children, hideProps);

  /* Build entrance timeline */
  const tl = gsap.timeline({ paused: true });
  buildEntrance(tl, children, type);

  /* Per-section ScrollTrigger based on the section element itself */
  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    end: 'bottom 25%',
    onEnter() {
      section.style.opacity = '1';
      section.style.pointerEvents = 'auto';
      tl.play();
    },
    onEnterBack() {
      section.style.opacity = '1';
      section.style.pointerEvents = 'auto';
      tl.play();
    },
    onLeave() {
      if (!persist) {
        gsap.to(section, {
          opacity: 0, duration: 0.35, ease: 'power2.in',
          onComplete() { section.style.pointerEvents = 'none'; }
        });
        tl.pause(0);
        gsap.set(children, hideProps);
      }
    },
    onLeaveBack() {
      section.style.opacity = '0';
      section.style.pointerEvents = 'none';
      tl.pause(0);
      gsap.set(children, hideProps);
    }
  });
}

function getHideProps(type) {
  switch (type) {
    case 'slide-left': return { x: -90, opacity: 0 };
    case 'slide-right': return { x: 90, opacity: 0 };
    case 'scale-up': return { scale: 0.82, opacity: 0 };
    case 'stagger-up': return { y: 65, opacity: 0 };
    case 'clip-reveal': return { clipPath: 'inset(100% 0 0 0)', opacity: 0 };
    case 'rotate-in': return { y: 40, rotation: 3, opacity: 0 };
    default: return { y: 55, opacity: 0 };
  }
}

function buildEntrance(tl, children, type) {
  const stagger = 0.12;
  switch (type) {
    case 'fade-up':
      tl.to(children, { y: 0, opacity: 1, stagger, duration: 0.9, ease: 'power3.out' });
      break;
    case 'slide-left':
      tl.to(children, { x: 0, opacity: 1, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
      break;
    case 'slide-right':
      tl.to(children, { x: 0, opacity: 1, stagger: 0.14, duration: 0.9, ease: 'power3.out' });
      break;
    case 'scale-up':
      tl.to(children, { scale: 1, opacity: 1, stagger, duration: 1.0, ease: 'power2.out' });
      break;
    case 'stagger-up':
      tl.to(children, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' });
      break;
    case 'clip-reveal':
      tl.to(children, {
        clipPath: 'inset(0% 0 0 0)', opacity: 1,
        stagger: 0.15, duration: 1.2, ease: 'power4.inOut'
      });
      break;
    case 'rotate-in':
      tl.to(children, { y: 0, rotation: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out' });
      break;
    default:
      tl.to(children, { y: 0, opacity: 1, stagger, duration: 0.9, ease: 'power3.out' });
  }
}

/* =============================================
   STAT COUNTERS
   ============================================= */
function initCounters() {
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || '0');

    gsap.fromTo(
      el,
      { textContent: 0 },
      {
        textContent: target,
        duration: 2.0,
        ease: 'power1.out',
        snap: { textContent: decimals === 0 ? 1 : 0.1 },
        onUpdate() {
          const val = parseFloat(el.textContent);
          el.textContent = decimals === 0 ? Math.round(val) : val.toFixed(decimals);
        },
        scrollTrigger: {
          trigger: el.closest('.scroll-section'),
          start: 'top 65%',
          toggleActions: 'play none none reset'
        }
      }
    );
  });
}

/* =============================================
   MARQUEE
   ============================================= */
function initMarquee() {
  document.querySelectorAll('.marquee-wrap').forEach((wrap) => {
    const text = wrap.querySelector('.marquee-text');
    const speed = parseFloat(wrap.dataset.scrollSpeed) || -25;

    gsap.to(text, {
      xPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    // Fade in when canvas is visible (after hero wipe)
    gsap.fromTo(wrap, { opacity: 0 }, {
      opacity: 1,
      scrollTrigger: {
        trigger: scrollContainer,
        start: '5% top',
        end: '10% top',
        scrub: true
      }
    });

    // Fade out near end
    gsap.to(wrap, {
      opacity: 0,
      scrollTrigger: {
        trigger: scrollContainer,
        start: '85% top',
        end: '95% top',
        scrub: true
      }
    });
  });
}

/* =============================================
   DARK OVERLAY (stats section)
   ============================================= */
function initDarkOverlay(enter, leave) {
  const fadeRange = 0.04;
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) {
      const p = self.progress;
      let opacity = 0;
      if (p >= enter - fadeRange && p <= enter) {
        opacity = (p - (enter - fadeRange)) / fadeRange;
      } else if (p > enter && p < leave) {
        opacity = 0.9;
      } else if (p >= leave && p <= leave + fadeRange) {
        opacity = 0.9 * (1 - (p - leave) / fadeRange);
      }
      darkOverlay.style.opacity = String(opacity);
    }
  });
}

/* =============================================
   BOOT
   ============================================= */
gsap.registerPlugin(ScrollTrigger);
document.addEventListener('DOMContentLoaded', preloadFrames);
