import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = [
  "#5DB6E5",
  "#E03232",
  "#F0C850",
  "#FF8555",
  "#72CC72",
  "#8466E2",
  "#CB3694",
];

interface ChecklistCreatorProps {
  onCreate: (title: string, color: string) => void;
  onCancel: () => void;
}

export default function ChecklistCreator({
  onCreate,
  onCancel,
}: ChecklistCreatorProps) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  function confirmChecklist() {
    if (!title.trim()) return;
    onCreate(title, selectedColor);
    setTitle("");
  }

  function handleOpenColorPicker() {
    Keyboard.dismiss();
    setColorPickerVisible(true);
  }

  return (
    <View style={styles.newChecklist}>
      {/* Выбор цвета */}
      <TouchableOpacity
        style={[styles.colorBox, { backgroundColor: selectedColor }]}
        onPress={handleOpenColorPicker}
      />

      {/* Поле ввода названия */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Введите название"
        autoFocus
        onSubmitEditing={confirmChecklist}
      />

      {/* Кнопки подтверждения и отмены */}
      <TouchableOpacity onPress={confirmChecklist}>
        <Ionicons name="checkmark-circle-outline" size={30} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Ionicons name="close-circle-outline" size={30} color="red" />
      </TouchableOpacity>

      {/* Модальное окно выбора цвета */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={colorPickerVisible}
        onRequestClose={() => setColorPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setColorPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={colors}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedColor(item);
                      setColorPickerVisible(false);
                    }}
                    style={[styles.colorOption, { backgroundColor: item }]}
                  />
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    elevation: 5,
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
