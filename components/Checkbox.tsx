import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CheckboxProps {
  checked: boolean;
  color: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, color }) => {
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
        color={color}
      />
    </View>
  );
};

export default Checkbox;
