import React, { createContext, useState, useContext } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useUser } from "../components/UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userEmail, setUserEmail, username, setUsername, name, setName, dob, setDob, location, setLocation, refreshUser, user, addedToCart } = useUser();

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]); // ✅ Latest state maintain karega
  };

  const removeFromCart = async (productId, title) => {
    try {
      const userId = auth().currentUser.uid;
      if(!userId){
        alert("user not logged in!!");
        return;
      }

      const cartRef = firestore().collection('Users').doc(userId).collection('Cart').doc(productId);
      // const snapshot = await cartRef.where('title', '==', title).get();
      await cartRef.delete();
      setCartItems((prevItems) => prevItems.filter(item => item.title !== title));
      refreshUser();

      // snapshot.forEach((doc) => {
      //   doc.ref.delete(); // deletes the item
      // });

      console.log(`Removed ${productId} from Firebase Cart!`);
      // You can also update local state here
    } catch (error) {
      console.error("Error removing item from Firebase:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);