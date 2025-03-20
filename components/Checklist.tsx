import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import calculateProgress from "../utils/progress";
import { ChecklistItem } from "../types";
import ProgressBar from "./ProgressBar";
import Checkbox from "./Checkbox";
import { Entypo } from "@expo/vector-icons";
import ChecklistEditor from "./ChecklistEditor";

type Props = {
  checklists: Record<string, ChecklistItem>;
  checklist: ChecklistItem;
  toggleComplete: (id: string) => void;
  openChecklist: (id: string) => void;
  updateChecklist: (id: string, title: string, color: string) => void;
  deleteChecklist: (id: string) => void;
  createFolder: (id: string) => void;
};

export default function Checklist({
  checklists,
  checklist,
  toggleComplete,
  openChecklist,
  updateChecklist,
  deleteChecklist,
  createFolder,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);

  const hasChildren = checklist.children.length > 0;

  const handlePress = () => {
    if (hasChildren) {
      openChecklist(checklist.id);
    } else {
      toggleComplete(checklist.id);
    }
  };

  const handleSettingsPress = () => {
    setShowMenu((prevState) => !prevState);
  };

  const handleEdit = () => {
    setShowMenu(false);
    setEditing(true);
  };

  const handleSave = (newTitle: string, newColor: string) => {
    updateChecklist(checklist.id, newTitle, newColor);
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      {editing ? (
        <ChecklistEditor
          checklistId={checklist.id}
          initialTitle={checklist.title}
          initialColor={checklist.progressColor}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <TouchableOpacity onPress={handlePress} style={styles.checklistRow}>
          <View style={styles.leftSection}>
            {!hasChildren && (
              <Checkbox
                checked={checklist.completed}
                color={checklist.progressColor}
              />
            )}
            <View style={styles.titleContainer}>
              {hasChildren && (
                <ProgressBar
                  progress={calculateProgress(checklist, checklists)}
                  color={checklist.progressColor}
                />
              )}
            </View>
            <Text style={hasChildren ? styles.boldText : styles.normalText}>
              {checklist.title}
            </Text>
          </View>

          {/* Кнопка настроек */}
          <TouchableOpacity
            onPress={handleSettingsPress}
            style={styles.settingsButton}
          >
            <Entypo name="dots-three-vertical" size={25} color={"#333"} />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Меню настроек */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
            <Text>Редактировать</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteChecklist(checklist.id)}
            style={styles.menuItem}
          >
            <Text>Удалить</Text>
          </TouchableOpacity>
          {!hasChildren && (
            <TouchableOpacity
              onPress={() => createFolder(checklist.id)}
              style={styles.menuItem}
            >
              <Text>Папка</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  boldText: {
    fontWeight: "bold",
  },
  normalText: {
    fontWeight: "normal",
    marginLeft: 10,
  },
  settingsButton: {
    paddingLeft: 30,
    paddingRight: 10,
  },
  menu: {
    position: "absolute",
    right: 45,
    top: 0,
    width: 180,
    zIndex: 300,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "white",
    marginVertical: 2,
  },
});
