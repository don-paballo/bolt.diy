import React from "react";
import {
  AbsoluteFill,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRollClip, BONDBOSS_BRAND } from "../broll-config";

interface BRollOverlayProps {
  clip: BRollClip;
  /** Frame this clip started (relative to composition start) */
  clipStartFrame: number;
}

const FADE_DURATION = 12; // frames to fade in/out

export const BRollOverlay: React.FC<BRollOverlayProps> = ({
  clip,
  clipStartFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - clipStartFrame;
  const totalFrames = clip.durationInFrames;

  const opacity = interpolate(
    localFrame,
    [0, FADE_DURATION, totalFrames - FADE_DURATION, totalFrames],
    [0, clip.opacity ?? 1, clip.opacity ?? 1, 0],
    { easing: Easing.ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const videoStyle: React.CSSProperties =
    clip.layout === "pip"
      ? {
          position: "absolute",
          bottom: 160,
          right: 24,
          width: "42%",
          aspectRatio: "9/16",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          border: `3px solid ${BONDBOSS_BRAND.accentColor}`,
        }
      : {
          position: "absolute",
          inset: 0,
        };

  return (
    <div style={{ opacity }}>
      <div style={videoStyle}>
        <Video
          src={staticFile(`videos/${clip.src}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
      </div>

      {clip.caption && (
        <Caption
          text={clip.caption}
          localFrame={localFrame}
          totalFrames={totalFrames}
          layout={clip.layout}
        />
      )}
    </div>
  );
};

const Caption: React.FC<{
  text: string;
  localFrame: number;
  totalFrames: number;
  layout: BRollClip["layout"];
}> = ({ text, localFrame, totalFrames, layout }) => {
  const slideY = interpolate(
    localFrame,
    [0, FADE_DURATION],
    [30, 0],
    { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    localFrame,
    [0, FADE_DURATION, totalFrames - FADE_DURATION, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const bottomPos = layout === "pip" ? 120 : 140;

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomPos,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: BONDBOSS_BRAND.primaryColor,
          color: BONDBOSS_BRAND.white,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 8,
          fontSize: 32,
          fontFamily: BONDBOSS_BRAND.fontFamily,
          fontWeight: 700,
          letterSpacing: -0.5,
          textAlign: "center",
          maxWidth: "80%",
          borderLeft: `4px solid ${BONDBOSS_BRAND.accentColor}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
