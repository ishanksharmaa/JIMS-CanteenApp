import React from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, Button } from "react-native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../components/ThemeContext";

const TextSection = () => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);
  
  return (
    <View style={styles.textContainer}>
        <Text style={{ color: theme.text, fontSize: 45, fontWeight: "bold", lineHeight: 45 }}>Browse Menu</Text>
        <Text style={{ color: "grey", fontSize: 42, fontWeight: "bold", lineHeight: 45 }}>Place Order</Text>
        <Text style={{ color: "grey", fontSize: 40, fontWeight: "bold", lineHeight: 45 }}>Enjoy food!</Text>
      </View>
  );
};

const GetStartedScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>
        JIMS {"\n"}  
        <Text style={{color:'orangered'}}>Canteen App</Text>
      </Text> */}
      <Image source={theme.logo} style={styles.logo} />

    <ImageBackground source={require("../../assets/sandwich.png")} style={styles.background} resizeMode="contain" >
      <TextSection />

      <View style={styles.buttonPosition}>
        <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title="Get Started ->" onPress={() => navigation.navigate("Login")} />
      </View>
    </ImageBackground>
  </View>
  );
};

const dynamicTheme = (theme) => ({
  logo: { 
    width: 220, // ✅ Adjust size accordingly
    height: 220,
    resizeMode: "contain",
    position: "absolute",
    top: 30, 
    alignSelf: "center",
  },
  background: { flex: 1, width: "100%", height: "100%", justifyContent: "center" },
  container: {backgroundColor: theme.getStartedScreenBg, flex:1 },
  title: {color:'#222', fontSize:35, fontWeight:'bold', textAlign:'center', position:'absolute', top:35, alignSelf:'center'  },
  textContainer: { flex: 1, position:'fixed', left:'6%', top:'60%' },
  buttonPosition: { position:'fixed', bottom: 22 },
});

export default GetStartedScreen;
