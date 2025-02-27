import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemeCatContext = createContext();

export const MemeCatProvider = ({ children }) => {
    const [isMemeCatsEnabled, setIsMemeCatsEnabled] = useState(false);

    // Load MemeCats state from AsyncStorage when app starts
    useEffect(() => {
        const loadMemeCatState = async () => {
            const savedState = await AsyncStorage.getItem("memeCatsEnabled");
            if (savedState !== null) {
                setIsMemeCatsEnabled(JSON.parse(savedState));
            }
        };
        loadMemeCatState();
    }, []);

    // Toggle function
    const toggleMemeCat = async () => {
        const newValue = !isMemeCatsEnabled;
        setIsMemeCatsEnabled(newValue);
        await AsyncStorage.setItem("memeCatsEnabled", JSON.stringify(newValue));
    };

    return (
        <MemeCatContext.Provider value={{ isMemeCatsEnabled, toggleMemeCat }}>
            {children}
        </MemeCatContext.Provider>
    );
};

// Custom hook for accessing context
export const useMemeCat = () => useContext(MemeCatContext);
