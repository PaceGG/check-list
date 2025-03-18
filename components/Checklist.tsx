import { Text, TouchableOpacity, View } from "react-native";

import calculateProgress from "../utils/progress";
import { ChecklistItem } from "../types";

type Props = {
  checklist: ChecklistItem;
  toggleComplete: (id: string) => void;
};

export default function Checklist({ checklist, toggleComplete }: Props) {
  return (
    <View style={{ marginLeft: 20, borderLeftWidth: 2, paddingLeft: 10 }}>
      <TouchableOpacity onPress={() => toggleComplete(checklist.id)}>
        <Text>
          {checklist.completed ? "✅" : "⬜"} {checklist.title}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 5,
          backgroundColor: checklist.progressColor,
          width: `${calculateProgress(checklist)}%`,
        }}
      />
      {checklist.children.map((child) => (
        <Checklist
          key={child.id}
          checklist={child}
          toggleComplete={toggleComplete}
        />
      ))}
    </View>
  );
}
