import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs, setDoc, doc, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useUser } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, userEmail } = useUser();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchCart(userEmail);
        } else {
            setCartItems([]);
        }
    }, [user]);

    useEffect(() => {
        sumAmount(cartItems); // jab bhi cartItems change honge, totalAmount auto update
    }, [cartItems]);

    const sumAmount = async (items) => {
        const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        setTotalAmount(total);

        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const userDocRef = doc(db, "Users", userId);
                await updateDoc(userDocRef, {
                    totalAmount: total
                });

                console.log("💾 Total amount updated in Firestore:", total);
            }
        } catch (error) {
            console.error("🚫 Error updating totalAmount in Firestore:", error);
        }
    };


    const fetchCart = async (email) => {
        try {
            if (!email) return;

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const cartRef = collection(db, "Users", userId, "Cart");
                const cartSnap = await getDocs(cartRef);
                const items = cartSnap.docs.map(doc => doc.data());

                setCartItems(items);

                sumAmount(items);

            } else {
                console.warn("😕 No matching user found for email:", email);
            }
        } catch (error) {
            console.error("💥 Error fetching cart:", error);
        }
    };


    const addedToCart = async (product) => {
        try {
            const alreadyExists = cartItems.some(item => item.title === product.title);
            if (alreadyExists) {
                alert("⚠️ Item already in cart");
                return;
            }

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const uid = userDoc.id;

                const productRef = doc(db, "Users", uid, "Cart", product.title);
                await setDoc(productRef, product);

                setCartItems((prev) => {
                    const updated = [...prev, product];
                    sumAmount(updated);
                    return updated;
                });
                console.log("✅ Product added to Firestore cart");
            }
        } catch (error) {
            console.error("🔥 Error adding to cart:", error);
        }
    };

    const removedFromCart = async (title) => {
        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const cartRef = collection(db, "Users", userId, "Cart");
                const itemQuery = query(cartRef, where("title", "==", title));
                const itemSnap = await getDocs(itemQuery);

                for (const docSnap of itemSnap.docs) {
                    await deleteDoc(docSnap.ref);
                }

                setCartItems((prev) => {
                    const updated = prev.filter(item => item.title !== title);
                    sumAmount(updated);
                    return updated;
                });
                console.log(`🧹 Removed ${title} from cart`);
            } else {
                console.warn("😕 User not found for removal");
            }
        } catch (error) {
            console.error("🔥 Error removing from Firestore:", error);
        }
    };

    const updateQuantity = async (itemTitle, newQuantity) => {
        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const item = cartItems.find(item => item.title === itemTitle);

                const itemRef = doc(db, "Users", userId, "Cart", itemTitle);
                await updateDoc(itemRef, {
                    quantity: newQuantity,
                    amount: newQuantity * item.price,
                });

                // Update local cartItems state too
                setCartItems(prev => {
                    const updated = prev.map(item =>
                        item.title === itemTitle
                            ? { ...item, quantity: newQuantity, amount: newQuantity * item.price }
                            : item
                    );
                    sumAmount(updated);
                    return updated;
                });

                console.log(`🔄 Updated ${itemTitle} quantity to ${newQuantity}`);
            }
        } catch (err) {
            console.error("🚫 Error updating quantity:", err);
        }
    };



    return (
        <CartContext.Provider value={{ cartItems, addedToCart, removedFromCart, fetchCart, updateQuantity, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
