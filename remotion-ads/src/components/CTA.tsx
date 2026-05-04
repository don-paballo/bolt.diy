import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = interpolate(
    Math.sin((frame / 30) * Math.PI * 2),
    [-1, 1],
    [0, 1]
  );

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
    durationInFrames: 35,
  });

  const mainTextOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mainTextY = interpolate(frame, [25, 50], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtextOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 10, stiffness: 130, mass: 0.7 },
    durationInFrames: 30,
  });

  const buttonOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgesOpacity = interpolate(frame, [75, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgesY = interpolate(frame, [75, 95], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const orbSize = 400 + bgPulse * 60;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #04040f 0%, #080820 50%, #04040f 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Pulsing background orb */}
      <div
        style={{
          position: "absolute",
          width: orbSize,
          height: orbSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,120,255,${0.08 + bgPulse * 0.04}) 0%, transparent 70%)`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Second orb */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,0,255,0.06) 0%, transparent 70%)",
          right: "10%",
          bottom: "10%",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,120,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,120,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Logo */}
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 20 }}>
        <svg width="80" height="95" viewBox="0 0 120 140">
          <defs>
            <linearGradient id="ctaShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078ff" />
              <stop offset="100%" stopColor="#7800ff" />
            </linearGradient>
          </defs>
          <path
            d="M60 5 L110 25 L110 70 C110 100 88 125 60 135 C32 125 10 100 10 70 L10 25 Z"
            fill="url(#ctaShieldGrad)"
          />
          <circle cx="60" cy="72" r="28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <ellipse cx="60" cy="72" rx="14" ry="28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <line x1="32" y1="72" x2="88" y2="72" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
        </svg>
      </div>

      {/* Main CTA text */}
      <div
        style={{
          opacity: mainTextOpacity,
          transform: `translateY(${mainTextY}px)`,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "white",
            margin: "0 0 8px",
            fontFamily: "'Arial Black', Arial, sans-serif",
            lineHeight: 1.1,
          }}
        >
          Browse Without
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #0078ff, #7800ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Boundaries
          </span>
        </h2>
      </div>

      {/* Subtext */}
      <p
        style={{
          opacity: subtextOpacity,
          fontSize: 22,
          color: "rgba(255,255,255,0.65)",
          fontFamily: "Arial, sans-serif",
          fontWeight: 300,
          margin: "0 0 40px",
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        Fast, Secure & Affordable Proxy Services
      </p>

      {/* CTA Button */}
      <div
        style={{
          opacity: buttonOpacity,
          transform: `scale(${buttonScale})`,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #0078ff, #7800ff)",
            borderRadius: 50,
            padding: "18px 60px",
            fontSize: 26,
            fontWeight: 700,
            fontFamily: "Arial, sans-serif",
            color: "white",
            letterSpacing: 1,
            boxShadow: "0 0 60px rgba(0,120,255,0.5), 0 0 30px rgba(120,0,255,0.3)",
            cursor: "pointer",
          }}
        >
          Visit proxywebs.co.za
        </div>
      </div>

      {/* Trust badges */}
      <div
        style={{
          opacity: badgesOpacity,
          transform: `translateY(${badgesY}px)`,
          display: "flex",
          gap: 40,
          alignItems: "center",
        }}
      >
        {[
          { icon: "🔒", text: "No Logs Policy" },
          { icon: "⚡", text: "Instant Setup" },
          { icon: "🌍", text: "SA Based" },
        ].map((badge) => (
          <div
            key={badge.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Arial, sans-serif",
              fontSize: 18,
            }}
          >
            <span style={{ fontSize: 22 }}>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
