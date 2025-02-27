import React, { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme } from "../Theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({ 
        ...lightTheme, 
        mode: "light", 
        primaryColor: "#007AFF", 
        customButtonBg: "#111" 
    });

    const changeTheme = (mode) => {
        setTheme((prevTheme) => {
            const newTheme = mode === "dark" ? darkTheme : lightTheme;
            const defaultPrimaryColor = "#007AFF"
            return {
                ...newTheme,
                mode: mode,
                primaryColor: prevTheme.primaryColor || "#007AFF", // Default color
                customButtonBg: prevTheme.primaryColor === defaultPrimaryColor ? (mode === "dark" ? "#ccc" : "#111") : prevTheme.customButtonBg, // Default button bg
                customButtonText: prevTheme.primaryColor === defaultPrimaryColor ? (mode === "dark" ? "#111" : "#eee") : "#eee",
            };
        });
    };

    const setPrimaryColor = (color) => {
        const defaultColor = theme.text
        setTheme((prevTheme) => ({
            ...prevTheme,
            customButtonBg: color,
            primaryColor: color === defaultColor ? "#007AFF" : color,
            customButtonText: color === defaultColor ? (prevTheme.mode === "dark" ? "#111" : "#eee") : "#eee",
        }));
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme, setPrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
