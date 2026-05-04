import React from "react";
import {
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { BRollClip, BONDBOSS_BRAND } from "../broll-config";

interface BRollOverlayProps {
  clip: BRollClip;
  clipStartFrame: number;
}

const FADE_FRAMES = 10;

export const BRollOverlay: React.FC<BRollOverlayProps> = ({
  clip,
  clipStartFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - clipStartFrame;
  const total = clip.durationInFrames;
  const maxOpacity = clip.opacity ?? 1;

  const opacity = interpolate(
    localFrame,
    [0, FADE_FRAMES, total - FADE_FRAMES, total],
    [0, maxOpacity, maxOpacity, 0],
    { easing: Easing.ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (clip.layout === "pip") {
    return (
      <div style={{ opacity }}>
        <PipVideo src={clip.src} />
        {clip.caption && (
          <Caption text={clip.caption} localFrame={localFrame} total={total} layout="pip" />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <Video
        src={staticFile(`videos/${clip.src}`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
      {/* Green tint overlay to keep Bond Boss brand feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 40%, ${BONDBOSS_BRAND.darkGreen}99 100%)`,
        }}
      />
      {clip.caption && (
        <Caption text={clip.caption} localFrame={localFrame} total={total} layout="fullscreen" />
      )}
    </div>
  );
};

const PipVideo: React.FC<{ src: string }> = ({ src }) => (
  <div
    style={{
      position: "absolute",
      bottom: 200,
      right: 20,
      width: "40%",
      aspectRatio: "9 / 16",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 6px 28px rgba(0,0,0,0.55)",
      border: `3px solid ${BONDBOSS_BRAND.primaryGreen}`,
    }}
  >
    <Video
      src={staticFile(`videos/${src}`)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      muted
    />
  </div>
);

const Caption: React.FC<{
  text: string;
  localFrame: number;
  total: number;
  layout: BRollClip["layout"];
}> = ({ text, localFrame, total, layout }) => {
  const slideY = interpolate(localFrame, [0, FADE_FRAMES], [24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(
    localFrame,
    [0, FADE_FRAMES, total - FADE_FRAMES, total],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: layout === "pip" ? 130 : 110,
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
          backgroundColor: BONDBOSS_BRAND.primaryGreen,
          color: BONDBOSS_BRAND.white,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 28,
          paddingRight: 28,
          borderRadius: 10,
          fontSize: 30,
          fontFamily: BONDBOSS_BRAND.fontFamily,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: "82%",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          borderBottom: `4px solid ${BONDBOSS_BRAND.lightGreen}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
