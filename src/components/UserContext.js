import React, { createContext, useContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email || null); // Email set ho raha hai
                
                fetchData(user.email); // ✅ Auto fetch
            } else {
                setUserEmail("");
                setUsername("");
                setName("");
                setDob("");
                setLocation("");
            }
        });

        return ()=> unsubscribe();
    }, []);

    // 🛠️ Firestore se user data fetch karne ka function
    const fetchData = async (email) => {
        if (!email) return;

        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0].data();
                setUsername(userDoc.username || "");
                setUserEmail(userDoc.email || "");
                setName(userDoc.name || "");
                setDob(userDoc.dob || "");
                setLocation(userDoc.location || "");
            } else {
                console.log("User not found in Firestore");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <UserContext.Provider value={{
            userEmail,
            username,
            name,
            dob,
            location,
            // refreshUser, // ✅ Isko kahin bhi call karo, pura data reload ho jayega
        }}>
            {children}
        </UserContext.Provider>
    );
};

// ✅ Kahin bhi import karke bas `useUser()` likho, khud fetch hoga!
export const useUser = () => {
    const context = useContext(UserContext);
    // context.refreshUser(); // ✅ Ye likhne se har jagah auto-fetch hoga
    return context;
};
