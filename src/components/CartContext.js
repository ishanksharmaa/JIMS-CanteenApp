import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs, setDoc, doc, query, where, deleteDoc } from "firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useUser } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, userEmail } = useUser();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCart(userEmail);
        } else {
            setCartItems([]);
        }
    }, [user]);

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

                setCartItems((prev) => [...prev, product]);
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

                setCartItems((prev) => prev.filter(item => item.title !== title));
                console.log(`🧹 Removed ${title} from cart`);
            } else {
                console.warn("😕 User not found for removal");
            }
        } catch (error) {
            console.error("🔥 Error removing from Firestore:", error);
        }
    };

    const updateQuantity = async (title, quantity) => {
  try {
    const q = query(collection(db, "cart"), where("title", "==", title));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      const docRef = doc(db, "cart", docSnap.id);
      await updateDoc(docRef, {
        quantity: quantity
      });
    });
  } catch (error) {
    console.error("Quantity update failed: ", error);
  }
};


    return (
        <CartContext.Provider value={{ cartItems, addedToCart, removedFromCart, fetchCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
