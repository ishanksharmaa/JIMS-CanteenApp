import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Icon import

const FavoriteScreen = () => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);

  return (
    <View style={styles.container}>
      <Ionicons name="heart" size={80} color="red" />
      <Text style={styles.text}>Favorites</Text>
    </View>
  );
};

const dynamicTheme = (theme) => ({
  container: {
    backgroundColor: theme.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: theme.text,
  },
});

export default FavoriteScreen;
