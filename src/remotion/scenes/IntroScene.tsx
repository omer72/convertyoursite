import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = interpolate(frame, [0, 30], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(frame, [40, 60], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pulseScale = interpolate(frame % 60, [0, 30, 60], [1, 1.05, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AnimatedBackground color1="#0a0a2e" color2="#1a1a4e">
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 137.5) % 100;
        const baseY = (i * 73.1) % 100;
        const y = baseY + Math.sin((frame + i * 20) * 0.02) * 5;
        const size = 2 + (i % 4);
        const particleOpacity = interpolate(
          frame,
          [i * 3, i * 3 + 30],
          [0, 0.3 + (i % 3) * 0.1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#6366f1" : "#818cf8",
              opacity: particleOpacity,
            }}
          />
        );
      })}

      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale * pulseScale})`,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
          }}
        >
          <span style={{ fontSize: 60, color: "white", fontWeight: 800 }}>
            C
          </span>
        </div>
      </div>

      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          letterSpacing: -2,
        }}
      >
        Company
      </div>

      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: 28,
          color: "#a5b4fc",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          fontWeight: 400,
          marginTop: 16,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Innovation Starts Here
      </div>
    </AnimatedBackground>
  );
};
