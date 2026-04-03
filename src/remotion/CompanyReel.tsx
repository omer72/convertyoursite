import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { MissionScene } from "./scenes/MissionScene";
import { ServicesScene } from "./scenes/ServicesScene";
import { StatsScene } from "./scenes/StatsScene";
import { TeamScene } from "./scenes/TeamScene";
import { CTAScene } from "./scenes/CTAScene";

// 60 seconds at 30fps = 1800 frames
// Scene breakdown (with 30-frame crossfade overlaps):
//   Intro:    0-299     (10s)
//   Mission:  270-569   (10s)
//   Services: 540-839   (10s)
//   Stats:    810-1109  (10s)
//   Team:     1080-1379 (10s)
//   CTA:      1350-1799 (15s)

const SCENES = [
  { component: IntroScene, from: 0, duration: 300 },
  { component: MissionScene, from: 270, duration: 300 },
  { component: ServicesScene, from: 540, duration: 300 },
  { component: StatsScene, from: 810, duration: 300 },
  { component: TeamScene, from: 1080, duration: 300 },
  { component: CTAScene, from: 1350, duration: 450 },
];

const CrossfadeScene: React.FC<{
  Component: React.FC;
  sceneDuration: number;
}> = ({ Component, sceneDuration }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [sceneDuration - 30, sceneDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Component />
    </AbsoluteFill>
  );
};

export const CompanyReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a2e" }}>
      {SCENES.map(({ component: Component, from, duration }, i) => (
        <Sequence key={i} from={from} durationInFrames={duration}>
          <CrossfadeScene Component={Component} sceneDuration={duration} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
