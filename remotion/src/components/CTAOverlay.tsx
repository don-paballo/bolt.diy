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

  const FADE = 12;
  const opacity = interpolate(
    localFrame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scale = interpolate(localFrame, [0, FADE], [0.94, 1], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {/* Full-height gradient so text is always readable */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: `linear-gradient(to top, ${BONDBOSS_BRAND.darkGreen}F5 0%, ${BONDBOSS_BRAND.darkGreen}99 55%, transparent 100%)`,
        }}
      />

      {/* CTA card */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 64,
        }}
      >
        <div
          style={{
            width: "88%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Logo */}
          <Img
            src={staticFile(BONDBOSS_BRAND.logoSrc)}
            style={{ height: 64, objectFit: "contain" }}
          />

          {/* Tagline */}
          <div
            style={{
              color: BONDBOSS_BRAND.lightGreen,
              fontSize: 28,
              fontFamily: BONDBOSS_BRAND.fontFamily,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {BONDBOSS_BRAND.tagline}
          </div>

          {/* Main CTA button */}
          <div
            style={{
              backgroundColor: BONDBOSS_BRAND.primaryGreen,
              color: BONDBOSS_BRAND.white,
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 40,
              paddingRight: 40,
              borderRadius: 60,
              fontSize: 36,
              fontFamily: BONDBOSS_BRAND.fontFamily,
              fontWeight: 900,
              textAlign: "center",
              width: "100%",
              boxShadow: `0 6px 24px ${BONDBOSS_BRAND.darkGreen}99`,
              border: `3px solid ${BONDBOSS_BRAND.lightGreen}`,
            }}
          >
            {BONDBOSS_BRAND.ctaText}
          </div>

          {/* Sub-line */}
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 22,
              fontFamily: BONDBOSS_BRAND.fontFamily,
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            {BONDBOSS_BRAND.ctaSubline}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
