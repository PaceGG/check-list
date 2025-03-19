import { useState } from "react";
import { ChecklistItem } from "../types";
import { ScrollView, Text, View } from "react-native";
import Checklist from "../components/Checklist";
import { TouchableOpacity } from "react-native-gesture-handler";

const initialChecklists: Record<string, ChecklistItem> = {
  "1": {
    id: "1",
    parent: null,
    children: ["1-1"],
    title: "Чек-лист 1",
    completed: false,
    progressColor: "blue",
  },
  "1-1": {
    id: "1-1",
    parent: "1",
    children: ["1-1-1"],
    title: "Подзадача 1",
    completed: false,
    progressColor: "green",
  },
  "1-1-1": {
    id: "1-1-1",
    parent: "1-1",
    children: [],
    title: "Глубокая подзадача",
    completed: false,
    progressColor: "red",
  },
  "2": {
    id: "2",
    parent: null,
    children: [],
    title: "Чек-лист 2",
    completed: false,
    progressColor: "purple",
  },
};

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
          alignItems: "center",
          padding: 10,
          backgroundColor: "#ddd",
        }}
      >
        {currentId && (
          <TouchableOpacity onPress={goBack} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 16 }}>🔙 Назад</Text>
          </TouchableOpacity>
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
            <Text
              key={item.id}
              style={{
                fontSize: 16,
                fontWeight: index === path.length - 1 ? "bold" : "normal",
              }}
            >
              {index > 0 && " > "}
              {item.title}
            </Text>
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
