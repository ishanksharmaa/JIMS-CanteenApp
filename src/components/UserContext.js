import React, { createContext, useContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [location, setLocation] = useState("");

    const refreshUser = () => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(true)
                setUserEmail(user.email || null);

                fetchData(user.email); // ✅ Auto fetch
            } else {
                setUser(false)
                setUserEmail("");
                setUsername("");
                setName("");
                setDob("");
                setLocation("");
            }
        });

        return () => unsubscribe();
    }

    useEffect(() => {
        const unsubscribe = refreshUser();
        // addedToCart(product);
        return unsubscribe;
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
                const userDoc = snapshot.docs[0];
                const userData = userDoc.data();
                const uid = userDoc.id; // 💡 Yahan mila correct uid!

                // 🛒 Ab yahan banayenge cartRef
                const cartRef = collection(db, "Users", uid, "Cart");
                const cartSnap = await getDocs(cartRef);
                const cartItems = cartSnap.docs.map(doc => doc.data());

                setUsername(userData.username || "");
                setUserEmail(userData.email || "");
                setName(userData.name || "");
                setDob(userData.dob || "");
                setLocation(userData.location || "");

                console.log("📦 Cart Items:", cartItems);
            } else {
                console.log("🚫 User not found in Firestore");
            }
        } catch (error) {
            console.error("💥 Error fetching data:", error);
        }
    };



    const addedToCart = async (product) => {
        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const uid = userDoc.id;

                // 🛒 Unique product key using title or random ID
                const productRef = doc(db, "Users", uid, "Cart", product.title);

                await setDoc(productRef, product); // Adds or updates
                console.log("✅ Product added to Firestore cart");
            }
        } catch (error) {
            console.error("🔥 Error adding to cart:", error);
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
            refreshUser, // ✅ Isko kahin bhi call karo, pura data reload ho jayega
            addedToCart,
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
