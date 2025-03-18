import { useState } from "react";
import { ChecklistItem } from "../types";
import { ScrollView, View } from "react-native";
import Checklist from "../components/Checklist";

const initialChecklist: ChecklistItem[] = [
  {
    id: "1",
    title: "Главный чек-лист",
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
            title: "Подзадача 1-1",
            completed: false,
            progressColor: "green",
            children: [],
          },
          {
            id: "1-1-2",
            title: "Подзадача 1-2",
            completed: false,
            progressColor: "green",
            children: [],
          },
        ],
      },
      {
        id: "2-1",
        title: "Подзадача 2",
        completed: false,
        progressColor: "red",
        children: [],
      },
    ],
  },
];

export default function HomeScreen() {
  const [checklists, setChecklists] =
    useState<ChecklistItem[]>(initialChecklist);

  function toggleComplete(id: string) {
    function updateStatus(items: ChecklistItem[]): ChecklistItem[] {
      return items.map((item) => ({
        ...item,
        completed: item.id === id ? !item.completed : item.completed,
        children: updateStatus(item.children),
      }));
    }

    setChecklists(updateStatus(checklists));
  }

  return (
    <ScrollView>
      <View>
        {checklists.map((checklist) => (
          <Checklist
            key={checklist.id}
            checklist={checklist}
            toggleComplete={toggleComplete}
          />
        ))}
      </View>
    </ScrollView>
  );
}
