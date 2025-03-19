import { View } from "react-native";
import * as Progress from "react-native-progress";

type ProgressBarProps = {
  progress: number;
  color: string;
};

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  return (
    <View style={{ alignItems: "center", marginLeft: 10, marginRight: 10 }}>
      <Progress.Circle
        progress={progress / 100} // Преобразуем прогресс в диапазон от 0 до 1
        size={25} // Размер кольца
        thickness={5} // Толщина кольца
        color={color} // Цвет кольца
        unfilledColor="#e0e0e0" // Цвет незаполненной части кольца
      />
    </View>
  );
}
