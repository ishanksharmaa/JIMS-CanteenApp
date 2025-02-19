import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Icon import

const FavoriteScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="heart" size={80} color="red" />
      <Text style={styles.text}>Favorites</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
});

export default FavoriteScreen;
