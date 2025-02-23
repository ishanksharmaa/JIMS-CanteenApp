import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeContext";

const HandleBar = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return <View style={styles.handleBar} />;
};

const dynamicTheme = (theme) => ({
    handleBar: {
        width: 50,
        height: 5,
        backgroundColor: theme.handleBarColor,
        borderRadius: 10,
        alignSelf: "center",
        marginVertical: 14, // Adjust spacing
    },
});

export default HandleBar;
