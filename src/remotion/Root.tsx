import React from "react";
import { Composition } from "remotion";
import { CompanyReel } from "./CompanyReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CompanyReel"
        component={CompanyReel}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
