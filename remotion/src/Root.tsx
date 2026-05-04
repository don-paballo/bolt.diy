import React from "react";
import { Composition } from "remotion";
import { BondBossUGC } from "./compositions/BondBossUGC";
import {
  VIDEO_FPS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  UGC_DURATION_FRAMES,
} from "./broll-config";

export const Root: React.FC = () => {
  return (
    <Composition
      id="BondBossUGC"
      component={BondBossUGC}
      durationInFrames={UGC_DURATION_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
