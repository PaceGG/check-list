import { Text, TouchableOpacity, View } from "react-native";

import calculateProgress from "../utils/progress";
import { ChecklistItem } from "../types";

type Props = {
  checklists: Record<string, ChecklistItem>;
  checklist: ChecklistItem;
  toggleComplete: (id: string) => void;
  openChecklist: (child: ChecklistItem) => void;
};

export default function Checklist({
  checklists,
  checklist,
  toggleComplete,
  openChecklist,
}: Props) {
  const hasChildren = checklist.children.length > 0;

  return (
    <View
      style={{
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!hasChildren && (
          <TouchableOpacity
            onPress={() => toggleComplete(checklist.id)}
            style={{ marginRight: 10 }}
          >
            <Text>{checklist.completed ? "✅" : "⬜"}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => hasChildren && openChecklist(checklist)}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: hasChildren ? "bold" : "normal",
            }}
          >
            {hasChildren ? "📂 " : "📄 "}
            {checklist.title}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: 5,
          backgroundColor: checklist.progressColor,
          width: `${calculateProgress(checklist, checklists)}%`,
          marginTop: 5,
        }}
      />
    </View>
  );
}
