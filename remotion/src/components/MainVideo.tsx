import { AbsoluteFill, Video, staticFile } from "remotion";

interface MainVideoProps {
  src: string;
  opacity?: number;
}

export const MainVideo: React.FC<MainVideoProps> = ({ src, opacity = 1 }) => {
  return (
    <AbsoluteFill style={{ opacity }}>
      <Video
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
