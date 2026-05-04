import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BROLL_CLIPS, UGC_DURATION_FRAMES, VIDEO_FPS } from "../broll-config";
import { MainVideo } from "../components/MainVideo";
import { BRollOverlay } from "../components/BRollOverlay";
import { TextOverlay } from "../components/TextOverlay";
import { CTAOverlay } from "../components/CTAOverlay";

/**
 * BondBossUGC — edit timeline
 *
 * Story arc:
 *   0–4 s   → Hook text + cracked-driveway b-roll
 *   4–8 s   → UGC creator speaks (no b-roll, full attention)
 *   8–17 s  → Problem b-roll: damp wall + crumbling plaster PiP
 *   17–20 s → UGC creator explains the product
 *   20–32 s → Product in action: spray + bottle PiP
 *   32–35 s → UGC creator gives verdict
 *   35–47 s → Result b-roll: repaired surface + happy homeowner
 *   47–55 s → CTA end-card (green gradient + logo + pill button)
 *
 * Layer order (bottom → top):
 *   1. UGC main video   (always playing, audio on)
 *   2. B-roll overlays  (timed, muted, fade in/out)
 *   3. Hook text        (top, first 3 s)
 *   4. CTA overlay      (last 8 s)
 */
export const BondBossUGC: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  const CTA_DURATION = VIDEO_FPS * 8;
  const ctaStart = durationInFrames - CTA_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 1. UGC video — always full screen */}
      <MainVideo src="videos/ugc.mp4" />

      {/* 2. B-roll clips — sequenced per broll-config.ts */}
      {BROLL_CLIPS.map((clip, i) => (
        <Sequence
          key={i}
          from={clip.startFrame}
          durationInFrames={clip.durationInFrames}
          layout="none"
        >
          <BRollOverlay clip={clip} clipStartFrame={clip.startFrame} />
        </Sequence>
      ))}

      {/* 3. Opening hook — top of frame, first 3.5 seconds */}
      <TextOverlay
        lines={[
          { text: "Bond Boss™", highlight: true },
          { text: "Fix cracks in minutes.", highlight: false },
        ]}
        appearFrame={0}
        durationInFrames={VIDEO_FPS * 3.5}
        position="top"
      />

      {/* 4. Mid-roll callout — surfaces it works on (shown around 22 s) */}
      <TextOverlay
        lines={[
          { text: "Walls · Floors · Driveways", highlight: false },
          { text: "Indoor & Outdoor", highlight: false },
        ]}
        appearFrame={VIDEO_FPS * 22}
        durationInFrames={VIDEO_FPS * 4}
        position="bottom"
      />

      {/* 5. CTA end-card */}
      <CTAOverlay startFrame={ctaStart} durationInFrames={CTA_DURATION} />
    </AbsoluteFill>
  );
};
