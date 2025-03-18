import { useState } from "react";
import { ChecklistItem } from "../types";
import { ScrollView, Text, View } from "react-native";
import Checklist from "../components/Checklist";
import { TouchableOpacity } from "react-native-gesture-handler";

const initialChecklists: ChecklistItem[] = [
  {
    id: "1",
    title: "Чек-лист 1",
    completed: false,
    progressColor: "blue",
    children: [
      {
        id: "1-1",
        title: "Подзадача 1",
        completed: false,
        progressColor: "green",
        children: [
          {
            id: "1-1-1",
            title: "Глубокая подзадача",
            completed: true,
            progressColor: "red",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Чек-лист 2",
    completed: false,
    progressColor: "purple",
    children: [
      {
        id: "2-1",
        title: "Задача чеклиста 2",
        completed: false,
        progressColor: "red",
        children: [],
      },
    ],
  },
];

export default function HomeScreen() {
  const [checklists, setChecklists] =
    useState<ChecklistItem[]>(initialChecklists);
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
    function updateStatus(items: ChecklistItem[]): ChecklistItem[] {
      return items.map((item) => ({
        ...item,
        completed: item.id === id ? !item.completed : item.completed,
        children: updateStatus(item.children),
      }));
    }

    if (currentChecklist) {
      setCurrentChecklist({
        ...currentChecklist,
        children: updateStatus(currentChecklist.children),
      });
    } else {
      setChecklists(updateStatus(checklists));
    }
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
        {currentChecklist
          ? currentChecklist.children.map((checklist) => (
              <Checklist
                key={checklist.id}
                checklist={checklist}
                toggleComplete={toggleComplete}
                openChecklist={openChecklist}
              />
            ))
          : checklists.map((checklist) => (
              <Checklist
                key={checklist.id}
                checklist={checklist}
                toggleComplete={toggleComplete}
                openChecklist={openChecklist}
              />
            ))}
      </View>
    </ScrollView>
  );
}
