import React, { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme } from "../Theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({ ...lightTheme, mode: "light" });

    const changeTheme = (mode) => {
        setTheme(mode === "dark" ? { ...darkTheme, mode: "dark" } : { ...lightTheme, mode: "light" });
    };

    const setPrimaryColor = (color) => {
        setTheme((prevTheme) => ({
            ...prevTheme,
            customButtonBg: color,
            primaryColor: color,
        }));
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme, setPrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
