import { Text, TouchableOpacity, View } from "react-native";

import calculateProgress from "../utils/progress";
import { ChecklistItem } from "../types";
import ProgressBar from "./ProgressBar";
import Checkbox from "./Checkbox";

type Props = {
  checklists: Record<string, ChecklistItem>;
  checklist: ChecklistItem;
  toggleComplete: (id: string) => void;
  openChecklist: (id: string) => void;
};

export default function Checklist({
  checklists,
  checklist,
  toggleComplete,
  openChecklist,
}: Props) {
  const hasChildren = checklist.children.length > 0;

  const handlePress = () => {
    if (hasChildren) {
      // Если это папка, открываем чеклист
      openChecklist(checklist.id);
    } else {
      // Если это не папка, ставим галочку
      toggleComplete(checklist.id);
    }
  };

  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!hasChildren && (
            <Text style={{ marginRight: 10 }}>
              <Checkbox checked={checklist.completed} />
            </Text>
          )}
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View>
              {hasChildren && (
                <ProgressBar
                  progress={calculateProgress(checklist, checklists)}
                  color={checklist.progressColor}
                />
              )}
            </View>
            <View>
              <Text
                style={{
                  fontWeight: hasChildren ? "bold" : "normal",
                }}
              >
                {checklist.title}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
