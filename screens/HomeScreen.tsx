import { useState } from "react";
import { ChecklistItem } from "../types";
import { ScrollView, Text, View } from "react-native";
import Checklist from "../components/Checklist";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProgressBar from "../components/ProgressBar";
import calculateProgress from "../utils/progress";

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
  "3": {
    id: "3",
    parent: null,
    children: ["3-1", "3-2"],
    title: "Чек-лист 3",
    completed: false,
    progressColor: "orange",
  },
  "3-1": {
    id: "3-1",
    parent: "3",
    children: ["3-1-1", "3-1-2"],
    title: "Задача 3-1",
    completed: false,
    progressColor: "cyan",
  },
  "3-1-1": {
    id: "3-1-1",
    parent: "3-1",
    children: [],
    title: "Деталь 3-1-1",
    completed: false,
    progressColor: "lime",
  },
  "3-1-2": {
    id: "3-1-2",
    parent: "3-1",
    children: [],
    title: "Деталь 3-1-2",
    completed: false,
    progressColor: "lime",
  },
  "3-2": {
    id: "3-2",
    parent: "3",
    children: [],
    title: "Задача 3-2",
    completed: false,
    progressColor: "magenta",
  },
  "4": {
    id: "4",
    parent: null,
    children: ["4-1"],
    title: "Чек-лист 4",
    completed: false,
    progressColor: "gold",
  },
  "4-1": {
    id: "4-1",
    parent: "4",
    children: [],
    title: "Этап 4-1",
    completed: false,
    progressColor: "silver",
  },
  "5": {
    id: "5",
    parent: null,
    children: ["5-1", "5-2", "5-3"],
    title: "Чек-лист 5",
    completed: false,
    progressColor: "teal",
  },
  "5-1": {
    id: "5-1",
    parent: "5",
    children: [],
    title: "Задача 5-1",
    completed: false,
    progressColor: "indigo",
  },
  "5-2": {
    id: "5-2",
    parent: "5",
    children: [],
    title: "Задача 5-2",
    completed: false,
    progressColor: "maroon",
  },
  "5-3": {
    id: "5-3",
    parent: "5",
    children: [],
    title: "Задача 5-3",
    completed: false,
    progressColor: "olive",
  },
  "6": {
    id: "6",
    parent: null,
    children: ["6-1"],
    title: "Чек-лист 6",
    completed: false,
    progressColor: "pink",
  },
  "6-1": {
    id: "6-1",
    parent: "6",
    children: ["6-1-1", "6-1-2"],
    title: "Основная задача 6-1",
    completed: false,
    progressColor: "brown",
  },
  "6-1-1": {
    id: "6-1-1",
    parent: "6-1",
    children: [],
    title: "Подзадача 6-1-1",
    completed: false,
    progressColor: "navy",
  },
  "6-1-2": {
    id: "6-1-2",
    parent: "6-1",
    children: [],
    title: "Подзадача 6-1-2",
    completed: false,
    progressColor: "violet",
  },
  "7": {
    id: "7",
    parent: null,
    children: [],
    title: "Чек-лист 7",
    completed: false,
    progressColor: "turquoise",
  },
  "8": {
    id: "8",
    parent: null,
    children: ["8-1"],
    title: "Чек-лист 8",
    completed: false,
    progressColor: "darkblue",
  },
  "8-1": {
    id: "8-1",
    parent: "8",
    children: [],
    title: "Подзадача 8-1",
    completed: false,
    progressColor: "darkred",
  },
  "9": {
    id: "9",
    parent: null,
    children: [],
    title: "Чек-лист 9",
    completed: false,
    progressColor: "darkgreen",
  },
  "10": {
    id: "10",
    parent: null,
    children: ["10-1", "10-2"],
    title: "Чек-лист 10",
    completed: false,
    progressColor: "darkorange",
  },
  "10-1": {
    id: "10-1",
    parent: "10",
    children: [],
    title: "Этап 10-1",
    completed: false,
    progressColor: "darkcyan",
  },
  "10-2": {
    id: "10-2",
    parent: "10",
    children: ["10-2-1"],
    title: "Этап 10-2",
    completed: false,
    progressColor: "darkmagenta",
  },
  "10-2-1": {
    id: "10-2-1",
    parent: "10-2",
    children: [],
    title: "Подэтап 10-2-1",
    completed: false,
    progressColor: "darkgray",
  },
  "11": {
    id: "11",
    parent: null,
    children: ["11-1"],
    title: "Чек-лист 11",
    completed: false,
    progressColor: "blue",
  },
  "11-1": {
    id: "11-1",
    parent: "11",
    children: ["11-1-1"],
    title: "Подзадача 11",
    completed: false,
    progressColor: "green",
  },
  "11-1-1": {
    id: "11-1-1",
    parent: "11-1",
    children: ["11-1-1-1"],
    title: "Глубокая подзадача 11",
    completed: false,
    progressColor: "red",
  },
  "11-1-1-1": {
    id: "11-1-1-1",
    parent: "11-1-1",
    children: ["11-1-1-1-1"],
    title: "Глубокая подзадача 11-1",
    completed: false,
    progressColor: "yellow",
  },
  "11-1-1-1-1": {
    id: "11-1-1-1-1",
    parent: "11-1-1-1",
    children: ["11-1-1-1-1-1"],
    title: "Глубокая подзадача 11-1-1",
    completed: false,
    progressColor: "orange",
  },
  "11-1-1-1-1-1": {
    id: "11-1-1-1-1-1",
    parent: "11-1-1-1-1",
    children: [],
    title: "Глубокая подзадача 11-1-1-1",
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
            <TouchableOpacity
              key={item.id}
              onPress={() => openChecklist(item.id)}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: index === path.length - 1 ? "bold" : "normal",
                }}
              >
                {index > 0 && " > "}
                {item.title}
              </Text>
            </TouchableOpacity>
          ));
        })()}
      </View>

      {/* progress bar */}
      {currentId ? (
        <ProgressBar
          progress={calculateProgress(checklists[currentId], checklists)}
          color={checklists[currentId].progressColor}
        />
      ) : (
        ""
      )}

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
