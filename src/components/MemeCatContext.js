import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemeCatContext = createContext();

export const MemeCatProvider = ({ children }) => {
    const [isMemeCatsEnabled, setIsMemeCatsEnabled] = useState(false);
    const [isHeaderEnabled, setIsHeaderEnabled] = useState(true);
    const [isNavHeaderEnabled, setIsNavHeaderEnabled] = useState(true);
    const [isBottomNavColorEnabled, setIsBottomNavColorEnabled] = useState(true);

    // Load settings states from AsyncStorage when the app starts
    useEffect(() => {
        const loadSettings = async () => {
            const savedMemeCat = await AsyncStorage.getItem("memeCatsEnabled");
            if (savedMemeCat !== null) {
                setIsMemeCatsEnabled(JSON.parse(savedMemeCat));
            }

            const savedHeader = await AsyncStorage.getItem("headerEnabled");
            if (savedHeader !== null) {
                
                setIsHeaderEnabled(JSON.parse(savedHeader));
            }
            const savedNavHeader = await AsyncStorage.getItem("navHeaderEnabled");
            if (savedNavHeader !== null) {
                setIsNavHeaderEnabled(JSON.parse(savedNavHeader));
            }
            const savedBottomNavColor = await AsyncStorage.getItem("bottomNavColorEnabled");
            if (savedBottomNavColor !== null) {
                setIsBottomNavColorEnabled(JSON.parse(savedBottomNavColor));
            }
        };

        loadSettings();
    }, []);


    // Toggle function
    const toggleMemeCat = async () => {
        const newValue = !isMemeCatsEnabled;
        setIsMemeCatsEnabled(newValue);
        await AsyncStorage.setItem("memeCatsEnabled", JSON.stringify(newValue));
    };

    const toggleHeader = async () => {
        const newValue = !isHeaderEnabled;
        setIsHeaderEnabled(newValue);
        await AsyncStorage.setItem("headerEnabled", JSON.stringify(newValue));
    };
    
    const toggleNavHeader = async () => {
        const newValue = !isNavHeaderEnabled;
        setIsNavHeaderEnabled(newValue);
        await AsyncStorage.setItem("navHeaderEnabled", JSON.stringify(newValue));
    };
    
    const toggleBottomNavColor = async () => {
        const newValue = !isBottomNavColorEnabled;
        setIsBottomNavColorEnabled(newValue);
        await AsyncStorage.setItem("bottomNavColorEnabled", JSON.stringify(newValue));
    };


    return (
        <MemeCatContext.Provider value={{ isMemeCatsEnabled, toggleMemeCat, isHeaderEnabled, toggleHeader, isNavHeaderEnabled, toggleNavHeader, isBottomNavColorEnabled, toggleBottomNavColor }}>
            {children}
        </MemeCatContext.Provider>
    );
};

// Custom hook for accessing context
export const useMemeCat = () => useContext(MemeCatContext);
