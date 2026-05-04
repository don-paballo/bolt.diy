import React from "react";
import { Composition } from "remotion";
import { ProxWebsAd } from "./ProxWebsAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main 16:9 ad - 14 seconds @ 30fps */}
      <Composition
        id="ProxWebsAd"
        component={ProxWebsAd}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Square format for Instagram/social */}
      <Composition
        id="ProxWebsAd-Square"
        component={ProxWebsAd}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{}}
      />

      {/* Vertical format for Stories/Reels */}
      <Composition
        id="ProxWebsAd-Vertical"
        component={ProxWebsAd}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
