import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeContext";
// import { useUser } from "../components/UserContext";

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);
  // const { userEmail } = useUser();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={theme.logo} style={styles.logo} />
      <Text style={{ fontSize: 16, fontWeight: 500, position: 'absolute', bottom: 25, textAlign: 'center' }}>Made with love! 😍</Text>
    </View>
  );
};

const dynamicTheme = (theme) => ({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  logo: { width: 300, height: 300, resizeMode: "cover" }  // ✅ Adjust size
});

export default SplashScreen;
