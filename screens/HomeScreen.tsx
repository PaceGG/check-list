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
  const [currentChecklist, setCurrentChecklist] =
    useState<ChecklistItem | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<ChecklistItem[]>([]);

  function openChecklist(checklist: ChecklistItem) {
    if (breadcrumb.length === 0) {
      setBreadcrumb([checklist]);
    } else {
      setBreadcrumb([...breadcrumb, checklist]);
    }
    setCurrentChecklist(checklist);
  }

  function goBack() {
    if (breadcrumb.length > 1) {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      setCurrentChecklist(newBreadcrumb[breadcrumb.length - 1]);
    } else {
      setBreadcrumb([]);
      setCurrentChecklist(null);
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
        {currentChecklist && (
          <TouchableOpacity onPress={goBack} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 16 }}>🔙 Назад</Text>
          </TouchableOpacity>
        )}
        {breadcrumb.map((item, index) => (
          <Text
            key={item.id}
            style={{
              fontSize: 16,
              fontWeight: index === breadcrumb.length - 1 ? "bold" : "normal",
            }}
          >
            {index > 0 && " > "}
            {item.title}
          </Text>
        ))}
      </View>

      {/* checklists */}
      <View style={{ padding: 10 }}>
        {(currentChecklist
          ? currentChecklist.children.map((childId) => checklists[childId])
          : Object.values(checklists).filter((item) => item.parent === null)
        ).map((checklist) =>
          checklist ? (
            <Checklist
              key={checklist.id}
              checklists={checklists}
              checklist={checklist}
              toggleComplete={toggleComplete}
              openChecklist={openChecklist}
            />
          ) : null
        )}
      </View>
    </ScrollView>
  );
}
