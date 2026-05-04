import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import {
  BROLL_CLIPS,
  UGC_DURATION_FRAMES,
  VIDEO_FPS,
} from "../broll-config";
import { MainVideo } from "../components/MainVideo";
import { BRollOverlay } from "../components/BRollOverlay";
import { TextOverlay } from "../components/TextOverlay";
import { CTAOverlay } from "../components/CTAOverlay";

/**
 * BondBossUGC composition.
 *
 * Layer order (bottom → top):
 *   1. UGC video (full screen, always playing)
 *   2. B-roll overlays (timed, fade in/out)
 *   3. Text overlays (intro hook)
 *   4. CTA overlay (final 8 seconds)
 */
export const BondBossUGC: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  const CTA_DURATION = VIDEO_FPS * 8;
  const ctaStartFrame = durationInFrames - CTA_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Layer 1: UGC main video */}
      <MainVideo src="videos/ugc.mp4" />

      {/* Layer 2: B-roll clips — each wrapped in a Sequence for timing */}
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

      {/* Layer 3: Opening hook text (first 3 seconds) */}
      <TextOverlay
        lines={["Bond Boss", "Your SA home, sorted."]}
        appearFrame={0}
        durationInFrames={VIDEO_FPS * 3}
      />

      {/* Layer 4: CTA at the end */}
      <CTAOverlay
        startFrame={ctaStartFrame}
        durationInFrames={CTA_DURATION}
      />
    </AbsoluteFill>
  );
};
