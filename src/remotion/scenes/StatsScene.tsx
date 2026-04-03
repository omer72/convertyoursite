import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

const stats = [
  { value: "500+", label: "Clients Worldwide" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "50M+", label: "Users Served" },
  { value: "12", label: "Years of Excellence" },
];

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AnimatedBackground color1="#1e1b4b" color2="#312e81">
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: "white",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          marginBottom: 60,
          opacity: interpolate(frame, [5, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        By The Numbers
      </div>

      <div
        style={{
          display: "flex",
          gap: 60,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {stats.map((stat, i) => {
          const delay = 15 + i * 12;
          const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(frame, [delay, delay + 20], [0.5, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.3)),
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `scale(${scale})`,
                textAlign: "center",
                minWidth: 180,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: "#a78bfa",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "#c7d2fe",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedBackground>
  );
};
