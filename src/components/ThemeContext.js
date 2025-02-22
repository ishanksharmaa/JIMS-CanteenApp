import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../Theme"; // ✅ Import Correctly

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();  // ✅ Get system dark mode setting
    const [mode, setMode] = useState(systemTheme || "light");

    const toggleTheme = () => {
        setMode(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    const theme = mode === "dark" ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
