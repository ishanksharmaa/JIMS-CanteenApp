import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeContext";

const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("GetStarted");  // ✅ 2 sec ke baad Login Screen pe navigate karega
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/app_logo2.png")} style={styles.logo} />
      <Text style={{fontSize: 16, fontWeight: 500, position:'absolute', bottom: 25, textAlign:'center' }}>Made with love! 😍</Text>
    </View>
  );
};

const dynamicTheme = (theme) => ({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  logo: { width: 300, height: 300, resizeMode: "cover" }  // ✅ Adjust size
});

export default SplashScreen;
