import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemeCatContext = createContext();

export const MemeCatProvider = ({ children }) => {
    const [isMemeCatsEnabled, setIsMemeCatsEnabled] = useState(false);
    const [isHeaderEnabled, setIsHeaderEnabled] = useState(true);

    // Load settings states from AsyncStorage when app starts
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


    return (
        <MemeCatContext.Provider value={{ isMemeCatsEnabled, toggleMemeCat, isHeaderEnabled, toggleHeader }}>
            {children}
        </MemeCatContext.Provider>
    );
};

// Custom hook for accessing context
export const useMemeCat = () => useContext(MemeCatContext);
