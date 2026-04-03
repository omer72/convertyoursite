import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const AnimatedBackground: React.FC<{
  color1: string;
  color2: string;
  children: React.ReactNode;
}> = ({ color1, color2, children }) => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 300], [135, 225]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
