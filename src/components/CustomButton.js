import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext";
import { transform } from "typescript";

const CustomButton = ({ btnColor, textColor, title, onPress, size = 1, radius = 50, opacity = 1 }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme, btnColor, textColor, size, radius, opacity);

    return (
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.buttonStyle} onPress={onPress} activeOpacity={0.8}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const dynamicTheme = (theme, btnColor, textColor, size, radius, opacity) => ({
    buttonStyle: { backgroundColor: btnColor, borderRadius: radius, paddingVertical: 16, width: '80%', alignItems: 'center', transform: [{ scale: size }], opacity: opacity },
    buttonText: { color: textColor, fontSize: 18 }
});

export default CustomButton;