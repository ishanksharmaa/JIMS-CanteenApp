import React, { createContext, useContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState("");
    const [order, setOrder] = useState(null);

    const refreshUser = () => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(true);
                setUserEmail(user.email || null);
                fetchData(user.email);
            } else {
                setUser(false);
                setUserEmail("");
                setUsername("");
                setName("");
                setDob("");
                setLocation("");
                setImage("");
                setOrder(null);
            }
        });

        return () => unsubscribe();
    };

    useEffect(() => {
        const unsubscribe = refreshUser();
        return unsubscribe;
    }, []);

    const fetchData = async (email) => {
        if (!email) return;
        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userData = userDoc.data();
                setUsername(userData.username || "");
                setUserEmail(userData.email || "");
                setName(userData.name || "");
                setDob(userData.dob || "");
                setLocation(userData.location || "");
                setImage(userData.image || "");
                setOrder(userData.order || null);
            }
        } catch (error) {
            console.error("💥 Error fetching user data:", error);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            userEmail,
            username,
            name,
            dob,
            location,
            image,
            order,
            setOrder,
            refreshUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
