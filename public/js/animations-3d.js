/**
 * 3D Animations & Interactive Engine
 * Integrates Lenis Smooth Scroll, GSAP 3D ScrollTrigger, and 3D Card Tilt
 */

(function () {
  'use strict';


  // 2. INTERACTIVE 3D MOUSE TILT FOR CARDS
  function init3dCardTilt() {
    const selector = '.tilt-card-3d, .room-card, .portal-card, .feature-card, .metric-card, .stat-pill, .pricing-card';
    const cards = document.querySelectorAll(selector);

    cards.forEach((card) => {
      card.classList.add('tilt-card-3d');
      const parent = card.parentElement;
      if (parent) parent.classList.add('perspective-3d');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px)`;

        card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  // 3. MAGNETIC BUTTON HOVER EFFECT
  function initMagneticButtons() {
    const btns = document.querySelectorAll('.btn-primary, .btn-secondary, .magnetic-btn, .hero-badge-tag');

    btns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.03)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  // 4. GSAP & SCROLLTRIGGER 3D REVEAL ANIMATIONS
  function initGsapAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Section Entrance
    gsap.from('.hero-badge-tag', {
      duration: 0.9,
      y: -30,
      opacity: 0,
      ease: 'back.out(1.7)'
    });

    gsap.from('.hero-title', {
      duration: 1.1,
      y: 40,
      rotateX: -15,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.2
    });

    gsap.from('.hero-subtitle', {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.4
    });

    gsap.from('.stat-pill', {
      duration: 0.8,
      scale: 0.85,
      y: 20,
      opacity: 0,
      stagger: 0.12,
      ease: 'back.out(1.5)',
      delay: 0.6
    });

    // Scroll-Triggered Cards Reveal
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.room-card, .portal-card, .feature-card, .faq-item').forEach((element, i) => {
        // NOTE: use fromTo with an explicit end state. A `from` tween would read
        // the element's current styles as its end value, and since these cards
        // start hidden by the `.reveal` class (opacity: 0) the cards would
        // animate 0 -> 0 and stay invisible forever.
        gsap.fromTo(element,
          { opacity: 0, y: 50, rotateX: -10 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: (i % 3) * 0.1,
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true
            }
          }
        );
      });
    }
  }

  // 5. LENIS SMOOTH SCROLLING
  function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    // Drive Lenis from ONE clock. Running a manual requestAnimationFrame loop
    // *and* a gsap.ticker loop fed Lenis two different time bases, which made
    // the virtual scroll jump/stall instead of following the wheel.
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Route in-page anchor links (e.g. "Sign In" -> #portals) through Lenis.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target);
      });
    });

    window.__lenis = lenis;
  }

  // DOM Content Loaded Handler
  document.addEventListener('DOMContentLoaded', () => {
    init3dCardTilt();
    initMagneticButtons();
    initLenisScroll();
    initGsapAnimations();

    // Recalculate trigger positions once images/fonts have settled.
    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });
})();


