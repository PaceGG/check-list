import { useEffect, useRef, useState } from "react";
import { ChecklistItem } from "../types";
import {
  BackHandler,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
} from "react-native";
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
  const [creatingChecklist, setCreatingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const containerRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        setNavbarHeight(height);
      });
    }
  }, [currentId]);

  useEffect(() => {
    const backAction = () => {
      if (creatingChecklist) {
        cancelChecklistCreation();
        return true; // предотвращаем стандартное поведение кнопки "Назад"
      } else {
        goBack(); // вызываем goBack, если не создается чек-лист
        return true; // предотвращаем стандартное поведение кнопки "Назад"
      }
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    // Очистка при размонтировании компонента
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [creatingChecklist, currentId]);

  // Обработчик события потери фокуса поля ввода
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      cancelChecklistCreation
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  function openChecklist(id: string) {
    setCurrentId(id);
  }

  function goBack() {
    if (currentId) {
      setCurrentId(checklists[currentId].parent);
    }
  }

  function goHome() {
    setCurrentId(null);
  }

  function toggleComplete(id: string) {
    setChecklists((prevChecklists) => {
      const updatedChecklists = { ...prevChecklists };
      updatedChecklists[id] = {
        ...updatedChecklists[id],
        completed: !updatedChecklists[id].completed,
      };
      return updatedChecklists;
    });
  }

  function createChecklist() {
    setCreatingChecklist(true);
    setNewChecklistTitle("");
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
      inputRef.current?.focus();
    }, 100);
  }

  function cancelChecklistCreation() {
    setCreatingChecklist(false);
    setNewChecklistTitle("");
  }

  function confirmChecklist() {
    if (!newChecklistTitle.trim()) return;
    const newId = Date.now().toString();
    setChecklists((prevChecklists) => ({
      ...prevChecklists,
      [newId]: {
        id: newId,
        title: newChecklistTitle,
        parent: currentId,
        children: [],
        completed: false,
        progressColor: "blue",
      },
    }));

    if (currentId) {
      setChecklists((prevChecklists) => ({
        ...prevChecklists,
        [currentId]: {
          ...prevChecklists[currentId],
          children: [...prevChecklists[currentId].children, newId],
        },
      }));
    }

    setCreatingChecklist(false);
  }

  return (
    <View style={styles.container}>
      {/* Панель */}
      <View style={styles.panel}>
        <TouchableOpacity onPress={goHome} style={styles.homeButton}>
          <Ionicons name="home-outline" size={30} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={createChecklist} style={styles.createButton}>
          <Ionicons name="add-circle-outline" size={30} color={"white"} />
        </TouchableOpacity>
      </View>

      {/* Навбар */}
      <View ref={containerRef} style={styles.navbar}>
        {currentId && (
          <TouchableOpacity onPress={goBack} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back-circle-outline" size={30} />
          </TouchableOpacity>
        )}

        {(() => {
          let path: ChecklistItem[] = [];
          let current = currentId ? checklists[currentId] : null;

          while (current) {
            path.unshift(current);
            current = current.parent ? checklists[current.parent] : null;
          }

          return path.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity onPress={() => openChecklist(item.id)}>
                <View style={styles.navItem}>
                  {currentId ? (
                    <ProgressBar
                      progress={calculateProgress(item, checklists)}
                      color={item.progressColor}
                    />
                  ) : null}
                  <Text
                    style={{
                      fontWeight: index === path.length - 1 ? "bold" : "normal",
                      lineHeight: 35,
                    }}
                  >
                    {item.title}
                    {index != path.length - 1 && " > "}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ));
        })()}
      </View>

      {/* Чеклисты */}
      <ScrollView ref={scrollRef} style={{ marginTop: navbarHeight + 45 }}>
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

          {creatingChecklist && (
            <View style={styles.newChecklist}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={newChecklistTitle}
                onChangeText={setNewChecklistTitle}
                placeholder="Введите название"
                autoFocus
                onSubmitEditing={confirmChecklist}
              />
              <TouchableOpacity onPress={confirmChecklist}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={30}
                  color="green"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelChecklistCreation}
                style={styles.cancelButton}
              >
                <Ionicons name="close-circle-outline" size={30} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ddd",
    padding: 10,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#007aff",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 5,
  },
  navbar: {
    position: "absolute",
    minHeight: 55,
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#ccc",
    zIndex: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 5,
    paddingTop: 15,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  newChecklist: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 5,
    marginRight: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
});
