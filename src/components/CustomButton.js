import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import { useTheme } from "./ThemeContext";

const CustomButton = ({title, onPress}) => {
    const {theme} = useTheme();
    const styles = dynamicTheme(theme);

    return(
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const dynamicTheme = (theme) => ({
  buttonStyle: { backgroundColor: theme.customButtonBg, borderRadius: 50, paddingVertical: 16, width: '80%', alignItems:'center' },
  buttonText: { color: theme.customButtonText, fontSize: 18 }
});

export default CustomButton;