import { View } from "react-native";

type ProgressBarProps = {
  progress: number;
  color: string;
};

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  return (
    <View
      style={{
        height: 5,
        backgroundColor: color,
        width: `${progress}%`,
        marginTop: 5,
      }}
    />
  );
}
