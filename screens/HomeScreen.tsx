import { useEffect, useRef, useState } from "react";
import { ChecklistItem } from "../types";
import { BackHandler, ScrollView, Text, View, StyleSheet } from "react-native";
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
  const containerRef = useRef<View>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  function openChecklist(id: string) {
    setCurrentId(id);
  }

  useEffect(() => {
    const backAction = () => {
      if (currentId) {
        goBack();
        return true; // предотвращает стандартное поведение (выход из приложения)
      }
      return false; // позволяет системе обрабатывать событие по умолчанию
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    // Очистка при размонтировании компонента
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [currentId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        setNavbarHeight(height);
        console.log(height);
      });
    }
  }, [currentId]);

  function goBack() {
    if (currentId) {
      setCurrentId(checklists[currentId].parent);
    }
  }

  function goHome() {
    setCurrentId(null); // Возвращаемся в начало, сбрасывая currentId
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
    <View style={styles.container}>
      {/* panel */}
      <View style={styles.panel}>
        <TouchableOpacity onPress={goHome} style={styles.homeButton}>
          <Ionicons name="home-outline" size={30} color={"white"} />
        </TouchableOpacity>
      </View>

      {/* navbar */}
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

      {/* checklists */}
      <ScrollView style={{ marginTop: navbarHeight + 45 }}>
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
});
