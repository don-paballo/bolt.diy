import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  staticFile,
  Img,
} from "remotion";
import { BONDBOSS_BRAND } from "../broll-config";

interface CTAOverlayProps {
  /** Frame within composition where CTA starts */
  startFrame: number;
  durationInFrames: number;
}

export const CTAOverlay: React.FC<CTAOverlayProps> = ({
  startFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationInFrames) return null;

  const FADE = 15;
  const opacity = interpolate(
    localFrame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    localFrame,
    [0, FADE],
    [0.92, 1],
    { easing: Easing.out(Easing.back(1.5)), extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 60,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Dark gradient backing */}
      <div
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          width: "88%",
        }}
      >
        {/* Logo */}
        <Img
          src={staticFile(BONDBOSS_BRAND.logoSrc)}
          style={{ height: 60, objectFit: "contain" }}
        />

        {/* CTA pill */}
        <div
          style={{
            backgroundColor: BONDBOSS_BRAND.accentColor,
            color: BONDBOSS_BRAND.primaryColor,
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 40,
            paddingRight: 40,
            borderRadius: 60,
            fontSize: 34,
            fontFamily: BONDBOSS_BRAND.fontFamily,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: -0.5,
            width: "100%",
          }}
        >
          {BONDBOSS_BRAND.ctaText}
        </div>

        {/* Sub-line */}
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 22,
            fontFamily: BONDBOSS_BRAND.fontFamily,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          SA&apos;s #1 bond originator · 100% free to apply
        </div>
      </div>
    </AbsoluteFill>
  );
};
