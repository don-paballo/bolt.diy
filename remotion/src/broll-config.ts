/**
 * B-roll configuration for Bond Boss™ Concrete Repair Spray UGC video.
 *
 * Product: Bond Boss™ — Super Strength Concrete Repair / Wall Protection Spray
 * Website: bondboss.co.za
 * Branding: Green (#2D7A3A) + White, construction-worker mascot
 *
 * USAGE:
 *  1. Drop your UGC video into  public/videos/ugc.mp4
 *  2. Drop each b-roll clip into public/videos/ (filenames match `src` below)
 *  3. Adjust `startFrame` / `durationInFrames` to sync with your spoken cues
 *     (30 fps: 30 = 1 s, 60 = 2 s, 90 = 3 s, 150 = 5 s)
 *  4. Run `npm start` → Remotion Studio for live preview
 *  5. Run `npm run build` → exports out/bondboss-ugc.mp4
 *
 * FREE STOCK B-ROLL SOURCES (search terms included):
 *  - pexels.com  → "cracked concrete", "wall repair", "spray bottle"
 *  - pixabay.com → "damp wall", "construction repair"
 *  - coverr.co   → "house renovation", "concrete"
 */

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920; // Portrait — TikTok / Reels / Shorts

// Set this to your UGC clip's exact frame count before rendering.
// Formula: duration_in_seconds × VIDEO_FPS
export const UGC_DURATION_FRAMES = 30 * 55; // default: 55 seconds

export interface BRollClip {
  /** Filename inside public/videos/ */
  src: string;
  /** Frame in the final composition where this clip starts */
  startFrame: number;
  /** How many frames this clip is visible */
  durationInFrames: number;
  /** 0–1 opacity (0.85 gives a semi-transparent blend over the UGC) */
  opacity?: number;
  /**
   * "fullscreen" — b-roll fills the frame (UGC audio continues)
   * "pip"        — small corner overlay (bottom-right)
   */
  layout: "fullscreen" | "pip";
  /** Short caption shown while clip plays */
  caption?: string;
}

/**
 * B-roll edit timeline — tailored to Bond Boss product story arc:
 *   Hook → Problem → Product → Application → Result → CTA
 */
export const BROLL_CLIPS: BRollClip[] = [
  // ── HOOK (0–4 s): show the problem immediately ──────────────────────────
  {
    src: "broll-cracked-driveway.mp4",
    startFrame: 30 * 1,   // 1 s in — after the first spoken hook line
    durationInFrames: 30 * 4,
    layout: "fullscreen",
    opacity: 0.88,
    caption: "Cracks ruining your surfaces?",
  },

  // ── PROBLEM (8–14 s): damp & crumbling walls ────────────────────────────
  {
    src: "broll-damp-wall.mp4",
    startFrame: 30 * 8,
    durationInFrames: 30 * 4,
    layout: "fullscreen",
    opacity: 0.88,
    caption: "Rising damp destroying your walls?",
  },
  {
    src: "broll-crumbling-plaster.mp4",
    startFrame: 30 * 14,
    durationInFrames: 30 * 3,
    layout: "pip",
    opacity: 1,
    caption: "Flaking plaster. Moisture damage.",
  },

  // ── PRODUCT IN ACTION (20–32 s): spray application close-up ─────────────
  {
    src: "broll-spray-application.mp4",
    startFrame: 30 * 20,
    durationInFrames: 30 * 5,
    layout: "fullscreen",
    opacity: 0.9,
    caption: "Simply spray. Deep penetration formula.",
  },
  {
    src: "broll-product-bottle.mp4",
    startFrame: 30 * 28,
    durationInFrames: 30 * 3,
    layout: "pip",
    opacity: 1,
    caption: "Bond Boss™ Super Strength",
  },

  // ── RESULT (35–45 s): before/after, smooth repaired surface ─────────────
  {
    src: "broll-repaired-surface.mp4",
    startFrame: 30 * 35,
    durationInFrames: 30 * 5,
    layout: "fullscreen",
    opacity: 0.88,
    caption: "Sealed. Bonded. Protected. ✓",
  },
  {
    src: "broll-happy-homeowner.mp4",
    startFrame: 30 * 43,
    durationInFrames: 30 * 4,
    layout: "fullscreen",
    opacity: 0.85,
    caption: "Looks brand new — in 24 hours",
  },
];

export const BONDBOSS_BRAND = {
  primaryGreen: "#2D7A3A",
  darkGreen: "#1A5226",
  lightGreen: "#4CAF62",
  white: "#FFFFFF",
  black: "#111111",
  fontFamily: "'Arial Black', Arial, sans-serif",
  logoSrc: "bondboss-logo.png",        // place in remotion/public/
  website: "bondboss.co.za",
  tagline: "Seals. Bonds. Protects.",
  ctaText: "Shop now at bondboss.co.za",
  ctaSubline: "Nationwide delivery · 30-day money-back guarantee",
};
