/**
 * B-roll configuration for BondBoss UGC video.
 *
 * USAGE:
 *  1. Drop your UGC video into public/videos/ugc.mp4
 *  2. Drop b-roll clips into public/videos/ (names match `src` fields below)
 *  3. Adjust `startFrame` and `durationInFrames` to match your edit timing
 *     (at 30 fps: 30 = 1 s, 90 = 3 s, 150 = 5 s)
 *  4. Run `npm start` to preview in Remotion Studio
 *  5. Run `npm run build` to export the final MP4
 */

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920; // Portrait for UGC/TikTok/Reels

// Total duration of your UGC video in frames (update this once you know it)
export const UGC_DURATION_FRAMES = 30 * 60; // default: 60 seconds

export interface BRollClip {
  /** Path relative to /public/videos/ */
  src: string;
  /** Frame within the final composition where this b-roll starts */
  startFrame: number;
  /** How long this b-roll is visible */
  durationInFrames: number;
  /** 0–1 opacity for the b-roll overlay */
  opacity?: number;
  /** "pip" = picture-in-picture corner; "fullscreen" = replaces UGC */
  layout: "fullscreen" | "pip";
  /** Caption text shown while this clip plays (optional) */
  caption?: string;
}

/**
 * Edit this array to control WHEN and WHICH b-roll appears.
 * Replace the `src` filenames with your actual clip files.
 */
export const BROLL_CLIPS: BRollClip[] = [
  {
    src: "broll-house-exterior.mp4",
    startFrame: 30 * 5, // 5 s in
    durationInFrames: 30 * 4,
    layout: "fullscreen",
    opacity: 0.85,
    caption: "Find your dream home",
  },
  {
    src: "broll-signing-documents.mp4",
    startFrame: 30 * 12,
    durationInFrames: 30 * 4,
    layout: "fullscreen",
    opacity: 0.85,
    caption: "Stress-free bond approval",
  },
  {
    src: "broll-keys-handover.mp4",
    startFrame: 30 * 20,
    durationInFrames: 30 * 3,
    layout: "pip",
    opacity: 1,
    caption: "Keys in your hand — faster",
  },
  {
    src: "broll-happy-family-home.mp4",
    startFrame: 30 * 30,
    durationInFrames: 30 * 5,
    layout: "fullscreen",
    opacity: 0.85,
    caption: "The SA home you deserve",
  },
  {
    src: "broll-calculator-finance.mp4",
    startFrame: 30 * 42,
    durationInFrames: 30 * 4,
    layout: "pip",
    opacity: 1,
    caption: "Best bond rates, guaranteed",
  },
];

export const BONDBOSS_BRAND = {
  primaryColor: "#1A3C6E",   // deep navy
  accentColor: "#F5A623",    // gold
  white: "#FFFFFF",
  fontFamily: "sans-serif",
  logoSrc: "bondboss-logo.png", // place in public/
  website: "bondboss.co.za",
  ctaText: "Apply for free at bondboss.co.za",
};
