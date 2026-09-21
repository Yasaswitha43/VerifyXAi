/**
 * Lightweight, high-performance cursor interactions:
 * - Magnetic effect for buttons & links
 * - 3D tilt & dynamic spotlight glow for cards
 * - Respects prefers-reduced-motion
 */

export function initCursorInteractions(): () => void {
  if (typeof window === 'undefined') return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return () => {};

  let activeMagneticEl: HTMLElement | null = null;
  let activeTiltEl: HTMLElement | null = null;
  let rafId: number | null = null;

  // Track target coords for magnetic animation
  let magTargetX = 0;
  let magTargetY = 0;
  let magCurX = 0;
  let magCurY = 0;

  // Track target tilt
  let tiltTargetX = 0;
  let tiltTargetY = 0;
  let tiltCurX = 0;
  let tiltCurY = 0;

  const animate = () => {
    // Smooth magnetic interpolation
    if (activeMagneticEl) {
      magCurX += (magTargetX - magCurX) * 0.25;
      magCurY += (magTargetY - magCurY) * 0.25;
      activeMagneticEl.style.transform = `translate3d(${magCurX.toFixed(2)}px, ${magCurY.toFixed(2)}px, 0) scale(1.02)`;
    }

    // Smooth tilt interpolation
    if (activeTiltEl) {
      tiltCurX += (tiltTargetX - tiltCurX) * 0.2;
      tiltCurY += (tiltTargetY - tiltCurY) * 0.2;
      activeTiltEl.style.transform = `perspective(1000px) rotateX(${tiltCurX.toFixed(2)}deg) rotateY(${tiltCurY.toFixed(2)}deg) translateY(-3px)`;
    }

    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  const handlePointerMove = (e: PointerEvent) => {
    // 1. Magnetic element check
    const magneticTarget = (e.target as HTMLElement)?.closest(
      'button, a, [data-magnetic="true"]'
    ) as HTMLElement | null;

    if (magneticTarget && !magneticTarget.hasAttribute('disabled')) {
      if (activeMagneticEl !== magneticTarget) {
        if (activeMagneticEl) {
          activeMagneticEl.style.transform = '';
        }
        activeMagneticEl = magneticTarget;
        magCurX = 0;
        magCurY = 0;
      }

      const rect = magneticTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      // Subtle magnetic pull (capped at 8px)
      magTargetX = Math.max(-8, Math.min(8, relX * 0.18));
      magTargetY = Math.max(-8, Math.min(8, relY * 0.18));
    } else if (activeMagneticEl) {
      activeMagneticEl.style.transform = '';
      activeMagneticEl = null;
      magTargetX = 0;
      magTargetY = 0;
    }

    // 2. Card tilt & spotlight glow check
    const cardTarget = (e.target as HTMLElement)?.closest(
      '.interactive-card, [data-tilt="true"]'
    ) as HTMLElement | null;

    if (cardTarget) {
      if (activeTiltEl !== cardTarget) {
        if (activeTiltEl) {
          activeTiltEl.style.transform = '';
        }
        activeTiltEl = cardTarget;
        tiltCurX = 0;
        tiltCurY = 0;
      }

      const rect = cardTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight radial gradient
      cardTarget.style.setProperty('--mouse-x', `${x}px`);
      cardTarget.style.setProperty('--mouse-y', `${y}px`);

      // Calculate tilt degrees (capped at 4 degrees for subtle elegance)
      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      tiltTargetX = -normY * 4.5;
      tiltTargetY = normX * 4.5;
    } else if (activeTiltEl) {
      activeTiltEl.style.transform = '';
      activeTiltEl = null;
      tiltTargetX = 0;
      tiltTargetY = 0;
    }
  };

  const handlePointerOut = () => {
    if (activeMagneticEl) {
      activeMagneticEl.style.transform = '';
      activeMagneticEl = null;
    }
    if (activeTiltEl) {
      activeTiltEl.style.transform = '';
      activeTiltEl = null;
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', handlePointerOut, { passive: true });

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerleave', handlePointerOut);
    if (activeMagneticEl) activeMagneticEl.style.transform = '';
    if (activeTiltEl) activeTiltEl.style.transform = '';
  };
}
