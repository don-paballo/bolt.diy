import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
    durationInFrames: 35,
  });

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame - delay, [0, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}40`,
        borderRadius: 20,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        flex: 1,
        boxShadow: `0 0 40px ${color}20`,
      }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `${color}20`,
          border: `2px solid ${color}60`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "white",
          margin: 0,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.65)",
          margin: 0,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          lineHeight: 1.5,
          fontWeight: 300,
        }}
      >
        {description}
      </p>
    </div>
  );
};

export const Features: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [5, 30], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scanLineY = interpolate(frame, [0, 120], [-5, 105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #080818 0%, #0a0f2e 50%, #080818 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        overflow: "hidden",
      }}
    >
      {/* Scanning line effect */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(0,120,255,0.6), transparent)",
          top: `${scanLineY}%`,
          pointerEvents: "none",
        }}
      />

      {/* Section header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <p
          style={{
            fontSize: 16,
            color: "#0078ff",
            fontFamily: "Arial, sans-serif",
            letterSpacing: 6,
            textTransform: "uppercase",
            margin: "0 0 12px",
            fontWeight: 600,
          }}
        >
          Why Choose Us
        </p>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            margin: 0,
            fontFamily: "'Arial Black', Arial, sans-serif",
          }}
        >
          Powerful Proxy Solutions
        </h2>
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: "flex",
          gap: 30,
          width: "100%",
          maxWidth: 1100,
        }}
      >
        <FeatureCard
          delay={20}
          color="#0078ff"
          icon={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 4 L32 18 L18 32 L4 18 Z"
                stroke="#0078ff"
                strokeWidth="2.5"
                fill="none"
              />
              <path d="M12 18 L22 18 M18 12 L24 18 L18 24" stroke="#0078ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Blazing Fast"
          description="Ultra-low latency connections with global server infrastructure"
        />
        <FeatureCard
          delay={40}
          color="#00d4aa"
          icon={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 4 L30 10 L30 22 C30 28 25 32 18 34 C11 32 6 28 6 22 L6 10 Z"
                stroke="#00d4aa"
                strokeWidth="2.5"
                fill="none"
              />
              <path d="M12 18 L16 22 L24 14" stroke="#00d4aa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Secure & Private"
          description="Military-grade encryption keeps your data safe at all times"
        />
        <FeatureCard
          delay={60}
          color="#ff6b35"
          icon={
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="13" stroke="#ff6b35" strokeWidth="2.5" fill="none" />
              <ellipse cx="18" cy="18" rx="7" ry="13" stroke="#ff6b35" strokeWidth="2.5" fill="none" />
              <line x1="5" y1="18" x2="31" y2="18" stroke="#ff6b35" strokeWidth="2.5" />
              <line x1="7" y1="12" x2="29" y2="12" stroke="#ff6b35" strokeWidth="1.5" />
              <line x1="7" y1="24" x2="29" y2="24" stroke="#ff6b35" strokeWidth="1.5" />
            </svg>
          }
          title="Global Access"
          description="Bypass geo-restrictions and access content from anywhere worldwide"
        />
      </div>
    </AbsoluteFill>
  );
};
