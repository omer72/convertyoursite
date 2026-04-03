import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headingScale = interpolate(frame, [10, 30], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const subtextOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonScale = interpolate(frame, [55, 70], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const pulseScale = interpolate(frame % 40, [0, 20, 40], [1, 1.05, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AnimatedBackground color1="#1e1b4b" color2="#0a0a2e">
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          opacity: headingOpacity,
          transform: `scale(${headingScale})`,
          fontSize: 64,
          fontWeight: 900,
          color: "white",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 24,
          letterSpacing: -2,
          position: "relative",
          zIndex: 1,
        }}
      >
        Ready to
        <br />
        <span style={{ color: "#a78bfa" }}>Ditch Wix?</span>
      </div>

      <div
        style={{
          opacity: subtextOpacity,
          fontSize: 24,
          color: "#c7d2fe",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          fontWeight: 300,
          marginBottom: 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        convertyoursite.com
      </div>

      <div
        style={{
          opacity: buttonOpacity,
          transform: `scale(${buttonScale * pulseScale})`,
          padding: "18px 48px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 50,
          fontSize: 22,
          fontWeight: 700,
          color: "white",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
          position: "relative",
          zIndex: 1,
        }}
      >
        Get a Free Estimate
      </div>
    </AnimatedBackground>
  );
};
