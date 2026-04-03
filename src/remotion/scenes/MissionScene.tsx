import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

export const MissionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headingX = interpolate(frame, [10, 30], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const textOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(frame, [35, 55], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const lineWidth = interpolate(frame, [5, 35], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AnimatedBackground color1="#1a1a4e" color2="#0f172a">
      <div style={{ padding: "0 120px", maxWidth: 1000, textAlign: "left" }}>
        <div
          style={{
            width: lineWidth,
            height: 4,
            background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />
        <div
          style={{
            opacity: headingOpacity,
            transform: `translateX(${headingX}px)`,
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            lineHeight: 1.2,
            marginBottom: 32,
          }}
        >
          Our Mission
        </div>
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            fontSize: 28,
            color: "#c7d2fe",
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          We transform outdated Wix websites into lightning-fast, modern web
          experiences — beautifully designed, fully responsive, and hosted for
          free.
        </div>
      </div>
    </AnimatedBackground>
  );
};
