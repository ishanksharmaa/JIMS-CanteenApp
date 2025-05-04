import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../Theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        ...lightTheme,
        mode: "light",
        primaryColor: "#007AFF",
        customButtonBg: "#111",
        customButtonText: "#eee",
    });

    // Load Theme from AsyncStorage
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem("theme");
                if (savedTheme) {
                    setTheme(JSON.parse(savedTheme));
                }
            } catch (error) {
                console.log("Error loading theme:", error);
            }
        };
        loadTheme();
    }, []);

    // Change Theme Mode
    const changeTheme = async (mode) => {
        setTheme((prevTheme) => {
            const newTheme = mode === "dark" ? darkTheme : lightTheme;
            const defaultPrimaryColor = "#007AFF";
            const isDefaultColor = prevTheme.primaryColor === defaultPrimaryColor;

            const updatedTheme = {
                ...newTheme,
                mode,
                primaryColor: prevTheme.primaryColor || defaultPrimaryColor,
                customButtonBg: isDefaultColor ? (mode === "dark" ? "#ddd" : "#111") : prevTheme.customButtonBg,
                customButtonText: isDefaultColor
                    ? (mode === "dark" ? "#999" : "#eee")
                    : (prevTheme.customButtonBg === "#FDDA0D" ? "#333" : "#eee"),
                // : prevTheme.customButtonBg,
            };

            AsyncStorage.setItem("theme", JSON.stringify(updatedTheme)); // Save theme
            return updatedTheme;
        });
    };

    // Change Primary Color
    const setPrimaryColor = async (color) => {
        setTheme((prevTheme) => {
            const updatedTheme = {
                ...prevTheme,
                customButtonBg: color,
                primaryColor: color === prevTheme.text ? "#007AFF" : color,
                customButtonText: color === prevTheme.text
                    ? (prevTheme.mode === "dark" ? "#111" : "#eee")
                    : (color === "#FDDA0D" ? "#999" : "#eee"),
            };

            AsyncStorage.setItem("theme", JSON.stringify(updatedTheme)); // Save color
            return updatedTheme;
        });
    };


    return (
        <ThemeContext.Provider value={{ theme, changeTheme, setPrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
