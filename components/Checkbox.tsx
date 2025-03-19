import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CheckboxProps {
  checked: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
      }}
    >
      <MaterialIcons
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={25}
        color={checked ? "#2e8fff" : "gray"}
      />
    </View>
  );
};

export default Checkbox;
