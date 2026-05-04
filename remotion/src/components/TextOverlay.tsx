import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill } from "remotion";
import { BONDBOSS_BRAND } from "../broll-config";

interface TextOverlayProps {
  lines: Array<{ text: string; highlight?: boolean }>;
  appearFrame: number;
  durationInFrames: number;
  position?: "top" | "center" | "bottom";
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  lines,
  appearFrame,
  durationInFrames,
  position = "top",
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - appearFrame;
  const FADE = 8;

  if (localFrame < 0 || localFrame > durationInFrames) return null;

  const opacity = interpolate(
    localFrame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const justifyMap = { top: "flex-start", center: "center", bottom: "flex-end" } as const;
  const paddingMap = { top: { paddingTop: 90 }, center: {}, bottom: { paddingBottom: 90 } };

  return (
    <AbsoluteFill
      style={{
        justifyContent: justifyMap[position],
        alignItems: "center",
        opacity,
        ...paddingMap[position],
      }}
    >
      {/* Semi-transparent pill background */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          borderRadius: 16,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 36,
          paddingRight: 36,
          borderLeft: `6px solid ${BONDBOSS_BRAND.primaryGreen}`,
          maxWidth: "86%",
        }}
      >
        {lines.map((line, i) => (
          <AnimatedLine
            key={i}
            text={line.text}
            highlight={line.highlight ?? false}
            index={i}
            localFrame={localFrame}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const AnimatedLine: React.FC<{
  text: string;
  highlight: boolean;
  index: number;
  localFrame: number;
}> = ({ text, highlight, index, localFrame }) => {
  const delay = index * 5;
  const translateX = interpolate(localFrame, [delay, delay + 12], [-30, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        color: highlight ? BONDBOSS_BRAND.primaryGreen : BONDBOSS_BRAND.white,
        fontSize: highlight ? 56 : 38,
        fontFamily: BONDBOSS_BRAND.fontFamily,
        fontWeight: 900,
        lineHeight: 1.15,
        textAlign: "left",
        textTransform: highlight ? "uppercase" : "none",
        letterSpacing: highlight ? 1 : 0,
        marginBottom: 4,
        textShadow: "0 2px 10px rgba(0,0,0,0.6)",
      }}
    >
      {text}
    </div>
  );
};
