import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
    durationInFrames: 40,
  });

  const textOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [30, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [55, 80], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgGradientProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particle1X = interpolate(frame, [0, 90], [-10, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particle2X = interpolate(frame, [10, 90], [110, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0a0a1a ${100 - bgGradientProgress * 40}%, #0d1b4b ${bgGradientProgress * 60}%, #1a0a3a ${bgGradientProgress * 100}%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated background particles */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,120,255,0.15) 0%, transparent 70%)",
          left: `${particle1X}%`,
          top: "20%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,0,255,0.12) 0%, transparent 70%)",
          left: `${particle2X}%`,
          top: "70%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,120,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,120,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: bgGradientProgress,
        }}
      />

      {/* Logo shield icon */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          marginBottom: 30,
          position: "relative",
        }}
      >
        <svg width="120" height="140" viewBox="0 0 120 140">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078ff" />
              <stop offset="100%" stopColor="#7800ff" />
            </linearGradient>
          </defs>
          <path
            d="M60 5 L110 25 L110 70 C110 100 88 125 60 135 C32 125 10 100 10 70 L10 25 Z"
            fill="url(#shieldGrad)"
          />
          <path
            d="M60 20 L95 35 L95 70 C95 92 80 110 60 118 C40 110 25 92 25 70 L25 35 Z"
            fill="rgba(255,255,255,0.08)"
          />
          {/* Globe lines inside shield */}
          <circle cx="60" cy="72" r="28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <ellipse cx="60" cy="72" rx="14" ry="28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <line x1="32" y1="72" x2="88" y2="72" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <line x1="36" y1="58" x2="84" y2="58" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1="36" y1="86" x2="84" y2="86" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Brand name */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "'Arial Black', Arial, sans-serif",
            letterSpacing: "-1px",
            color: "white",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#0078ff" }}>proxy</span>
          <span style={{ color: "white" }}>webs</span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginLeft: 4,
            }}
          >
            .co.za
          </span>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          marginTop: 16,
        }}
      >
        <p
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.75)",
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
            letterSpacing: 4,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
          }}
        >
          Your Gateway to the World
        </p>
      </div>
    </AbsoluteFill>
  );
};
