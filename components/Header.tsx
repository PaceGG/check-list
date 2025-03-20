import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  goHome: () => void;
};

export default function Header({ goHome }: Props) {
  return (
    <View style={styles.panel}>
      <TouchableOpacity onPress={goHome} style={styles.homeButton}>
        <Ionicons name="home-outline" size={30} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    paddingTop: 40,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  homeButton: {
    backgroundColor: "#007aff",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
});
