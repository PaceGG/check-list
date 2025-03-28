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
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import Checklist from "../components/Checklist";
import { Ionicons } from "@expo/vector-icons";
import { initialChecklists } from "../data";
import ProgressBar from "../components/ProgressBar";
import calculateProgress from "../utils/progress";
import ChecklistCreator from "../components/ChecklistCreator";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Импортируем AsyncStorage

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

  // Загружаем чеклисты при монтировании компонента
  useEffect(() => {
    const loadChecklists = async () => {
      try {
        const storedChecklists = await AsyncStorage.getItem("checklists");
        if (storedChecklists) {
          setChecklists(JSON.parse(storedChecklists)); // Загружаем данные из хранилища
        }
      } catch (error) {
        console.error("Ошибка при загрузке чеклистов", error);
      }
    };
    loadChecklists();
  }, []);

  // Сохраняем чеклисты в AsyncStorage
  useEffect(() => {
    const saveChecklists = async () => {
      try {
        await AsyncStorage.setItem("checklists", JSON.stringify(checklists)); // Сохраняем данные в хранилище
      } catch (error) {
        console.error("Ошибка при сохранении чеклистов", error);
      }
    };
    saveChecklists();
  }, [checklists]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        setNavbarHeight(height);
      });
    }
    cancelChecklistCreation();
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
  }, [creatingChecklist]);

  function openChecklist(id: string) {
    setCurrentId(id);
  }

  function goBack() {
    if (currentId) {
      setCurrentId(checklists[currentId].parent);
    } else {
      setCurrentId(null); // если нет текущего чек-листа, сбрасываем
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

  const updateChecklist = (id: string, newTitle: string, newColor: string) => {
    setChecklists((prev) => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle, progressColor: newColor },
    }));
  };

  const deleteChecklist = (id: string) => {
    setChecklists((prev) => {
      const newChecklists = { ...prev };
      const toDelete = new Set([id]);

      // Рекурсивно находим всех потомков
      const collectChildren = (itemId: string) => {
        newChecklists[itemId]?.children.forEach((childId) => {
          toDelete.add(childId);
          collectChildren(childId);
        });
      };

      collectChildren(id);

      // Удаляем все найденные элементы
      toDelete.forEach((itemId) => {
        delete newChecklists[itemId];
      });

      // Убираем удалённый элемент из `children` родителя
      const parent = prev[id]?.parent;
      if (parent && newChecklists[parent]) {
        newChecklists[parent].children = newChecklists[parent].children.filter(
          (childId) => childId !== id
        );
      }

      return newChecklists;
    });
  };

  const createFolder = (id: string) => {
    if (checklists[id].children.length === 0) {
      openChecklist(id);
      createChecklist();
    }
  };

  return (
    <View style={styles.container}>
      <Header goHome={goHome} />

      <TouchableOpacity onPress={createChecklist} style={styles.createButton}>
        <Ionicons name="add-circle-outline" size={70} color={"white"} />
      </TouchableOpacity>

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
      <ScrollView ref={scrollRef} style={{ marginTop: navbarHeight + 45 + 35 }}>
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
                  updateChecklist={updateChecklist}
                  deleteChecklist={deleteChecklist}
                  createFolder={createFolder}
                />
              )
          )}

          {creatingChecklist && (
            <ChecklistCreator
              onCreate={(title, color) => {
                const newId = Date.now().toString();
                setChecklists((prev) => ({
                  ...prev,
                  [newId]: {
                    id: newId,
                    title,
                    parent: currentId,
                    children: [],
                    completed: false,
                    progressColor: color,
                  },
                }));

                if (currentId) {
                  setChecklists((prev) => ({
                    ...prev,
                    [currentId]: {
                      ...prev[currentId],
                      children: [...prev[currentId].children, newId],
                    },
                  }));
                }
                setCreatingChecklist(false);
              }}
              onCancel={() => setCreatingChecklist(false)}
            />
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
  createButton: {
    position: "absolute",
    right: 15,
    bottom: 15 + 75,
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 5,
    zIndex: 900,
  },
  navbar: {
    position: "absolute",
    minHeight: 55,
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 5,
    paddingTop: 15,
    marginTop: 30,
    elevation: 4,
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
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 5,
  },
  cancelButton: {
    marginLeft: 10,
  },

  colorPicker: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: 10,
    width: 70,
    shadowColor: "#000", // Добавляем тень
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // для Android
    transform: [{ scale: 0.95 }], // Немного уменьшаем окно при появлении
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    position: "absolute",
    left: 15,
    bottom: 70,
    width: 40,
    backgroundColor: "white",
    borderRadius: 5,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // для Android
  },
  colorOption: {
    width: 30,
    height: 30,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    marginHorizontal: 5,
  },
});
