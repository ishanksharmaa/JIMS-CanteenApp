import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs, setDoc, doc, query, where, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import auth from "@react-native-firebase/auth";
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "./UserContext";
// import RazorpayCheckout from 'razorpay-react-native';
import RazorpayCheckout from 'react-native-razorpay';
// import { useNavigation, useFocusEffect } from "@react-navigation/native";


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, userEmail, order } = useUser();
    const [cartItems, setCartItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [orderCount, setOrderCount] = useState([]);
    const [favItems, setFavItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [favorites, setFavorites] = useState([]);
    // const [favoriteProducts, setFavoriteProducts] = useState([]);
    const isFavorite = (title) => favorites.includes(title);
    const isInCart = (title) => cartItems.some(item => item.title === title);
    // const isInOrders = (title) => orderedItems.some(item => item.title === title);
    const [productItems, setProductItems] = useState([]);
    const [singleProduct, setSingleProduct] = useState([]);
    // const navigation = useNavigation();


    useEffect(() => {
        if (user) {
            fetchCart(userEmail);

            const loadFavorites = async () => {
                try {
                    const savedFavorites = await AsyncStorage.getItem('favorites');
                    if (savedFavorites) {
                        setFavorites(JSON.parse(savedFavorites));
                    }
                } catch (error) {
                    console.error("Error loading favorites:", error);
                }
            };
            loadFavorites();
        } else {
            setCartItems([]);
            setOrderItems([]);
            setFavItems([]);
        }
    }, [user]);

    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error("Error saving favorites:", error);
            }
        };
        saveFavorites();
    }, [favorites]);

    useEffect(() => {
        sumAmount(cartItems); // totalAmount auto update when cartItems change
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
                    totalAmount: total,
                    billAmount: 0,
                });

                console.log("💾 Total amount updated in Firestore:", total);
            }
        } catch (error) {
            console.error("🚫 Error updating totalAmount in Firestore:", error);
        }
    };


    const fetchProducts = async (setProductItems) => {
        try {

            const productPromise = firestore().collection("Products").get(); // Fetching products
            let productItems = [];

            const productSnapshot = await productPromise; // Awaiting the product data
            productSnapshot.forEach(doc => {
                productItems.push({ id: doc.id, ...doc.data() });
            });

            setProductItems(productItems);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchProductByTitle = async (title) => {
        try {
            const snapshot = await firestore()
                .collection("Products")
                .where("name", "==", title)
                .get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data()
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
    };


    const fetchCart = async (email) => {
        try {
            if (!user) {
                onAddtoCart("person", "Login required!", "to add items into the cart", true);
            };

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const cartRef = collection(db, "Users", userId, "Cart");
                const cartSnap = await getDocs(cartRef);

                const productsRef = collection(db, "Products");

                const validItems = [];

                for (const docSnap of cartSnap.docs) {
                    const itemData = docSnap.data();
                    const productDoc = await getDocs(query(productsRef, where("name", "==", itemData.title)));

                    if (!productDoc.empty) {
                        // validItems.push(itemData);
                        validItems.push({
                            ...itemData,
                            descr: itemData.descr,
                            available: itemData.available,
                            qty: itemData.qty || 1,  // 👈 Add qty directly into item object
                        });
                    } else {
                        // product no longer exists, remove from cart
                        await deleteDoc(docSnap.ref);
                        console.warn(`🗑️ Removed orphan cart item: ${itemData.title}`);
                    }
                }

                setCartItems(validItems);
                sumAmount(validItems);
            } else {
                console.warn("😕 No matching user found for email:", email);
            }
        } catch (error) {
            console.error("💥 Error fetching & cleaning cart:", error);
        }
    };


    const fetchOrders = async (email, filter = false, cancel = false) => {
        try {
            if (!user) {
                onAddtoCart("person", "Login required!", "to add items into the cart", true);
                return;
            };

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;
                const ordersRef = collection(db, "Users", userId, "Orders");
                let deletedCount = 0;

                // Clear all orders if cancel is true
                if (cancel) {
                    const cancelSnap = await getDocs(ordersRef);
                    const cancelPromises = [];

                    cancelSnap.docs.forEach(docSnap => {
                        cancelPromises.push(deleteDoc(docSnap.ref));
                    });

                    await Promise.all(cancelPromises);
                    onAddtoCart("checkmark", "Order Cancelled!", "All your orders are removed", false);

                    // Clear local state immediately
                    setOrderItems([]);
                    sumAmount([]);
                    return; // Exit after clearing all orders
                }

                // First pass - delete items if filtering
                if (filter) {
                    const deleteSnap = await getDocs(ordersRef);
                    const deletePromises = [];

                    deleteSnap.docs.forEach(docSnap => {
                        const itemData = docSnap.data();
                        if (itemData.status === true) {
                            deletedCount++;
                            deletePromises.push(deleteDoc(docSnap.ref));
                            console.log(`🔥 Deleting order: ${itemData.title}`);
                        }
                    });

                    await Promise.all(deletePromises);
                }

                // Second pass - get updated orders
                const updatedSnap = await getDocs(ordersRef);
                const productsRef = collection(db, "Products");
                const validItems = [];

                for (const docSnap of updatedSnap.docs) {
                    const itemData = docSnap.data();
                    const productDoc = await getDocs(query(productsRef, where("name", "==", itemData.title)));

                    if (!productDoc.empty) {
                        validItems.push({
                            ...itemData,
                            descr: itemData.descr,
                            available: itemData.available,
                            qty: itemData.qty || 1,
                        });
                    } else {
                        await deleteDoc(docSnap.ref);
                        console.warn(`🗑️ Removed orphan item: ${itemData.title}`);
                    }
                }

                setOrderItems(validItems);
                setOrderCount(validItems.length);
                sumAmount(validItems);

                if (deletedCount > 0) {
                    onAddtoCart("checkmark", "Removed Successfully!", "Ready items removed", false);
                } else if (filter) {
                    onAddtoCart("alert-circle", "No Ready Items!", "to be removed", true);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            onAddtoCart("alert-circle", "Error", "Failed to process orders", true);
        }
    };



    const addedToCart = async (product) => {
        try {
            // const alreadyExists = cartItems.some(item => item.title === product.title);
            // if (alreadyExists) {
            //     // alert(`⚠️ ${product.title.charAt(0).toUpperCase() + product.title.slice(1) } already in cart!`);
            //     alert(`⚠️ ${product.title.toUpperCase()} already in cart!\n\nIncrease product quantity from the cart.`);
            //     return;
            // }

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

                onAddtoCart("cart", product.title, "Added to cart", false)
                console.log("✅ Product added to Firestore cart");
            }
        } catch (error) {
            console.error("🔥 Error adding to Cart:", error);
        }
    };

    const onAddtoCart = (icon, productName, msg, negative = false, time = 2500) => {
        Toast.show({
            type: 'success',
            text1: productName,
            text2: msg,
            props: { icon, negative },
            position: 'top',
            visibilityTime: time,
            autoHide: true,
            topOffset: 50,
        });
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
                onAddtoCart("remove-circle", title, "Removed from cart", true);
                console.log(`🧹 Removed ${title} from cart`);
            } else {
                console.warn("😕 User not found for removal");
            }
        } catch (error) {
            console.error("🔥 Error removing from Firestore:", error);
        }
    };

    const addedToOrders = async (product) => {
        try {
            // const alreadyExists = cartItems.some(item => item.title === product.title);
            // if (alreadyExists) {
            //     // alert(`⚠️ ${product.title.charAt(0).toUpperCase() + product.title.slice(1) } already in cart!`);
            //     alert(`⚠️ ${product.title.toUpperCase()} already in cart!\n\nIncrease product quantity from the cart.`);
            //     return;
            // }

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const uid = userDoc.id;

                const productRef = doc(db, "Users", uid, "Orders", product.title);
                await setDoc(productRef, product);

                setOrderItems((prev) => {
                    const updated = [...prev, product];
                    sumAmount(updated);
                    return updated;
                });

                // onAddtoCart("cart", product.title, "Added to cart", false)
                console.log("✅ Product added to Firestore cart");
            }
        } catch (error) {
            console.error("🔥 Error adding to Cart:", error);
        }
    };

    const updateQuantity = async (itemTitle, newQuantity) => {
        if (!isInCart) {
            return;
        }
        else {

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
                        qty: newQuantity,
                        amount: newQuantity * item.price,
                    });

                    // Update local cartItems state too
                    setCartItems(prev => {
                        const updated = prev.map(item =>
                            item.title === itemTitle
                                ? { ...item, qty: newQuantity, amount: newQuantity * item.price }
                                : item
                        );
                        sumAmount(updated);
                        return updated;
                    });

                    console.log(`🔄 Updated ${itemTitle} qty to ${newQuantity}`);
                }
            } catch (err) {
                console.error("🚫 Error updating qty:", err);
            }
        }
    };


    const toggleFavoriteItem = async (title) => {
        if (!user) {
            onAddtoCart("alert-circle", "Login required!", "or SignUp to continue", true, 2000)
            return;
        }
        try {
            if (isFavorite(title)) {
                await removedFromFav(title);
                setFavorites(prev => prev.filter(t => t !== title));
            } else {
                await addedToFav(title);
                setFavorites(prev => [...prev, title]);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const fetchFavorites = async (userEmail) => {
        try {
            if (!userEmail) return;

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const favRef = collection(db, "Users", userId, "Favorites");
                const favSnap = await getDocs(favRef);

                const favoriteTitles = favSnap.docs.map(doc => doc.data().title);
                setFavorites(favoriteTitles);

                // Fetch full product details for each favorite
                const productsRef = collection(db, "Products");
                const productsQuery = query(productsRef, where("name", "in", favoriteTitles));
                const productsSnap = await getDocs(productsQuery);

                const favoriteProducts = productsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setFavItems(favoriteProducts);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            throw error;
        }
    };


    const addedToFav = async (title) => {
        try {
            // const alreadyExists = favItems.some(item => item.title === title);
            // if (alreadyExists) {
            //     alert(`❤️ ${title.toUpperCase()} is already in your favorites!`);
            //     return;
            // }

            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const uid = userDoc.id;

                // First fetch the full product details from Products collection
                const productsRef = collection(db, "Products");
                const productQuery = query(productsRef, where("name", "==", title));
                const productSnap = await getDocs(productQuery);

                if (!productSnap.empty) {
                    const productDoc = productSnap.docs[0];
                    const productData = productDoc.data();

                    // Store in Favorites with title as document ID
                    const favRef = doc(db, "Users", uid, "Favorites", title);
                    await setDoc(favRef, {
                        title: title,
                        timestamp: new Date().toISOString()
                    });

                    setFavItems(prev => [...prev, {
                        title: title,
                    }]);

                    // onAddtoCart("heart", title, "Added to favorites", false, 1000);
                    console.log("✅ Product added to Firestore fav");
                } else {
                    alert("Product not found in database");
                }
            }
        } catch (error) {
            console.error("🔥 Error adding to fav:", error);
            alert("Failed to add to favorites. Please try again.");
        }
    };

    const removedFromFav = async (title) => {
        try {
            const db = getFirestore();
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userId = userDoc.id;

                const favRef = doc(db, "Users", userId, "Favorites", title);
                await deleteDoc(favRef);

                setFavItems(prev => prev.filter(item => item.title !== title));
                // onAddtoCart("heart-dislike", title, "Removed from favorites", true, 1000);
                console.log(`🧹 Removed ${title} from fav`);
            }
        } catch (error) {
            console.error("🔥 Error removing from favorites:", error);
            alert("Failed to remove from favorites");
        }
    };

    const orderPlaced = async (userEmail, fromCart, product) => {
        if (!userEmail) return;

        try {
            const db = getFirestore();

            // 1. Get user reference
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.error("No user found with email:", userEmail);
                throw new Error("User document not found");
            }

            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;

            // 2. Process cart items to orders
            const cartRef = collection(db, "Users", userId, "Cart");
            const ordersRef = collection(db, "Users", userId, "Orders");
            const cartSnapshot = await getDocs(cartRef);

            const newOrderedItems = [];
            const batch = writeBatch(db);

            if (fromCart) {

                // Process each cart item
                for (const cartDoc of cartSnapshot.docs) {
                    const cartData = cartDoc.data();
                    const orderDocRef = doc(ordersRef, cartDoc.id);

                    batch.set(orderDocRef, {
                        ...cartData,
                        orderedAt: new Date().toISOString(),
                        status: false,
                        orderId: `${userId}_${Date.now()}`, // Unique order ID
                    });

                    newOrderedItems.push({
                        id: cartDoc.id,
                        ...cartData
                    });

                    // Delete from cart
                    batch.delete(cartDoc.ref);
                }
            }
            else {
                // Generate a new order document reference
                // const orderDocRef = doc(ordersRef, product.title.toLowerCase());
                const orderDocRef = doc(ordersRef);

                batch.set(orderDocRef, {
                    ...product, // directly spread product details
                    // orderedAt: new Date().toISOString(),
                    orderedAt: formatOrderDate(new Date().toISOString()),
                    status: false,
                    orderId: `${userId}_${formatOrderDate(Date.now())}`
                });

                // Track locally if needed
                newOrderedItems.push({
                    id: product.title,
                    ...product
                });
            }

            // Update user document
            const userDocRef = doc(db, "Users", userId);
            batch.update(userDocRef, {
                order: "placed",
                billAmount: totalAmount,
                updatedAt: new Date().toISOString()
            });

            // Commit all changes
            await batch.commit();

            // Update local state
            setOrderItems(prev => [...prev, ...newOrderedItems]);
            setCartItems([]);
            setTotalAmount(0);

            // navigation.navigate("Orders");

            return true;
        } catch (error) {
            console.error("Error placing order:", error);
            throw error;
        }
    };

    // utils/dateFormatter.js
    const formatOrderDate = (isoString) => {
        const date = new Date(isoString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year}  ${hours}:${minutes}`;
    };


    //RAZORPAY TEST MODE FUNCTION

    const RAZORPAY_KEY_ID = 'rzp_test_lx2EcEurRJmjQa';

    const handlePayment = (payingAmount, fromCart, product) => {
        const options = {
            description: 'Canteen Order Payment',
            image: require('../../assets/app_logo.jpeg'), // optional logo
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: payingAmount * 100, // = ₹100 (in paise)
            name: 'JIMS Canteen',
            prefill: {
                email: 'user@gmail.com',
                contact: '9876543xxx',
                name: 'Ishank Sharma',
            },
            theme: { color: '#E53935' },
        };

        RazorpayCheckout.open(options)
            .then((data) => {
                console.log('✅ Payment Success:', data.razorpay_payment_id);
                alert('Payment Successful!');
                // You can save payment ID in Firestore or confirm order here
                orderPlaced(userEmail, fromCart, product);
            })
            .catch((error) => {
                console.log(`❌ Error: ${error.code} | ${error.description}`);
                alert('Payment Failed. Try again.');
            });

    };

    const handlingPayment = (fromCart, payingAmount, product) => {
        if (!user) {
            onAddtoCart("alert-circle", "Login required!", "or SignUp to continue", true, 2000);
            return;
        }
        if (fromCart && cartItems.length === 0) {
            onAddtoCart("alert-circle", "Cart is Empty!", "first add items in the cart.", true, 2000);
            return;
        }
        handlePayment(payingAmount, fromCart, product);
    };



    return (
        <CartContext.Provider value={{
            cartItems,
            setCartItems,
            orderItems,
            setOrderItems,
            orderCount,
            setOrderCount,
            favItems,
            setFavItems,
            addedToCart,
            removedFromCart,
            addedToFav,
            removedFromFav,
            fetchCart,
            fetchOrders,
            updateQuantity,
            totalAmount,
            onAddtoCart,
            toggleFavoriteItem,
            isFavorite,
            favorites,
            fetchFavorites,
            productItems,
            setProductItems,
            fetchProducts,
            singleProduct,
            setSingleProduct,
            fetchProductByTitle,
            orderPlaced,
            formatOrderDate,
            handlePayment,
            handlingPayment,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
