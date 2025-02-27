import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import { useTheme } from "./ThemeContext";

const CustomButton = ({btnColor, textColor, title, onPress}) => {
    const {theme} = useTheme();
    const styles = dynamicTheme(theme, btnColor, textColor);

    return(
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.buttonStyle} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const dynamicTheme = (theme, btnColor, textColor) => ({
  buttonStyle: { backgroundColor: btnColor, borderRadius: 50, paddingVertical: 16, width: '80%', alignItems:'center' },
  buttonText: { color: textColor, fontSize: 18 }
});

export default CustomButton;