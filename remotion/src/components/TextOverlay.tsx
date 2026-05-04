import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import { BONDBOSS_BRAND } from "../broll-config";

interface TextOverlayProps {
  lines: string[];
  /** Frame within the composition to start appearing */
  appearFrame: number;
  /** How long the overlay is visible */
  durationInFrames: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  lines,
  appearFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - appearFrame;
  const FADE = 10;

  if (localFrame < 0 || localFrame > durationInFrames) return null;

  const opacity = interpolate(
    localFrame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
        opacity,
      }}
    >
      <div style={{ textAlign: "center" }}>
        {lines.map((line, i) => (
          <TextLine key={i} text={line} index={i} localFrame={localFrame} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const TextLine: React.FC<{
  text: string;
  index: number;
  localFrame: number;
}> = ({ text, index, localFrame }) => {
  const delay = index * 6;
  const slideX = interpolate(
    localFrame,
    [delay, delay + 15],
    [-40, 0],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isFirst = index === 0;

  return (
    <div
      style={{
        transform: `translateX(${slideX}px)`,
        color: isFirst ? BONDBOSS_BRAND.accentColor : BONDBOSS_BRAND.white,
        fontSize: isFirst ? 52 : 38,
        fontFamily: BONDBOSS_BRAND.fontFamily,
        fontWeight: 800,
        lineHeight: 1.2,
        textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        marginBottom: 4,
      }}
    >
      {text}
    </div>
  );
};
