import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  Sequence,
  Easing,
} from "remotion";
// ─── Fonts ────────────────────────────────────────────────────────────────────
const spaceGrotesk = "'Arial Black', Impact, 'Franklin Gothic Heavy', sans-serif";
const syneMono = "'Courier New', 'Lucida Console', monospace";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const BG = "#0A0A0A";
const WHITE = "#FFFFFF";
const LIME = "#C8FF00";
const GHOST = "rgba(255,255,255,0.06)";
const FPS = 24;

const sec = (s: number) => Math.round(s * FPS);

// Spec-required easing: cubic-bezier(0.16, 1, 0.3, 1)
const EXP = Easing.bezier(0.16, 1, 0.3, 1);

// ─── Shared styles ────────────────────────────────────────────────────────────
const H: React.CSSProperties = {
  fontFamily: spaceGrotesk,
  fontWeight: 700,
  letterSpacing: "-0.04em",
  color: WHITE,
  lineHeight: 1.05,
  textTransform: "uppercase",
};

const MONO: React.CSSProperties = {
  fontFamily: syneMono,
  fontWeight: 400,
};

// ─── Stagger helper ───────────────────────────────────────────────────────────
// Renders each character as an animated inline-block span.
// dir "l" = slides in from left, "r" = from right.
const Stagger: React.FC<{
  text: string;
  startFrame: number;
  frame: number;
  dir?: "l" | "r";
  gap?: number;
}> = ({ text, startFrame, frame, dir = "l", gap = 1.44 }) => (
  <>
    {text.split("").map((ch, i) => {
      const f = Math.max(0, frame - startFrame - i * gap);
      const opacity = interpolate(f, [0, 5], [0, 1], { extrapolateRight: "clamp" });
      const tx = interpolate(f, [0, 10], [dir === "l" ? -60 : 60, 0], {
        extrapolateRight: "clamp",
        easing: EXP,
      });
      return (
        <span
          key={i}
          style={{ opacity, transform: `translateX(${tx}px)`, display: "inline-block" }}
        >
          {ch === " " ? " " : ch}
        </span>
      );
    })}
  </>
);

// ─── Service tag pill ─────────────────────────────────────────────────────────
const Tag: React.FC<{ label: string; startFrame: number; frame: number }> = ({
  label,
  startFrame,
  frame,
}) => {
  const s = spring({
    frame: Math.max(0, frame - startFrame),
    fps: FPS,
    config: { damping: 14, stiffness: 380 },
  });
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  const opacity = interpolate(frame, [startFrame, startFrame + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "inline-block",
        alignSelf: "flex-start",
        border: `2px solid ${LIME}`,
        borderRadius: 6,
        padding: "12px 32px",
        ...H,
        fontSize: 34,
        letterSpacing: "0.06em",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      {label}
    </div>
  );
};

// ─── Section 1: The pitch (global frames 0–251) ───────────────────────────────
const Section1: React.FC = () => {
  const frame = useCurrentFrame();

  const T = {
    line1: sec(0.8),  // 19 — line 1 letter stagger starts
    strike: sec(2.2), // 53 — strikethrough grows
    del: sec(2.4),    // 58 — DESIGN gets deleted
    line2: sec(3.0),  // 72 — line 2 types in
    shrink: sec(4.5), // 108 — both lines shrink up
    ai: sec(5.5),     // 132 — AI-POWERED crashes down
    dev: sec(6.8),    // 163 — DEVELOPMENT AGENCY fades in
    t1: sec(8.0),     // 192 — [WEB APPS]
    t2: sec(8.4),     // 202 — [AUTOMATIONS]
    t3: sec(8.8),     // 211 — [AI SYSTEMS]
  };

  // ── Line 1 delete logic ────────────────────────────────────────────────────
  const inDelPhase = frame >= T.del && frame < T.line2;
  const postDel = frame >= T.line2;
  const designLeft = postDel
    ? 0
    : inDelPhase
    ? Math.max(
        0,
        Math.round(
          interpolate(frame, [T.del, T.line2 - 2], [6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        )
      )
    : 6;
  const showCursor = inDelPhase && Math.floor(frame / 5) % 2 === 0;

  // ── Strikethrough bar ──────────────────────────────────────────────────────
  const strikeW = interpolate(frame, [T.strike, T.strike + 10], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXP,
  });

  // ── Shrink spring ──────────────────────────────────────────────────────────
  const shrS = spring({
    frame: Math.max(0, frame - T.shrink),
    fps: FPS,
    config: { damping: 22, stiffness: 120 },
  });
  const copyScale = interpolate(shrS, [0, 1], [1, 0.36]);
  const copyDy = interpolate(shrS, [0, 1], [0, -720]);

  // ── AI-POWERED: crash from top with overshoot ─────────────────────────────
  const aiS = spring({
    frame: Math.max(0, frame - T.ai),
    fps: FPS,
    config: { damping: 11, stiffness: 290, mass: 0.85 },
  });
  const aiY = interpolate(aiS, [0, 1], [-420, 0]);
  const aiOp = interpolate(frame, [T.ai, T.ai + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Dev agency ────────────────────────────────────────────────────────────
  const devOp = interpolate(
    spring({ frame: Math.max(0, frame - T.dev), fps: FPS, config: { damping: 22 } }),
    [0, 1],
    [0, 1]
  );

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Ghost text decoration */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: -30,
          right: -30,
          fontFamily: spaceGrotesk,
          fontWeight: 700,
          fontSize: 280,
          letterSpacing: "-0.06em",
          color: GHOST,
          lineHeight: 0.82,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        BUILT
        <br />
        DIFF
      </div>

      {/* Opening cursor (before line 1 appears) */}
      {frame < T.line1 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 64,
            transform: "translateY(-50%)",
            ...MONO,
            fontSize: 90,
            color: LIME,
            opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0,
          }}
        >
          _
        </div>
      )}

      {/* Copy block — moves up and shrinks at T.shrink */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 64,
          right: 64,
          transform: `translateY(calc(-50% + ${copyDy}px)) scale(${copyScale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Line 1 */}
        <div style={{ position: "relative" }}>
          <div style={{ ...H, fontSize: 86, display: "block" }}>
            {/* Stagger phase (pre-delete) */}
            {!inDelPhase && !postDel && (
              <Stagger
                text="WE DON'T DESIGN WEBSITES."
                startFrame={T.line1}
                frame={frame}
                dir="l"
              />
            )}
            {/* Delete / post-delete phase */}
            {(inDelPhase || postDel) && (
              <span>
                {"WE DON'T "}
                <span>{"DESIGN".slice(0, designLeft)}</span>
                {showCursor && <span style={{ color: LIME }}>|</span>}
                {" WEBSITES."}
              </span>
            )}
          </div>

          {/* Lime strikethrough */}
          {frame >= T.strike && frame < T.line2 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                height: 5,
                background: LIME,
                borderRadius: 2.5,
                width: `${strikeW}%`,
                transform: "translateY(-50%)",
                boxShadow: `0 0 12px ${LIME}`,
              }}
            />
          )}
        </div>

        {/* Line 2: types in from right */}
        {frame >= T.line2 && (
          <div
            style={{
              ...H,
              fontSize: 86,
              display: "block",
              marginTop: 6,
              opacity: interpolate(frame, [T.line2, T.line2 + 4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Stagger
              text="WE ENGINEER BUSINESSES."
              startFrame={T.line2}
              frame={frame}
              dir="r"
              gap={1.2}
            />
          </div>
        )}
      </div>

      {/* AI-POWERED — crashes from top */}
      {frame >= T.ai && (
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: 64,
            right: 64,
            transform: `translateY(calc(-50% + ${aiY}px))`,
            opacity: aiOp,
          }}
        >
          <div
            style={{
              ...H,
              fontSize: 152,
              color: LIME,
              lineHeight: 0.9,
              textShadow: `0 0 40px ${LIME}55`,
            }}
          >
            AI-POWERED.
          </div>

          {/* DEVELOPMENT AGENCY */}
          {frame >= T.dev && (
            <div style={{ ...H, fontSize: 54, marginTop: 28, opacity: devOp }}>
              DEVELOPMENT AGENCY.
            </div>
          )}
        </div>
      )}

      {/* Service tags */}
      {frame >= T.t1 && (
        <div
          style={{
            position: "absolute",
            bottom: 180,
            left: 64,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <Tag label="WEB APPS" startFrame={T.t1} frame={frame} />
          <Tag label="AUTOMATIONS" startFrame={T.t2} frame={frame} />
          <Tag label="AI SYSTEMS" startFrame={T.t3} frame={frame} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── Section 2: The close (global frames 252–431) ─────────────────────────────
const Section2: React.FC = () => {
  const frame = useCurrentFrame(); // 0 = global 252

  const T = {
    results: sec(0.2),  //  5 — RESULTS. materialises
    counter: sec(1.5),  // 36 — counter starts (global 12.0s)
    cEnd: sec(2.7),     // 65 — counter ends   (global 13.2s)
    logo: sec(3.0),     // 72 — logo wipe       (global 13.5s)
    tagline: sec(5.0),  // 120 — tagline         (global 15.5s)
    fade: sec(6.5),     // 156 — fade to black   (global 17.0s)
    end: sec(7.5),      // 180 — end             (global 18.0s)
  };

  // ── RESULTS ───────────────────────────────────────────────────────────────
  const resS = spring({
    frame: Math.max(0, frame - T.results),
    fps: FPS,
    config: { damping: 18, stiffness: 110 },
  });
  const resOp = interpolate(resS, [0, 1], [0, 1]);
  const resY = interpolate(resS, [0, 1], [50, 0]);

  // ── Counter: 000 → 100 ────────────────────────────────────────────────────
  const count = Math.round(
    interpolate(frame, [T.counter, T.cEnd], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EXP,
    })
  );
  const countOp = interpolate(frame, [T.counter, T.counter + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scanline wipe for logo ────────────────────────────────────────────────
  const wipeS = spring({
    frame: Math.max(0, frame - T.logo),
    fps: FPS,
    config: { damping: 22, stiffness: 75 },
  });
  const wipe = interpolate(wipeS, [0, 1], [0, 110]); // go slightly past 100% to avoid clipping

  // ── Tagline ───────────────────────────────────────────────────────────────
  const tagOp = interpolate(
    spring({ frame: Math.max(0, frame - T.tagline), fps: FPS, config: { damping: 25 } }),
    [0, 1],
    [0, 0.4]
  );

  // ── Fade to black ─────────────────────────────────────────────────────────
  const blackOp = interpolate(frame, [T.fade, T.end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Ghost text */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: -30,
          right: -30,
          fontFamily: spaceGrotesk,
          fontWeight: 700,
          fontSize: 280,
          letterSpacing: "-0.06em",
          color: GHOST,
          lineHeight: 0.82,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        100%
      </div>

      {/* RESULTS + counter */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 64,
          right: 64,
          opacity: resOp,
          transform: `translateY(${resY}px)`,
        }}
      >
        <div style={{ ...H, fontSize: 142, letterSpacing: "-0.05em" }}>
          RESULTS.
        </div>

        {frame >= T.counter && (
          <div
            style={{
              ...MONO,
              fontSize: 112,
              color: LIME,
              marginTop: 18,
              opacity: countOp,
              letterSpacing: "0.04em",
              textShadow: `0 0 30px ${LIME}66`,
            }}
          >
            {String(count).padStart(3, "0")}
          </div>
        )}
      </div>

      {/* Logo: PROXY (white) + LABS (lime) — scanline wipe left→right */}
      {frame >= T.logo && (
        <div
          style={{
            position: "absolute",
            bottom: 270,
            left: 64,
            clipPath: `polygon(0 0, ${wipe}% 0, ${wipe}% 110%, 0 110%)`,
          }}
        >
          <div
            style={{
              ...MONO,
              fontSize: 100,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            <span style={{ color: WHITE }}>PROXY</span>
            <span style={{ color: LIME }}>LABS</span>
          </div>
        </div>
      )}

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 190,
          left: 64,
          ...H,
          fontWeight: 400,
          fontSize: 30,
          letterSpacing: "0.02em",
          color: WHITE,
          opacity: tagOp,
          textTransform: "none",
        }}
      >
        proxylabs.co.za
      </div>

      {/* Fade to black overlay */}
      <AbsoluteFill
        style={{ background: "#000000", opacity: blackOp, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};

// ─── Exported composition ─────────────────────────────────────────────────────
// Total: 18s × 24fps = 432 frames
// Section 1: frames   0–251 (global  0.0s – 10.5s)
// Section 2: frames 252–431 (global 10.5s – 18.0s)
export const ProxyLabsAd: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={0} durationInFrames={252}>
      <Section1 />
    </Sequence>
    <Sequence from={252} durationInFrames={180}>
      <Section2 />
    </Sequence>
  </AbsoluteFill>
);
