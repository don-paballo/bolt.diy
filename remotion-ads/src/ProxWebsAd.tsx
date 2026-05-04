import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Intro } from "./components/Intro";
import { Features } from "./components/Features";
import { Stats } from "./components/Stats";
import { CTA } from "./components/CTA";

// Total: 420 frames @ 30fps = 14 seconds
// Intro:    0-105   (3.5s)
// Features: 90-210  (4s, with 15-frame overlap for smooth transition)
// Stats:    195-315 (4s, with 15-frame overlap)
// CTA:      300-420 (4s, with 15-frame overlap)

const INTRO_START = 0;
const INTRO_DURATION = 105;

const FEATURES_START = 90;
const FEATURES_DURATION = 120;

const STATS_START = 195;
const STATS_DURATION = 120;

const CTA_START = 300;
const CTA_DURATION = 120;

const TransitionOverlay: React.FC<{
  from: number;
  duration: number;
}> = ({ from, duration }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [from, from + duration / 2, from + duration],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0010ff10, #ff000010)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const ProxWebsAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#04040f" }}>
      <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION + 15}>
        <Intro />
      </Sequence>

      <Sequence from={FEATURES_START} durationInFrames={FEATURES_DURATION + 15}>
        <Features />
      </Sequence>

      <Sequence from={STATS_START} durationInFrames={STATS_DURATION + 15}>
        <Stats />
      </Sequence>

      <Sequence from={CTA_START} durationInFrames={CTA_DURATION}>
        <CTA />
      </Sequence>

      {/* Flash transition overlays */}
      <TransitionOverlay from={FEATURES_START - 5} duration={10} />
      <TransitionOverlay from={STATS_START - 5} duration={10} />
      <TransitionOverlay from={CTA_START - 5} duration={10} />
    </AbsoluteFill>
  );
};
