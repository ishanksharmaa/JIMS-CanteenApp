import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../components/ThemeContext";

const ThemeToggle = ({ iconColor }) => {
    const { theme, changeTheme } = useTheme();

    return (
        <TouchableOpacity onPress={() => changeTheme(theme.mode === "dark" ? "light" : "dark")}>
            <Ionicons
                name={theme.mode === "dark" ? "moon" : "sunny"}
                size={28}
                color={iconColor}
            />
        </TouchableOpacity>
    );
};

export default ThemeToggle;
