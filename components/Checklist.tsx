import { Text, TouchableOpacity, View } from "react-native";

import calculateProgress from "../utils/progress";
import { ChecklistItem } from "../types";

type Props = {
  checklist: ChecklistItem;
  toggleComplete: (id: string) => void;
};

export default function Checklist({ checklist, toggleComplete }: Props) {
  const hasChildren = checklist.children.length > 0;

  return (
    <View style={{ marginLeft: 20, borderLeftWidth: 2, paddingLeft: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!hasChildren && (
          <TouchableOpacity onPress={() => toggleComplete(checklist.id)}>
            <Text>{checklist.completed ? "✅" : "⬜"}</Text>
          </TouchableOpacity>
        )}
        <Text style={{ marginLeft: 8 }}>{checklist.title}</Text>
      </View>

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
