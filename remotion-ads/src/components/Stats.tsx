import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface StatProps {
  value: string;
  label: string;
  delay: number;
  color: string;
}

const Stat: React.FC<StatProps> = ({ value, label, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 90, mass: 1 },
    durationInFrames: 40,
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numberVal = interpolate(frame - delay, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numericMatch = value.match(/(\d+)(.+)/);
  let displayValue = value;
  if (numericMatch) {
    const num = Math.round(parseInt(numericMatch[1]) * numberVal);
    displayValue = `${num}${numericMatch[2]}`;
  }

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          fontFamily: "'Arial Black', Arial, sans-serif",
          color,
          lineHeight: 1,
          textShadow: `0 0 40px ${color}60`,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontSize: 20,
          color: "rgba(255,255,255,0.65)",
          fontFamily: "Arial, sans-serif",
          fontWeight: 400,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerWidth = interpolate(frame, [20, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #050510 0%, #0a0a20 40%, #050515 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        overflow: "hidden",
      }}
    >
      {/* Background circuit pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0,120,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(120,0,255,0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div
        style={{
          opacity: titleOpacity,
          textAlign: "center",
          marginBottom: 20,
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
          Trusted Worldwide
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
          Numbers That Speak
        </h2>
      </div>

      {/* Divider */}
      <div
        style={{
          width: `${dividerWidth}%`,
          maxWidth: 200,
          height: 3,
          background: "linear-gradient(90deg, transparent, #0078ff, transparent)",
          marginBottom: 60,
          borderRadius: 3,
        }}
      />

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 1100,
          gap: 20,
          alignItems: "center",
        }}
      >
        <Stat value="99%" label="Uptime" delay={30} color="#0078ff" />

        <div
          style={{
            width: 1,
            height: 120,
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Stat value="150+" label="Server Locations" delay={50} color="#00d4aa" />

        <div
          style={{
            width: 1,
            height: 120,
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Stat value="10K+" label="Happy Users" delay={70} color="#ff6b35" />

        <div
          style={{
            width: 1,
            height: 120,
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Stat value="256" label="Bit Encryption" delay={90} color="#a855f7" />
      </div>
    </AbsoluteFill>
  );
};
