import React, { createContext, useContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email); // Authenticated user ka email set ho jayega
            } else {
                setUserEmail(""); // Logout hone par email reset
            }
        });

        return unsubscribe; // Cleanup on unmount
    }, []);

    return (
        <UserContext.Provider value={{ userEmail, setUserEmail }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
