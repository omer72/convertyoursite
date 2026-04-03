import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";

const services = [
  { icon: "\uD83D\uDD04", title: "Wix Migration", desc: "Seamless transition from Wix to modern stack" },
  { icon: "\uD83C\uDFA8", title: "Modern Design", desc: "Sleek, responsive UI with Tailwind & React" },
  { icon: "\u26A1", title: "Blazing Fast", desc: "Static-site performance with Next.js" },
  { icon: "\uD83D\uDCB0", title: "Free Hosting", desc: "GitHub Pages / Netlify — $0/month" },
];

export const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AnimatedBackground color1="#0f172a" color2="#1e1b4b">
      <div
        style={{
          opacity: headingOpacity,
          fontSize: 52,
          fontWeight: 800,
          color: "white",
          fontFamily: "Inter, Helvetica, Arial, sans-serif",
          marginBottom: 60,
          letterSpacing: -1,
        }}
      >
        What We Do
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        {services.map((service, i) => {
          const delay = 20 + i * 15;
          const cardOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cardY = interpolate(frame, [delay, delay + 20], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const cardScale = interpolate(
            frame,
            [delay, delay + 20],
            [0.9, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                width: 240,
                padding: "36px 28px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>
                {service.icon}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  marginBottom: 8,
                }}
              >
                {service.title}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#a5b4fc",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                {service.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedBackground>
  );
};
