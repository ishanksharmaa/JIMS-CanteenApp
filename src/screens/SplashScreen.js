import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const SplashScreen = ({ navigation }) => {
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  logo: { width: 300, height: 300, resizeMode: "cover" }  // ✅ Adjust size
});

export default SplashScreen;
