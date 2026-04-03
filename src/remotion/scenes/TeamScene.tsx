import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

const teamMembers = [
  { initials: "AK", name: "Alex Kim", role: "CEO" },
  { initials: "SR", name: "Sarah Reyes", role: "CTO" },
  { initials: "MJ", name: "Marcus Jones", role: "VP Design" },
  { initials: "LP", name: "Lisa Park", role: "VP Engineering" },
  { initials: "DW", name: "David Wu", role: "Head of AI" },
];

const avatarColors = ["#6366f1", "#8b5cf6", "#a78bfa", "#7c3aed", "#4f46e5"];

export const TeamScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AnimatedBackground color1="#312e81" color2="#1e1b4b">
      <div
        style={{
          opacity: headingOpacity,
          fontSize: 52,
          fontWeight: 800,
          color: "white",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          marginBottom: 60,
        }}
      >
        Our Leadership
      </div>

      <div
        style={{
          display: "flex",
          gap: 40,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {teamMembers.map((member, i) => {
          const delay = 20 + i * 10;
          const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(frame, [delay, delay + 20], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: avatarColors[i],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: `0 10px 30px ${avatarColors[i]}66`,
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  }}
                >
                  {member.initials}
                </span>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "white",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  marginBottom: 4,
                }}
              >
                {member.name}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#a5b4fc",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                {member.role}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedBackground>
  );
};
