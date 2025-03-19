import { useState } from "react";
import { ChecklistItem } from "../types";
import { ScrollView, Text, View } from "react-native";
import Checklist from "../components/Checklist";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProgressBar from "../components/ProgressBar";
import calculateProgress from "../utils/progress";
import { Ionicons } from "@expo/vector-icons";
import { initialChecklists } from "../data";

export default function HomeScreen() {
  const [checklists, setChecklists] =
    useState<Record<string, ChecklistItem>>(initialChecklists);
  const [currentId, setCurrentId] = useState<string | null>(null);

  function openChecklist(id: string) {
    setCurrentId(id);
  }

  function goBack() {
    if (currentId) {
      setCurrentId(checklists[currentId].parent);
    }
  }

  function toggleComplete(id: string) {
    setChecklists((prevChecklists) => {
      const updatedChecklists = { ...prevChecklists };

      function updateStatus(itemId: string) {
        if (!updatedChecklists[itemId]) return;

        updatedChecklists[itemId] = {
          ...updatedChecklists[itemId],
          completed: !updatedChecklists[itemId].completed,
        };
      }

      updateStatus(id);
      return updatedChecklists;
    });
  }

  return (
    <ScrollView>
      {/* navbar */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#ddd",
        }}
      >
        {currentId && (
          <View>
            <TouchableOpacity onPress={goBack} style={{ marginRight: 10 }}>
              <Ionicons name={"arrow-back-circle-outline"} size={30} />
            </TouchableOpacity>
          </View>
        )}

        {(() => {
          // Восстанавливаем путь от текущего элемента до корня
          let path: ChecklistItem[] = [];
          let current = currentId ? checklists[currentId] : null;

          while (current) {
            path.unshift(current);
            current = current.parent ? checklists[current.parent] : null;
          }

          return path.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity onPress={() => openChecklist(item.id)}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View>
                    {currentId ? (
                      <ProgressBar
                        progress={calculateProgress(item, checklists)}
                        color={item.progressColor}
                      />
                    ) : (
                      ""
                    )}
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight:
                          index === path.length - 1 ? "bold" : "normal",
                        lineHeight: 35,
                      }}
                    >
                      {index > 0 && " > "}
                      {item.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ));
        })()}
      </View>

      {/* checklists */}
      <View style={{ padding: 10 }}>
        {(currentId
          ? checklists[currentId]?.children.map(
              (childId) => checklists[childId]
            )
          : Object.values(checklists).filter((item) => item.parent === null)
        ).map(
          (checklist) =>
            checklist && (
              <Checklist
                key={checklist.id}
                checklists={checklists}
                checklist={checklist}
                toggleComplete={toggleComplete}
                openChecklist={openChecklist}
              />
            )
        )}
      </View>
    </ScrollView>
  );
}
