import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../components/ThemeContext";

const MenuScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Browse Menu...</Text>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        backgroundColor: theme.background,
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
        color: theme.text,
    },
});

export default MenuScreen;
